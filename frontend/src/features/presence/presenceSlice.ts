import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SimpleUser {
    userId: string;
    name: string;
}

interface PresenceState {
    usersOnline: SimpleUser[];
}

const initialState: PresenceState = {
    usersOnline: []
};

const presenceSlice = createSlice({
    name: 'presence',
    initialState,
    reducers: {
        setUsersOnline: (state, action: PayloadAction<SimpleUser[]>) => {
            state.usersOnline = action.payload;
        }
    }
});

export const { setUsersOnline } = presenceSlice.actions;
export default presenceSlice.reducer;
