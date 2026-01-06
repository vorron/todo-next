import { AlertCircle } from 'lucide-react';

import { ErrorStateCard } from './error-state-card/error-state-card';

interface DataErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  _className?: string;
}

/**
 * Стандартный компонент для ошибок загрузки данных
 * Использует существующую архитектуру ErrorStateCard + EmptyState
 */
export function DataErrorState({
  title = 'Error',
  description = 'Failed to load data',
  retryLabel = 'Retry',
  onRetry,
  _className,
}: DataErrorStateProps) {
  return (
    <ErrorStateCard
      icon={<AlertCircle className="w-8 h-8 text-red-500" />}
      title={title}
      description={description}
      actionLabel={onRetry ? retryLabel : undefined}
      onAction={onRetry}
    />
  );
}
