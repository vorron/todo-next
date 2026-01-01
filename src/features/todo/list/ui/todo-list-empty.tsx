import { ClipboardList, Search } from 'lucide-react';

import { EmptyState } from '@/shared/ui';

export function TodoListEmpty({ hasSearch }: { hasSearch: boolean }) {
  return hasSearch ? (
    <EmptyState
      icon={<Search className="w-8 h-8 text-gray-400" />}
      title="No results found"
      description="Try adjusting your search or filter criteria"
    />
  ) : (
    <EmptyState
      icon={<ClipboardList className="w-8 h-8 text-gray-400" />}
      title="No todos yet"
      description="Get started by creating your first todo item"
    />
  );
}
