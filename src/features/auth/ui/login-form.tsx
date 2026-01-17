'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input-primitive';

import { loginSchema } from '../model/auth-schema';
import { useAuth } from '../model/use-auth';

import type { LoginDto } from '../model/types';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginDto) => {
    setServerError('');
    setResetMessage('');

    const result = await login(data);

    if (!result.success) {
      setServerError(result.message);
    }
  };

  const handleResetPassword = async () => {
    const username = form.getValues('username');

    if (!username) {
      setServerError('Введите имя пользователя для сброса пароля');
      return;
    }

    setIsResetting(true);
    setServerError('');
    setResetMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetMessage(`✅ Пароль сброшен! Новый пароль: ${data.defaultPassword}`);
      } else {
        setServerError(data.error || 'Ошибка сброса пароля');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setServerError('Ошибка сети. Попробуйте позже.');
    } finally {
      setIsResetting(false);
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
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

            {resetMessage && (
              <div
                className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600"
                role="alert"
              >
                {resetMessage}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResetPassword}
                disabled={isResetting || isLoading}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isResetting ? 'Сброс...' : 'Сбросить пароль'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
