import { Skeleton } from '@/shared/ui/skeleton-primitive';

import { TodoCardSkeleton } from './todo-card-skeleton';

export function ListSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <Skeleton className="h-4 w-20 mt-1" />
      </div>

      <div className="space-y-3">
        <TodoCardSkeleton />
        <TodoCardSkeleton />
        <TodoCardSkeleton />
        <TodoCardSkeleton />
        <TodoCardSkeleton />
      </div>
    </div>
  );
}
