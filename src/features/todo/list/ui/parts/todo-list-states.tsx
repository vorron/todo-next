import { ClipboardList } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptySearchResults,
  EmptyState,
  SkeletonList,
} from '@/shared/ui';

export function TodoListLoading({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <SkeletonList count={5} />
      </CardContent>
    </Card>
  );
}

export function TodoListEmpty({
  hasSearch,
  onCreateClick,
}: {
  hasSearch: boolean;
  onCreateClick?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Todos</CardTitle>
      </CardHeader>
      <CardContent>
        {hasSearch ? (
          <EmptySearchResults />
        ) : (
          <EmptyState
            icon={<ClipboardList className="w-8 h-8 text-gray-400" />}
            title="No todos yet"
            description="Get started by creating your first todo item"
            action={onCreateClick ? { label: 'Create Todo', onClick: onCreateClick } : undefined}
          />
        )}
      </CardContent>
    </Card>
  );
}
