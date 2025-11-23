'use client';

import { useAuth } from '@/features/auth';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/shared/ui';
import { useGetUsersQuery } from '@/entities/user';

export function TestAuthPage() {
    const { session, isAuthenticated, login, logout, isLoading } = useAuth();
    const { data: users } = useGetUsersQuery();

    return (
        <div className="container mx-auto py-8 px-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Auth Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
                    </div>
                    {session && (
                        <div>
                            <strong>User:</strong> {session.name} (@{session.username})
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={logout} disabled={!isAuthenticated || isLoading}>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                        {users?.map((user) => (
                            <Button
                                key={user.id}
                                variant="secondary"
                                onClick={() => login({ username: user.username })}
                                disabled={isLoading}
                            >
                                Login as {user.name}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}