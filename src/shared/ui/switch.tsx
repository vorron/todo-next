'use client';

import * as React from 'react';

import { cn } from '@/shared/lib/utils';

import { Switch as SwitchPrimitive } from './switch-primitive';

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive> {
  label?: string;
}

const Switch = React.forwardRef<React.ComponentRef<typeof SwitchPrimitive>, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    if (label) {
      return (
        <div className="flex items-center gap-2">
          <SwitchPrimitive ref={ref} id={switchId} className={cn(className)} {...props} />
          <label htmlFor={switchId} className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </label>
        </div>
      );
    }

    return <SwitchPrimitive ref={ref} id={switchId} className={cn(className)} {...props} />;
  },
);
Switch.displayName = 'Switch';

export { Switch };
