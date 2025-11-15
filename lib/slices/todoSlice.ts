// lib/slices/todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterType } from '@/types';

interface TodoState {
  filter: FilterType;
  selectedUserId: string | null;
}

const initialState: TodoState = {
  filter: 'all',
  selectedUserId: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<string>) => {
      state.selectedUserId = action.payload;
    },
  },
});

export const { setFilter, setSelectedUser } = todoSlice.actions;
export default todoSlice.reducer;