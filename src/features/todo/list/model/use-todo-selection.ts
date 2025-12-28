'use client';

import { useMemo, useState } from 'react';

interface TodoSelectionValue {
  selectedIds: string[];
  toggleSelection(id: string): void;
  selectIds(ids: string[]): void;
  clearSelection(): void;
  checkSelected(id: string): boolean;
}

export function useTodoSelectionState(): TodoSelectionValue {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return useMemo<TodoSelectionValue>(
    () => ({
      selectedIds,
      toggleSelection: (id: string) =>
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        ),
      selectIds: (ids: string[]) => setSelectedIds(ids),
      clearSelection: () => setSelectedIds([]),
      checkSelected: (id: string) => selectedIds.includes(id),
    }),
    [selectedIds],
  );
}
