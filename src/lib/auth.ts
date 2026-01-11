/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import { env } from '@/shared/config/env';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
    };
  }

  interface User {
    id: string;
    username: string;
    name: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    username: string;
    name: string;
  }
}

const credentialsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        try {
          const response = await fetch(`${env.NESTJS_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedCredentials.data),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          return {
            id: data.user.id,
            username: data.user.username,
            name: data.user.name,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt' as const,
  },

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.name = token.name;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
