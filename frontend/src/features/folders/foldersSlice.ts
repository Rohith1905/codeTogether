import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { foldersApi } from '../../api/folders';
import { FolderResponse } from '../../utils/types';

interface FoldersState {
    folders: FolderResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: FoldersState = {
    folders: [],
    loading: false,
    error: null,
};

export const fetchFolders = createAsyncThunk(
    'folders/fetchFolders',
    async (roomId: string) => {
        return await foldersApi.getFolders(roomId);
    }
);

export const createFolder = createAsyncThunk(
    'folders/createFolder',
    async ({ roomId, name }: { roomId: string; name: string }) => {
        return await foldersApi.createFolder(roomId, name);
    }
);

export const renameFolder = createAsyncThunk(
    'folders/renameFolder',
    async ({ id, name }: { id: string; name: string }) => {
        return await foldersApi.renameFolder(id, name);
    }
);

export const deleteFolder = createAsyncThunk(
    'folders/deleteFolder',
    async (id: string) => {
        await foldersApi.deleteFolder(id);
        return id;
    }
);

const foldersSlice = createSlice({
    name: 'folders',
    initialState,
    reducers: {
        addFolder: (state, action: PayloadAction<FolderResponse>) => {
            state.folders.push(action.payload);
        },
        updateFolder: (state, action: PayloadAction<FolderResponse>) => {
            const index = state.folders.findIndex(f => f.id === action.payload.id);
            if (index !== -1) {
                state.folders[index] = action.payload;
            }
        },
        removeFolder: (state, action: PayloadAction<string>) => {
            state.folders = state.folders.filter(f => f.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFolders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFolders.fulfilled, (state, action) => {
                state.loading = false;
                state.folders = action.payload;
            })
            .addCase(createFolder.fulfilled, (state, action) => {
                state.folders.push(action.payload);
            })
            .addCase(renameFolder.fulfilled, (state, action) => {
                const index = state.folders.findIndex(f => f.id === action.payload.id);
                if (index !== -1) state.folders[index] = action.payload;
            })
            .addCase(deleteFolder.fulfilled, (state, action) => {
                state.folders = state.folders.filter(f => f.id !== action.payload);
            });
    },
});

export const { addFolder, updateFolder, removeFolder } = foldersSlice.actions;
export default foldersSlice.reducer;
