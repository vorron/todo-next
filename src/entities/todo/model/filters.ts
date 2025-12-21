import { FILTER_VALUES, type FilterType, type TodoSortBy } from './types';

export const FILTER_LABELS: Record<FilterType, string> = {
  all: 'All Todos',
  active: 'Active',
  completed: 'Completed',
};

export const FILTER_OPTIONS: Array<{ value: FilterType; label: string }> = FILTER_VALUES.map(
  (value) => ({
    value,
    label: FILTER_LABELS[value],
  }),
);

export const DEFAULT_FILTER: FilterType = 'all';
export const DEFAULT_SORT_BY: TodoSortBy = 'date';
export const DEFAULT_SEARCH = '';
