'use client';

import { useAuth } from '@/features/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { LogoutButton } from '@/features/auth';

export function ProfilePage() {
  const { session } = useAuth();

  if (!session) return null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-lg text-gray-900 mt-1">{session.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <p className="text-lg text-gray-900 mt-1">@{session.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">User ID</label>
                <p className="text-sm text-gray-500 font-mono mt-1">{session.userId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Session expires</label>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(session.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-800">Sign out</h4>
                <p className="text-sm text-red-600 mt-1">
                  Sign out of your account. You&apos;ll need to sign in again to access your todos.
                </p>
              </div>
              <LogoutButton variant="danger" className="mt-3 sm:mt-0" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
