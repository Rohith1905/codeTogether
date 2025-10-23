import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileTree } from '../components/FileTree/FileTree';
import { CodeEditor } from '../components/Editor/CodeEditor';
import PresenceList from '../features/presence/PresenceList';
import { usePresence } from '../features/presence/usePresence';
import ChatArea from '../components/Chat/ChatArea';
import { Share2, Users, MessageSquare, Settings } from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useStomp } from '../hooks/useStomp';

const RoomPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'chat' | 'presence'>('presence');
    const { connect, isConnected } = useStomp();

    // Initialize WebSocket connection on mount
    useEffect(() => {
        connect();
    }, [connect]);

    const { usersOnline } = usePresence();

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">Room: {roomId}</h1>
                        <p className="text-xs text-gray-500">Collaborative workspace</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="rounded-md p-2 hover:bg-gray-100">
                        <Users size={20} />
                    </button>
                    <button className="rounded-md p-2 hover:bg-gray-100">
                        <Share2 size={20} />
                    </button>
                    <button className="rounded-md p-2 hover:bg-gray-100">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* File Tree Sidebar */}
                <aside className="w-64 border-r bg-[#1e1e1e] border-[#333]">
                    <ErrorBoundary>
                        <FileTree roomId={roomId || ''} />
                    </ErrorBoundary>
                </aside>

                {/* Editor Area */}
                <main className="flex-1 bg-[#282c34] relative">
                    <CodeEditor />
                </main>

                {/* Right Sidebar - Chat/Presence */}
                <aside className="w-80 border-l bg-white">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('presence')}
                            className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'presence'
                                ? 'border-b-2 border-indigo-600 text-indigo-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Users className="mx-auto mb-1" size={18} />
                            Online
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'chat'
                                ? 'border-b-2 border-indigo-600 text-indigo-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <MessageSquare className="mx-auto mb-1" size={18} />
                            Chat
                        </button>
                    </div>

                    <div className="p-4">
                        {activeTab === 'presence' ? (
                            <PresenceList usersOnline={usersOnline} />
                        ) : (
                            <ChatArea />
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default RoomPage;
