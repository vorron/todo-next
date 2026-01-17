'use client';

import { Clock } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/shared/ui';

export interface TimeEntryViewProps {
  className?: string;
}

export function TimeEntryView({ className }: TimeEntryViewProps) {
  return (
    <Card className={className}>
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-4">
          <Clock className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Start Timer</h2>
        <p className="text-muted-foreground">Track your time efficiently</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Заглушка таймера - временно */}
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Timer functionality coming soon</p>
          <p className="text-sm text-gray-500 mt-2">
            This will be the main time tracking interface
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
