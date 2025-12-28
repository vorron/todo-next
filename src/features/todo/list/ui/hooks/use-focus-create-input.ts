'use client';

import { useCallback } from 'react';

export function useFocusCreateInput() {
  const focusInput = useCallback(() => {
    const input = document.getElementById('create-todo-input') as HTMLInputElement | null;
    if (input) {
      input.focus();
    }
  }, []);

  return {
    focusInput,
  };
}
