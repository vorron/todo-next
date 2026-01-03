import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
