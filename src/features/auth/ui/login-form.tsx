'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input-primitive';
import { useAuth } from '../model/use-auth';
import { loginSchema } from '../model/auth-schema';
import type { LoginDto } from '../model/types';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = useState('');

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (data: LoginDto) => {
    setServerError('');

    const result = await login(data);

    if (!result.success) {
      setServerError(result.message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login to Todo App</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      autoComplete="username"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <div
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                role="alert"
              >
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Mock auth: use any username from the users list
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
