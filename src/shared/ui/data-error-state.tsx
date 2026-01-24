import { AlertCircle } from 'lucide-react';

import { getErrorMessage, type ApiError } from '@/shared/lib/errors/api-error-handler';

import { ErrorStateCard } from './error-state-card/error-state-card';

interface DataErrorStateProps {
  title?: string;
  description?: string;
  error?: ApiError;
  retryLabel?: string;
  onRetry?: () => void;
  _className?: string;
}

/**
 * Стандартный компонент для ошибок загрузки данных
 * Использует существующую архитектуру ErrorStateCard + EmptyState
 * Автоматически извлекает сообщение из error объекта или использует description
 */
export function DataErrorState({
  title = 'Error',
  description,
  error,
  retryLabel = 'Retry',
  onRetry,
  _className,
}: DataErrorStateProps) {
  // Приоритет у description для обратной совместимости
  const errorMessage = description || (error ? getErrorMessage(error) : 'Failed to load data');

  return (
    <ErrorStateCard
      icon={<AlertCircle className="w-8 h-8 text-red-500" />}
      title={title}
      description={errorMessage}
      actionLabel={onRetry ? retryLabel : undefined}
      onAction={onRetry}
    />
  );
}
