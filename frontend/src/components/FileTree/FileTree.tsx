import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchFolders, createFolder, deleteFolder, renameFolder } from '../../features/folders/foldersSlice';
import { fetchFiles, createFile, deleteFile, renameFile, setActiveFile, setFileEditingStatus } from '../../features/files/filesSlice';
import {
    Folder, File as FileIcon, ChevronRight, ChevronDown,
    FolderPlus, FilePlus, Trash2, Edit2
} from 'lucide-react';
import { CreateItemModal } from '../Modals/CreateItemModal';
import { useStomp } from '../../hooks/useStomp';

interface FileTreeProps {
    roomId: string;
}

export const FileTree: React.FC<FileTreeProps> = ({ roomId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const foldersState = useSelector((state: RootState) => state.folders);
    const folders = foldersState?.folders || [];

    const filesState = useSelector((state: RootState) => state.files);
    const files = filesState?.files || {};
    const activeFile = filesState?.activeFile;
    const editingStatus = filesState?.editingStatus || {};
    const { subscribe, unsubscribe, isConnected } = useStomp();

    // UI State
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'folder' | 'file';
        action: 'create' | 'rename';
        targetId?: string; // folderId for file creation, or item id for rename
        initialName?: string;
    }>({ isOpen: false, type: 'folder', action: 'create' });

    useEffect(() => {
        if (roomId) {
            dispatch(fetchFolders(roomId));
        }
    }, [dispatch, roomId]);

    // Subsection for Real-Time Editing Indicators
    useEffect(() => {
        if (!roomId || !isConnected) return;

        // Listen to global room indicators
        const topic = `/topic/room.${roomId}.editing-indicators`;
        const cleanup = subscribe(topic, (message) => {
            const body = JSON.parse(message.body);
            // body = { fileId: string, editingCount: number, editors: string[] }
            if (body.fileId) {
                dispatch(setFileEditingStatus({
                    fileId: body.fileId,
                    count: body.editingCount || 0
                }));
            }
        });

        return () => {
            cleanup();
        };
    }, [roomId, isConnected, subscribe, unsubscribe, dispatch]);

    const toggleFolder = (folderId: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
            dispatch(fetchFiles(folderId));
        }
        setExpandedFolders(newExpanded);
    };

    const handleCreateFolder = () => {
        setModalConfig({ isOpen: true, type: 'folder', action: 'create' });
    };

    const handleCreateFile = (folderId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setModalConfig({ isOpen: true, type: 'file', action: 'create', targetId: folderId });
    };

    const handleRename = (id: string, type: 'folder' | 'file', currentName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setModalConfig({ isOpen: true, type: type, action: 'rename', targetId: id, initialName: currentName });
    };

    const handleDelete = (id: string, type: 'folder' | 'file', e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            if (type === 'folder') dispatch(deleteFolder(id));
            else dispatch(deleteFile(id));
        }
    };

    const handleModalSubmit = (name: string) => {
        const { type, action, targetId } = modalConfig;

        if (action === 'create') {
            if (type === 'folder') {
                dispatch(createFolder({ roomId, name }));
            } else if (type === 'file' && targetId) {
                dispatch(createFile({ folderId: targetId, name }));
            }
        } else if (action === 'rename' && targetId) {
            if (type === 'folder') {
                dispatch(renameFolder({ id: targetId, name }));
            } else {
                dispatch(renameFile({ id: targetId, name }));
            }
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-gray-300 border-r border-[#333]">
            {/* Header */}
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1e1e1e]">
                <span className="font-semibold text-sm tracking-wide text-gray-400">EXPLORER</span>
                <button
                    onClick={handleCreateFolder}
                    className="p-1 hover:bg-[#333] rounded transition-colors"
                    title="New Folder"
                >
                    <FolderPlus size={16} />
                </button>
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-y-auto p-2">
                {folders?.map(folder => (
                    <div key={folder.id} className="mb-1">
                        {/* Folder Row */}
                        <div
                            className="flex items-center group px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer rounded select-none"
                            onClick={() => toggleFolder(folder.id)}
                        >
                            <span className="mr-1 text-gray-500">
                                {expandedFolders.has(folder.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                            <Folder size={14} className="mr-2 text-blue-400 fill-blue-400/20" />
                            <span className="truncate flex-1 text-sm font-medium">{folder.name}</span>

                            {/* Folder Actions */}
                            <div className="hidden group-hover:flex items-center gap-1">
                                <button
                                    className="p-1 hover:bg-[#3c3c3c] rounded"
                                    onClick={(e) => handleCreateFile(folder.id, e)}
                                    title="New File"
                                >
                                    <FilePlus size={12} />
                                </button>
                                <button
                                    className="p-1 hover:bg-[#3c3c3c] rounded"
                                    onClick={(e) => handleRename(folder.id, 'folder', folder.name, e)}
                                >
                                    <Edit2 size={12} />
                                </button>
                                <button
                                    className="p-1 hover:bg-[#3c3c3c] rounded text-red-400"
                                    onClick={(e) => handleDelete(folder.id, 'folder', e)}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Files List */}
                        {expandedFolders.has(folder.id) && (
                            <div className="ml-4 border-l border-[#333] pl-1 mt-1">
                                {files?.[folder.id]?.map(file => {
                                    const editingCount = editingStatus?.[file.id] || 0;
                                    return (
                                        <div
                                            key={file.id}
                                            className={`
                                            flex items-center group px-2 py-1.5 cursor-pointer rounded select-none mb-0.5
                                            ${activeFile?.id === file.id ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e]'}
                                        `}
                                            onClick={() => dispatch(setActiveFile(file))}
                                        >
                                            <FileIcon size={13} className="mr-2 text-gray-400" />
                                            <span className="truncate flex-1 text-sm">{file.name}</span>

                                            {/* Editing Indicator */}
                                            {editingCount > 0 && (
                                                <span className="text-xs text-yellow-400 ml-2 animate-pulse flex items-center">
                                                    ● <span className="text-[10px] ml-0.5">{editingCount > 1 ? editingCount : ''}</span>
                                                </span>
                                            )}

                                            {/* File Actions */}
                                            <div className="hidden group-hover:flex items-center gap-1 ml-auto">
                                                <button
                                                    className="p-1 hover:bg-[#4d4d4d] rounded"
                                                    onClick={(e) => handleRename(file.id, 'file', file.name, e)}
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    className="p-1 hover:bg-[#4d4d4d] rounded text-red-400"
                                                    onClick={(e) => handleDelete(file.id, 'file', e)}
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!files[folder.id] || files[folder.id].length === 0) && (
                                    <div className="px-2 py-1 text-xs text-gray-600 italic">Empty</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {folders?.length === 0 && (
                    <div className="text-center mt-10 text-gray-600 text-sm">
                        No folders yet.
                        <br />
                        Create one to start.
                    </div>
                )}
            </div>

            <CreateItemModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onSubmit={handleModalSubmit}
                title={`${modalConfig.action === 'create' ? 'Create' : 'Rename'} ${modalConfig.type === 'folder' ? 'Folder' : 'File'}`}
                placeholder={`Enter ${modalConfig.type} name...`}
            />
        </div>
    );
};
