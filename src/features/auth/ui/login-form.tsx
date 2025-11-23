'use client';

import { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { useAuth } from '../model/use-auth';
import { validateLoginForm } from '../lib/validation';

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
            return;
        }

        setErrors({});

        // Попытка логина
        const result = await login({ username });

        if (!result.success) {
            setGeneralError(result.message);
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
                        onChange={(e) => setUsername(e.target.value)}
                        error={errors.username}
                        placeholder="Enter your username"
                        disabled={isLoading}
                        autoComplete="username"
                    />

                    {generalError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {generalError}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                        disabled={isLoading}
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