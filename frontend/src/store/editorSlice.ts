import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CursorPosition {
    line: number;
    column: number;
}

interface EditorState {
    content: string;
    language: string;
    cursorPosition: CursorPosition;
    isDirty: boolean;
    lastSaved: string | null;
}

const initialState: EditorState = {
    content: '',
    language: 'javascript',
    cursorPosition: { line: 0, column: 0 },
    isDirty: false,
    lastSaved: null,
};

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload;
            state.isDirty = true;
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        setCursorPosition: (state, action: PayloadAction<CursorPosition>) => {
            state.cursorPosition = action.payload;
        },
        markSaved: (state) => {
            state.isDirty = false;
            state.lastSaved = new Date().toISOString();
        },
        resetEditor: (state) => {
            state.content = '';
            state.language = 'javascript';
            state.cursorPosition = { line: 0, column: 0 };
            state.isDirty = false;
            state.lastSaved = null;
        },
    },
});

export const { setContent, setLanguage, setCursorPosition, markSaved, resetEditor } = editorSlice.actions;
export default editorSlice.reducer;
