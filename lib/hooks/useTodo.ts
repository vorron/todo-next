import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setFilter, setSelectedUser } from '@/lib/slices/todoSlice';
import { FilterType } from '@/types';
import { RootState } from '../store';

export const useTodo = () => {
    const dispatch = useDispatch();

    // Селекторы состояния
    const filter = useSelector((state: RootState) => state.todo.filter);
    const selectedUserId = useSelector((state: RootState) => state.todo.selectedUserId);

    // Мемоизированные действия
    const actions = useMemo(() => ({
        setFilter: (filter: FilterType) => dispatch(setFilter(filter)),
        setSelectedUser: (userId: string) => dispatch(setSelectedUser(userId)),
        clearSelectedUser: () => dispatch(setSelectedUser('')),
    }), [dispatch]);

    // Удобные обертки для часто используемых действий
    const handleFilterChange = useCallback((newFilter: FilterType) => {
        actions.setFilter(newFilter);
    }, [actions]);

    const handleUserSelect = useCallback((userId: string) => {
        actions.setSelectedUser(userId);
    }, [actions]);

    const handleClearSelection = useCallback(() => {
        actions.clearSelectedUser();
    }, [actions]);

    return {
        // Состояние
        filter,
        selectedUserId,

        // Действия (полный набор)
        ...actions,

        // Удобные обертки (опционально)
        handleFilterChange,
        handleUserSelect,
        handleClearSelection,

        // Вычисляемые значения
        hasSelectedUser: selectedUserId !== null,
    };
};