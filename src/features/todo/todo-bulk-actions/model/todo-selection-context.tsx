'use client';

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

interface State {
  selectionMode: boolean;
  selectedIds: string[];
}

type Action =
  | { type: 'ENTER' }
  | { type: 'EXIT' }
  | { type: 'TOGGLE_ID'; id: string }
  | { type: 'SET_SELECTED_IDS'; ids: string[] }
  | { type: 'CLEAR' };

const initialState: State = {
  selectionMode: false,
  selectedIds: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ENTER':
      return { ...state, selectionMode: true };
    case 'EXIT':
      return { ...state, selectionMode: false, selectedIds: [] };
    case 'CLEAR':
      return { ...state, selectedIds: [] };
    case 'SET_SELECTED_IDS':
      return { ...state, selectedIds: action.ids };
    case 'TOGGLE_ID': {
      const exists = state.selectedIds.includes(action.id);
      return {
        ...state,
        selectedIds: exists
          ? state.selectedIds.filter((x) => x !== action.id)
          : [...state.selectedIds, action.id],
      };
    }
    default:
      return state;
  }
}

interface TodoSelectionContextValue extends State {
  enterSelectionMode(): void;
  exitSelectionMode(): void;
  toggleId(id: string): void;
  selectIds(ids: string[]): void;
  clearSelection(): void;
  isSelected(id: string): boolean;
}

const TodoSelectionContext = createContext<TodoSelectionContextValue | null>(null);

export function TodoSelectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<TodoSelectionContextValue>(
    () => ({
      ...state,
      enterSelectionMode: () => dispatch({ type: 'ENTER' }),
      exitSelectionMode: () => dispatch({ type: 'EXIT' }),
      toggleId: (id: string) => dispatch({ type: 'TOGGLE_ID', id }),
      selectIds: (ids: string[]) => dispatch({ type: 'SET_SELECTED_IDS', ids }),
      clearSelection: () => dispatch({ type: 'CLEAR' }),
      isSelected: (id: string) => state.selectedIds.includes(id),
    }),
    [state],
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
