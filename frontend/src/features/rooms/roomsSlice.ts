import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { roomsApi, Room, CreateRoomRequest } from '../../api/roomsApi';

interface RoomsState {
    rooms: Room[];
    currentRoom: Room | null;
    loading: boolean;
    error: string | null;
}

const initialState: RoomsState = {
    rooms: [],
    currentRoom: null,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchRooms = createAsyncThunk(
    'rooms/fetchRooms',
    async (_, { rejectWithValue }) => {
        try {
            return await roomsApi.getAllRooms();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'No rooms found');
        }
    }
);

export const createRoom = createAsyncThunk(
    'rooms/createRoom',
    async (data: CreateRoomRequest, { rejectWithValue }) => {
        try {
            return await roomsApi.createRoom(data);
        } catch (error: any) {
            console.error('Create Room Error:', error);
            console.error('Response Data:', error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Failed to create room');
        }
    }
);

export const fetchRoom = createAsyncThunk(
    'rooms/fetchRoom',
    async (id: string, { rejectWithValue }) => {
        try {
            return await roomsApi.getRoom(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch room');
        }
    }
);

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        clearCurrentRoom: (state) => {
            state.currentRoom = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Rooms
        builder.addCase(fetchRooms.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
            state.loading = false;
            state.rooms = action.payload;
        });
        builder.addCase(fetchRooms.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create Room
        builder.addCase(createRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createRoom.fulfilled, (state, action: PayloadAction<Room>) => {
            state.loading = false;
            state.rooms.push(action.payload);
        });
        builder.addCase(createRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Room
        builder.addCase(fetchRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchRoom.fulfilled, (state, action: PayloadAction<Room>) => {
            state.loading = false;
            state.currentRoom = action.payload;
        });
        builder.addCase(fetchRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearCurrentRoom, clearError } = roomsSlice.actions;
export default roomsSlice.reducer;
