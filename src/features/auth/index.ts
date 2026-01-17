// 🎯 Auth.js based hooks (новая эталонная система)
export { useAuth, useUserId, useSession } from './model/use-auth';

// Server-side utilities
export { getCurrentUserId, getSession, requireAuth, verifyAuth } from './lib/server/auth-server';

// Auth.js функции
export { auth, signIn, signOut } from './lib/auth';

// UI Components (пока оставляем, будут обновлены)
export { LoginForm } from './ui/login-form';
export { LogoutButton } from './ui/logout-button';
export { UserMenu } from './ui/user-menu';

// Types
export type { LoginDto, Session, AuthState } from './model/types';
