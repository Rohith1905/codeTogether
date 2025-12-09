import React, { useState } from 'react';

interface CreateItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    title: string;
    description?: string;
    placeholder?: string;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    placeholder = 'Enter name...'
}) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name);
            setName('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
                {description && <p className="text-gray-400 text-sm mb-4">{description}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-[#2d2d2d] border border-[#444] rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500 mb-6"
                        autoFocus
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
