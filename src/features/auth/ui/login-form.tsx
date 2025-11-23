'use client';

import { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { useAuth } from '../model/use-auth';
import { validateLoginForm } from '../lib/validation';

// Константы для сообщений об ошибках
const ERROR_MESSAGES = {
    DEFAULT: 'An unexpected error occurred. Please try again.',
    VALIDATION: 'Please check your input and try again.',
} as const;

export function LoginForm() {
    const { login, isLoading } = useAuth();

    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        // Валидация
        const validation = validateLoginForm({ username });
        if (!validation.valid) {
            setErrors(validation.errors);
            setGeneralError(ERROR_MESSAGES.VALIDATION);
            return;
        }

        setErrors({});

        // Попытка логина
        const result = await login({ username });

        if (!result.success) {
            // Используем сообщение из результата или fallback
            const errorMessage = result.message || ERROR_MESSAGES.DEFAULT;
            setGeneralError(errorMessage);
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);

        // Очищаем ошибки при изменении значения
        if (errors.username || generalError) {
            setErrors({});
            setGeneralError('');
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Login to Todo App</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        error={errors.username}
                        placeholder="Enter your username"
                        disabled={isLoading}
                        autoComplete="username"
                        required
                    />

                    {generalError && (
                        <div
                            className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                            role="alert"
                        >
                            {generalError}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                        disabled={isLoading || !username.trim()}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>

                    <div className="text-sm text-gray-500 text-center">
                        Mock auth: use any username from the users list
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}