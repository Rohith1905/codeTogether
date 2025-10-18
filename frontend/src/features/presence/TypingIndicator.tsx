import React from 'react';
import { useTypingIndicator } from './useTypingIndicator';

const TypingIndicator: React.FC = () => {
    const { typingUsers } = useTypingIndicator();

    if (typingUsers.length === 0) return null;

    const displayText =
        typingUsers.length === 1
            ? `${typingUsers[0]} is typing...`
            : typingUsers.length === 2
                ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                : `${typingUsers.length} people are typing...`;

    return (
        <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
            <div className="flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
            </div>
            <span>{displayText}</span>
        </div>
    );
};

export default TypingIndicator;
