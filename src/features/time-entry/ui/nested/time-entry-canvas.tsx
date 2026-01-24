import { type TimeEntry } from '@/entities/time-entry/model/schema';

export function TimeEntryCanvas({ timeEntries }: { timeEntries: TimeEntry[] }) {
  return <div>{timeEntries.length}</div>;
}
