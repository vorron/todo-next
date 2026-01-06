import { PageLoader } from './loading';

interface DataLoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Стандартный компонент для состояния загрузки данных
 * Использует существующий PageLoader с контейнером
 */
export function DataLoadingState({ message = 'Loading...', className }: DataLoadingStateProps) {
  return (
    <div className={`container mx-auto py-8 ${className || ''}`}>
      <div className="max-w-2xl mx-auto">
        <PageLoader message={message} />
      </div>
    </div>
  );
}
