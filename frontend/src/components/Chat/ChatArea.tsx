import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useStomp } from '../../hooks/useStomp';
import { addMessage } from '../../features/chat/chatSlice';

const ChatArea: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const dispatch = useDispatch();
    const { messages } = useSelector((state: RootState) => state.chat);
    const { user } = useSelector((state: RootState) => state.auth);
    const { subscribe, publish, isConnected } = useStomp();
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!roomId || !isConnected) return;

        // Subscribe to chat
        subscribe(`/topic/room.${roomId}.chat`, (msg) => {
            const body = JSON.parse(msg.body);
            dispatch(addMessage(body));
        });
    }, [roomId, isConnected, subscribe, dispatch]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user || !roomId) return;

        publish('/app/chat.message', {
            roomId,
            userId: user.id || 'u_' + user.username,
            name: user.username,
            text: input.trim()
        });
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                        <span className="font-bold text-gray-800">{msg.name}: </span>
                        <span className="text-gray-700">{msg.text}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-2 border-t flex gap-2">
                <input
                    className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatArea;
