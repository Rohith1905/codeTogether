import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, Plus, FileText } from 'lucide-react';

interface FileTreeProps {
    roomId: string;
}

const FileTree: React.FC<FileTreeProps> = ({ roomId: _roomId }) => {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    // Placeholder data
    const fileNodes = [
        { id: '1', name: 'src', type: 'folder' as const, parentId: null },
        { id: '2', name: 'components', type: 'folder' as const, parentId: '1' },
        { id: '3', name: 'App.tsx', type: 'file' as const, parentId: '1' },
        { id: '4', name: 'Button.tsx', type: 'file' as const, parentId: '2' },
        { id: '5', name: 'README.md', type: 'file' as const, parentId: null },
    ];

    const toggleFolder = (folderId: string) => {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }
            return next;
        });
    };

    const renderNode = (node: typeof fileNodes[0], depth: number = 0) => {
        const isExpanded = expandedFolders.has(node.id);
        const isSelected = selectedFile === node.id;
        const children = fileNodes.filter((n) => n.parentId === node.id);

        return (
            <div key={node.id}>
                <div
                    onClick={() => {
                        if (node.type === 'folder') {
                            toggleFolder(node.id);
                        } else {
                            setSelectedFile(node.id);
                        }
                    }}
                    className={`flex cursor-pointer items-center gap-2 px-2 py-1.5 hover:bg-gray-100 ${isSelected ? 'bg-indigo-50' : ''
                        }`}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}
                >
                    {node.type === 'folder' ? (
                        <>
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <Folder size={16} className="text-yellow-500" />
                        </>
                    ) : (
                        <>
                            <div style={{ width: 16 }} />
                            <FileText size={16} className="text-blue-500" />
                        </>
                    )}
                    <span className="text-sm">{node.name}</span>
                </div>
                {node.type === 'folder' && isExpanded && children.map((child) => renderNode(child, depth + 1))}
            </div>
        );
    };

    const rootNodes = fileNodes.filter((n) => n.parentId === null);

    return (
        <div className="h-full overflow-y-auto border-r bg-white">
            <div className="border-b p-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Files</h3>
                    <button className="rounded p-1 hover:bg-gray-100">
                        <Plus size={16} />
                    </button>
                </div>
            </div>
            <div className="py-2">
                {rootNodes.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        <FileText className="mx-auto mb-2 text-gray-400" size={32} />
                        <p>No files yet</p>
                    </div>
                ) : (
                    rootNodes.map((node) => renderNode(node))
                )}
            </div>
        </div>
    );
};

export default FileTree;
