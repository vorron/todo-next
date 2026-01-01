import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton-primitive';

export function TodoCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border border-slate-200 rounded-lg p-4 transition-all hover:shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Skeleton className="h-4 w-4 mt-0.5" />

        {/* Content + Actions */}
        <div className="flex items-start gap-3 flex-1 min-w-0 justify-between">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <Skeleton className="h-5 w-3/4 mb-2" />

            {/* Meta info (priority, due date, tags) */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-4 w-12" /> {/* priority */}
              <Skeleton className="h-4 w-16" /> {/* due date */}
              <Skeleton className="h-4 w-20" /> {/* tag */}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
