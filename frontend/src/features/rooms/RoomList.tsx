import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Plus, Users, Clock } from 'lucide-react';

const RoomList: React.FC = () => {
    const navigate = useNavigate();
    const { rooms, loading } = useAppSelector((state) => state.rooms);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleOpenRoom = (roomId: string) => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Rooms</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                    <Plus size={20} />
                    Create Room
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Loading rooms...</div>
            ) : rooms.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <Users className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">No rooms yet</h3>
                    <p className="mb-4 text-gray-500">Create your first room to start collaborating</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                        Create Room
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => handleOpenRoom(room.id)}
                            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{room.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{new Date(room.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <CreateRoomModal onClose={() => setShowCreateModal(false)} />
            )}
        </div>
    );
};

const CreateRoomModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [roomName, setRoomName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Dispatch create room action
        console.log('Creating room:', roomName);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Create New Room</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">
                            Room Name
                        </label>
                        <input
                            id="roomName"
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="Enter room name"
                            required
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomList;
