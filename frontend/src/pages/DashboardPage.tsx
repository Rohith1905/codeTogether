import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../features/auth/authSlice';
import { fetchRooms, createRoom } from '../features/rooms/roomsSlice';
import { LogOut, Plus, Users, DoorOpen, Copy, Check } from 'lucide-react';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { rooms, loading, error } = useAppSelector((state) => state.rooms);
    const [newRoomName, setNewRoomName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [joinRoomId, setJoinRoomId] = useState('');
    const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoomName.trim()) return;

        try {
            await dispatch(createRoom({ name: newRoomName })).unwrap();
            setNewRoomName('');
            setIsCreating(false);
        } catch (err) {
            console.error('Failed to create room:', err);
        }
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinRoomId.trim()) return;
        navigate(`/room/${joinRoomId.trim()}`);
    };

    const handleRoomClick = (roomId: string) => {
        navigate(`/room/${roomId}`);
    };

    const handleCopyRoomId = (e: React.MouseEvent, roomId: string) => {
        e.stopPropagation(); // Prevent room navigation
        navigator.clipboard.writeText(roomId);
        setCopiedRoomId(roomId);
        setTimeout(() => setCopiedRoomId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">CodeTogether</h1>
                            <p className="text-sm text-gray-500">Welcome back, {user?.username || 'User'}!</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Actions */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Your Rooms</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsJoining(!isJoining)}
                            className="flex items-center gap-2 rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                        >
                            <DoorOpen size={16} />
                            Join Room
                        </button>
                        <button
                            onClick={() => setIsCreating(!isCreating)}
                            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <Plus size={16} />
                            Create Room
                        </button>
                    </div>
                </div>

                {/* Join Room Form */}
                {isJoining && (
                    <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-medium text-gray-900">Join an Existing Room</h3>
                        <form onSubmit={handleJoinRoom} className="flex gap-4">
                            <input
                                type="text"
                                value={joinRoomId}
                                onChange={(e) => setJoinRoomId(e.target.value)}
                                placeholder="Enter room ID..."
                                className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Join
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsJoining(false)}
                                className="rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                {/* Create Room Form */}
                {isCreating && (
                    <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
                        <form onSubmit={handleCreateRoom} className="flex gap-4">
                            <input
                                type="text"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                placeholder="Enter room name..."
                                className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Room List */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Loading State */}
                    {loading && rooms.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            Loading your rooms...
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && rooms.length === 0 && (
                        <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                <Users size={24} />
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Create your first room to start collaborating.</p>
                        </div>
                    )}

                    {/* Rooms */}
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => handleRoomClick(room.id)}
                            className="group relative cursor-pointer rounded-lg border bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="truncate text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                                    {room.name}
                                </h3>
                                <div className="rounded-full bg-gray-100 p-2 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                    <Users size={16} />
                                </div>
                            </div>

                            {/* Room ID with Copy Button */}
                            <div className="mt-3 flex items-center gap-2">
                                <code className="flex-1 truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600 font-mono">
                                    {room.id}
                                </code>
                                <button
                                    onClick={(e) => handleCopyRoomId(e, room.id)}
                                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                    title="Copy Room ID"
                                >
                                    {copiedRoomId === room.id ? (
                                        <Check size={14} className="text-green-600" />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                </button>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                <span>Created by {room.createdByUsername || 'Unknown'}</span>
                                <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
