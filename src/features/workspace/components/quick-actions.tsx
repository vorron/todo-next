'use client';

import { Button } from '@/shared/ui';

export interface QuickActionsProps {
  onReportsClick: () => void;
  onProjectsClick: () => void;
  onTimeEntryClick: () => void;
  onSettingsClick: () => void;
  className?: string;
}

export function QuickActions({
  onReportsClick,
  onProjectsClick,
  onTimeEntryClick,
  onSettingsClick,
  className,
}: QuickActionsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      <Button variant="outline" className="h-20" onClick={onReportsClick}>
        <div className="text-center">
          <div className="text-lg">📊</div>
          <div className="text-sm">Reports</div>
        </div>
      </Button>
      <Button variant="outline" className="h-20" onClick={onProjectsClick}>
        <div className="text-center">
          <div className="text-lg">📝</div>
          <div className="text-sm">Projects</div>
        </div>
      </Button>
      <Button variant="outline" className="h-20" onClick={onSettingsClick}>
        <div className="text-center">
          <div className="text-lg">⚙️</div>
          <div className="text-sm">Settings</div>
        </div>
      </Button>
      <Button variant="outline" className="h-20" onClick={onTimeEntryClick}>
        <div className="text-center">
          <div className="text-lg">⏱️</div>
          <div className="text-sm">Time Entry</div>
        </div>
      </Button>
    </div>
  );
}
