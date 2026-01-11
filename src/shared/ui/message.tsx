import { AlertCircle, Info } from 'lucide-react';

import { Button } from './button';

interface MessageProps {
  message: string;
  variant?: 'info' | 'error' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

const variantConfig = {
  info: {
    icon: <Info className="w-8 h-8 text-blue-500" />,
    className: 'text-blue-600',
  },
  error: {
    icon: <AlertCircle className="w-8 h-8 text-red-500" />,
    className: 'text-red-600',
  },
  warning: {
    icon: <AlertCircle className="w-8 h-8 text-yellow-500" />,
    className: 'text-yellow-600',
  },
} as const;

/**
 * Универсальный компонент для отображения сообщений с опциональными действиями
 * Поддерживает разные варианты (info/error/warning) и кастомные действия
 */
export function Message({ message, variant = 'info', action, className }: MessageProps) {
  const config = variantConfig[variant];

  return (
    <div className={`container mx-auto py-8 ${className || ''}`}>
      <div className="max-w-md mx-auto text-center">
        {config.icon}
        <p className={`mt-4 ${config.className}`}>{message}</p>
        {action && (
          <Button onClick={action.onClick} variant="outline" className="mt-4">
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

// Backward compatibility
export const MessageState = Message;
export const DataMessageState = Message;
