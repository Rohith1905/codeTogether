// Re-export store and hooks for easy imports
export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
