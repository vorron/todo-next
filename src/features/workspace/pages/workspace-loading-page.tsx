'use client';

import { PageLoader } from '@/shared/ui';

export function WorkspaceLoadingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <PageLoader message="Loading workspace..." />
      </div>
    </div>
  );
}
