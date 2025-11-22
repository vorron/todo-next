'use client';

import UserSelector from '@/components/auth/UserSelector';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 max-w-4xl mx-auto px-4">
      <UserSelector />
    </div>
  );
}