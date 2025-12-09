import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import roomsReducer from '../features/rooms/roomsSlice';
import foldersReducer from '../features/folders/foldersSlice';
import filesReducer from '../features/files/filesSlice';
import presenceReducer from '../features/presence/presenceSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        rooms: roomsReducer,
        folders: foldersReducer,
        files: filesReducer,
        presence: presenceReducer,
        chat: chatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
