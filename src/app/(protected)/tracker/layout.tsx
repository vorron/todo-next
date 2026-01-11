import { type ReactNode } from 'react';

interface TrackerLayoutProps {
  children: ReactNode;
}

export default function TrackerLayout({ children }: TrackerLayoutProps) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">{children}</div>
    </div>
  );
}
