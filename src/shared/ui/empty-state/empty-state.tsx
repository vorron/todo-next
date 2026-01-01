import { cn } from '@/shared/lib/utils';

import { Button } from '../button';

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
