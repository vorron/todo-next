import { Card, CardContent } from '../card';
import { EmptyState } from '../empty-state';

interface ErrorStateCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Стандартный шаблон для ошибок/404 на странице:
 * контейнер + Card + EmptyState.
 */
export function ErrorStateCard({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: ErrorStateCardProps) {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={icon}
            title={title}
            description={description}
            action={
              actionLabel && onAction
                ? {
                    label: actionLabel,
                    onClick: onAction,
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
