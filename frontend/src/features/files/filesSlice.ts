import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { filesApi } from '../../api/files';
import { FileResponse } from '../../utils/types';

interface FilesState {
    files: Record<string, FileResponse[]>; // folderId -> files
    activeFile: FileResponse | null;
    editingStatus: Record<string, number>; // fileId -> number of editors
    loading: boolean;
    error: string | null;
}

const initialState: FilesState = {
    files: {},
    activeFile: null,
    editingStatus: {},
    loading: false,
    error: null,
};

export const fetchFiles = createAsyncThunk(
    'files/fetchFiles',
    async (folderId: string) => {
        const files = await filesApi.getFiles(folderId);
        return { folderId, files };
    }
);

export const createFile = createAsyncThunk(
    'files/createFile',
    async ({ folderId, name }: { folderId: string; name: string }) => {
        return await filesApi.createFile(folderId, name);
    }
);

export const renameFile = createAsyncThunk(
    'files/renameFile',
    async ({ id, name }: { id: string; name: string }) => {
        return await filesApi.renameFile(id, name);
    }
);

export const updateFileContent = createAsyncThunk(
    'files/updateFileContent',
    async ({ id, content }: { id: string; content: string }) => {
        return await filesApi.updateFileContent(id, content);
    }
);

export const deleteFile = createAsyncThunk(
    'files/deleteFile',
    async (id: string) => {
        await filesApi.deleteFile(id);
        return id;
    }
);

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setActiveFile: (state, action: PayloadAction<FileResponse | null>) => {
            state.activeFile = action.payload;
        },
        updateFileLocal: (state, action: PayloadAction<{ id: string; content: string }>) => {
            if (state.activeFile && state.activeFile.id === action.payload.id) {
                state.activeFile.content = action.payload.content;
            }
            // Update in list too
            for (const folderId in state.files) {
                const fileIndex = state.files[folderId].findIndex(f => f.id === action.payload.id);
                if (fileIndex !== -1) {
                    state.files[folderId][fileIndex].content = action.payload.content;
                    break;
                }
            }
        },
        updateFileContentFromSocket: (state, action: PayloadAction<{ id: string; content: string }>) => {
            // Update active file if matched
            if (state.activeFile && state.activeFile.id === action.payload.id) {
                state.activeFile.content = action.payload.content;
            }
            // Update in list too
            for (const folderId in state.files) {
                const fileIndex = state.files[folderId].findIndex(f => f.id === action.payload.id);
                if (fileIndex !== -1) {
                    state.files[folderId][fileIndex].content = action.payload.content;
                    break;
                }
            }
        },
        setFileEditingStatus: (state, action: PayloadAction<{ fileId: string; count: number }>) => {
            state.editingStatus[action.payload.fileId] = action.payload.count;
        },
        addFile: (state, action: PayloadAction<FileResponse>) => {
            if (!state.files[action.payload.folderId]) {
                state.files[action.payload.folderId] = [];
            }
            state.files[action.payload.folderId].push(action.payload);
        },
        updateFile: (state, action: PayloadAction<FileResponse>) => {
            const folderFiles = state.files[action.payload.folderId];
            if (folderFiles) {
                const index = folderFiles.findIndex(f => f.id === action.payload.id);
                if (index !== -1) folderFiles[index] = action.payload;
            }
            if (state.activeFile?.id === action.payload.id) {
                state.activeFile = action.payload;
            }
        },
        removeFile: (state, action: PayloadAction<{ id: string; folderId: string }>) => {
            if (state.files[action.payload.folderId]) {
                state.files[action.payload.folderId] = state.files[action.payload.folderId].filter(f => f.id !== action.payload.id);
            }
            if (state.activeFile?.id === action.payload.id) {
                state.activeFile = null;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.files[action.payload.folderId] = action.payload.files;
            })
            .addCase(createFile.fulfilled, (state, action) => {
                const file = action.payload;
                if (!state.files[file.folderId]) state.files[file.folderId] = [];
                state.files[file.folderId].push(file);
            })
            .addCase(renameFile.fulfilled, (state, action) => {
                const file = action.payload;
                const list = state.files[file.folderId];
                if (list) {
                    const idx = list.findIndex(f => f.id === file.id);
                    if (idx !== -1) list[idx] = file;
                }
                if (state.activeFile?.id === file.id) state.activeFile = file;
            })
            .addCase(updateFileContent.fulfilled, () => {
                // Content updated
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                // We'd need to search all folders to remove it if we don't know folderId
                for (const folderId in state.files) {
                    state.files[folderId] = state.files[folderId].filter(f => f.id !== action.payload);
                }
            });
    },
});

export const { setActiveFile, updateFileLocal, updateFileContentFromSocket, setFileEditingStatus, addFile, updateFile, removeFile } = filesSlice.actions;
export default filesSlice.reducer;
