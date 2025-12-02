import { Button } from '../button';
import { cn } from '@/shared/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>

      {description && (
        <p className="mt-2 text-sm text-gray-600 text-center max-w-sm">{description}</p>
      )}

      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Готовые варианты
export function EmptyTodos({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      }
      title="No todos yet"
      description="Get started by creating your first todo item"
      action={{
        label: 'Create Todo',
        onClick: onCreateClick,
      }}
    />
  );
}

export function EmptySearchResults() {
  return (
    <EmptyState
      icon={
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="No results found"
      description="Try adjusting your search or filter criteria"
    />
  );
}
