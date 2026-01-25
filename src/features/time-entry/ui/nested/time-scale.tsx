import { format } from 'date-fns';

import { cn } from '@/shared/lib/utils';

import { END_SCALE_HOUR, START_SCALE_HOUR } from '../../model/constants';

export function TimeScale() {
  const hours = Array.from(
    { length: END_SCALE_HOUR - START_SCALE_HOUR + 1 },
    (_, i) => START_SCALE_HOUR + i,
  );

  const currentHour = new Date().getHours();

  return (
    <div className="w-20 h-full flex flex-col">
      {hours.map((hour) => (
        <div key={hour} className="h-6 border-b border-gray-200 flex items-center px-2">
          <span
            className={cn(
              'text-xs text-gray-600',
              currentHour === hour && 'text-blue-700 font-semibold',
            )}
          >
            {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
          </span>
        </div>
      ))}
    </div>
  );
}
