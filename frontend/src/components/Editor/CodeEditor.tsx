import React, { useEffect, useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { updateFileContent, updateFileLocal, updateFileContentFromSocket } from '../../features/files/filesSlice';
import { useStomp } from '../../hooks/useStomp';
import { Save, Clock } from 'lucide-react';

export const CodeEditor: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { activeFile } = useSelector((state: RootState) => state.files);
    const { user } = useSelector((state: RootState) => state.auth);
    const { subscribe, publish, unsubscribe, isConnected } = useStomp();

    // Local State
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
    const [lastSavedContent, setLastSavedContent] = useState('');

    // Refs for socket management
    const subscriptionRef = useRef<(() => void) | null>(null);
    const prevFileIdRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<any>(null);
    const socketUpdateTimeoutRef = useRef<any>(null);
    const isTypingRef = useRef(false);
    const autoSaveIntervalRef = useRef<any>(null);

    // Initial Load & Content Sync
    useEffect(() => {
        if (activeFile) {
            setContent(activeFile.content || '');
            setLastSavedContent(activeFile.content || '');
            setIsSaving(false);
        }
    }, [activeFile?.id]);

    // Handle Manual Save
    const handleSave = useCallback(async () => {
        if (!activeFile) return;
        setIsSaving(true);
        try {
            await dispatch(updateFileContent({ id: activeFile.id, content })).unwrap();
            setLastSavedContent(content);
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    }, [activeFile, content, dispatch]);

    // Auto-Save Interval Logic (Runs every 10s if enabled and changed)
    useEffect(() => {
        if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);

        if (autoSaveEnabled && activeFile) {
            autoSaveIntervalRef.current = setInterval(() => {
                if (content !== lastSavedContent) {
                    handleSave();
                }
            }, 10000); // 10 seconds
        }

        return () => {
            if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
        };
    }, [autoSaveEnabled, content, lastSavedContent, activeFile, handleSave]);

    // Broadcast Auto-Save Toggle Changes
    useEffect(() => {
        if (activeFile && roomId && isConnected) {
            publish('/app/auto-save-toggle', {
                roomId,
                fileId: activeFile.id,
                enabled: autoSaveEnabled,
                username: user?.username
            });
        }
    }, [autoSaveEnabled, activeFile?.id, roomId, isConnected, publish, user?.username]);

    // Socket Subscription & Room Management
    useEffect(() => {
        if (!roomId || !activeFile || !isConnected) {
            // Cleanup Logic
            if (prevFileIdRef.current && prevFileIdRef.current !== activeFile?.id) {
                if (isConnected) {
                    publish('/app/leave-file-room', {
                        roomId,
                        fileId: prevFileIdRef.current,
                        username: user?.username
                    });
                }
                if (subscriptionRef.current) {
                    subscriptionRef.current();
                    subscriptionRef.current = null;
                }
                prevFileIdRef.current = null;
            }
            return;
        }

        const fileId = activeFile.id;

        // If file changed (Switching files)
        if (prevFileIdRef.current !== fileId) {
            // 1. Cleanup Old Room
            if (prevFileIdRef.current) {
                publish('/app/leave-file-room', {
                    roomId,
                    fileId: prevFileIdRef.current,
                    username: user?.username
                });
                if (subscriptionRef.current) {
                    subscriptionRef.current();
                }
            }

            // 2. Subscribe to New Room (BEFORE Joining to catch sync messages)
            const topic = `/topic/room.${roomId}.file.${fileId}.edit`;
            const autoSaveTopic = `/topic/room.${roomId}.file.${fileId}.autosave`;

            const cleanup = subscribe(topic, (message) => {
                const body = JSON.parse(message.body);
                // Dispatch updates from socket
                dispatch(updateFileContentFromSocket({ id: fileId, content: body.content }));
            });

            const autoSaveCleanup = subscribe(autoSaveTopic, (message) => {
                const body = JSON.parse(message.body);
                if (body.username !== user?.username) {
                    setAutoSaveEnabled(body.enabled);
                }
            });

            subscriptionRef.current = () => {
                cleanup();
                autoSaveCleanup();
            };

            // 3. Join New Room (Triggers backend to send cached content)
            publish('/app/join-file-room', {
                roomId,
                fileId,
                username: user?.username
            });

            prevFileIdRef.current = fileId;
        }

        return () => {
            if (prevFileIdRef.current === fileId) {
                if (isConnected) {
                    publish('/app/leave-file-room', {
                        roomId,
                        fileId,
                        username: user?.username
                    });
                }
                if (subscriptionRef.current) {
                    subscriptionRef.current();
                }
            }
        };
    }, [activeFile?.id, roomId, user?.username, publish, subscribe, unsubscribe, isConnected]);

    // Handle Editor Change
    const handleChange = useCallback((val: string) => {
        setContent(val);
        if (activeFile) {
            // Optimistic Update
            dispatch(updateFileLocal({ id: activeFile.id, content: val }));

            // Typing Indicators
            if (!isTypingRef.current) {
                isTypingRef.current = true;
                if (isConnected) publish('/app/editing-started', { roomId, fileId: activeFile.id, username: user?.username });
            }
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                isTypingRef.current = false;
                if (isConnected) publish('/app/editing-stopped', { roomId, fileId: activeFile.id, username: user?.username });
            }, 300);

            // Broadcast Edit (Throttled)
            if (socketUpdateTimeoutRef.current) clearTimeout(socketUpdateTimeoutRef.current);
            socketUpdateTimeoutRef.current = setTimeout(() => {
                if (isConnected) {
                    publish('/app/file-edit', { roomId, fileId: activeFile.id, content: val });
                }
            }, 100);
        }
    }, [activeFile, roomId, user?.username, publish, dispatch, isConnected]);

    // Sync Local State from Redux (Socket Updates)
    useEffect(() => {
        if (activeFile && activeFile.content !== content) {
            // Smart update: Only update if we're not forcefully typing?
            // For now, accept sync (Last Write Wins)
            setContent(activeFile.content || '');
            // If sync comes from backend, we treat it as 'saved' in terms of baseline?
            // But for manual save logic, we might want to keep it as 'unsaved' if it differs from DB?
            // Actually, if we receive a socket update, it means SOMEONE has this content. 
            // We update our view.
        }
    }, [activeFile?.content]);

    if (!activeFile) {
        return (
            <div className="h-full flex items-center justify-center bg-[#1e1e1e] text-gray-500">
                <div className="text-center">
                    <p className="mb-2 text-6xl">📝</p>
                    <p>Select a file to edit</p>
                </div>
            </div>
        );
    }

    const getExtensions = () => {
        if (activeFile.name.endsWith('.java')) return [java()];
        return [javascript({ jsx: true })];
    };

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e]">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-[#252526] px-4 py-2 border-b border-[#1e1e1e] shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
                        {activeFile.name}
                        {content !== lastSavedContent && (
                            <span className="w-2 h-2 rounded-full bg-yellow-500" title="Unsaved changes in DB"></span>
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Auto Save Toggle */}
                    <button
                        onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${autoSaveEnabled ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700' : 'text-gray-500 hover:bg-[#333]'
                            }`}
                        title="Toggle Auto-Save (10s)"
                    >
                        <Clock size={14} />
                        {autoSaveEnabled ? 'Auto-Save: ON' : 'Auto-Save: OFF'}
                    </button>

                    {/* Manual Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || content === lastSavedContent}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${content !== lastSavedContent
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                            : 'bg-[#333] text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <Save size={14} />
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* CodeMirror */}
            <div className="flex-1 overflow-hidden relative">
                <CodeMirror
                    value={content}
                    height="100%"
                    theme={oneDark}
                    extensions={getExtensions()}
                    onChange={handleChange}
                    className="h-full text-base"
                />
            </div>
        </div>
    );
};
