'use client';

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

interface State {
  selectedIds: string[];
}

type Action =
  | { type: 'TOGGLE_ID'; id: string }
  | { type: 'SET_SELECTED_IDS'; ids: string[] }
  | { type: 'CLEAR' };

const initialState: State = {
  selectedIds: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CLEAR':
      return { ...state, selectedIds: [] };
    case 'SET_SELECTED_IDS':
      return { ...state, selectedIds: action.ids };
    case 'TOGGLE_ID': {
      const exists = state.selectedIds.includes(action.id);
      const updated = exists
        ? state.selectedIds.filter((x) => x !== action.id)
        : [...state.selectedIds, action.id];
      return { ...state, selectedIds: updated };
    }
    default:
      return state;
  }
}

interface TodoSelectionContextValue extends State {
  selectionMode: boolean;
  enterSelectionMode(): void;
  exitSelectionMode(): void;
  toggleSelection(id: string): void;
  selectIds(ids: string[]): void;
  clearSelection(): void;
  checkSelected(id: string): boolean;
}

const TodoSelectionContext = createContext<TodoSelectionContextValue | null>(null);

export function TodoSelectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectionMode = state.selectedIds.length > 0;

  const value = useMemo<TodoSelectionContextValue>(
    () => ({
      ...state,
      selectionMode,
      enterSelectionMode: () => {
        /* no-op: selectionMode derives from selectedIds */
      },
      exitSelectionMode: () => dispatch({ type: 'CLEAR' }),
      toggleSelection: (id: string) => dispatch({ type: 'TOGGLE_ID', id }),
      selectIds: (ids: string[]) => dispatch({ type: 'SET_SELECTED_IDS', ids }),
      clearSelection: () => dispatch({ type: 'CLEAR' }),
      checkSelected: (id: string) => state.selectedIds.includes(id),
    }),
    [state, selectionMode],
  );

  return <TodoSelectionContext.Provider value={value}>{children}</TodoSelectionContext.Provider>;
}

export function useTodoSelection(): TodoSelectionContextValue {
  const ctx = useContext(TodoSelectionContext);
  if (!ctx) {
    throw new Error('useTodoSelection must be used within TodoSelectionProvider');
  }
  return ctx;
}
