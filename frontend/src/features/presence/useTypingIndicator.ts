import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { IMessage } from '@stomp/stompjs';
import { useStomp } from '../../hooks/useStomp';
import { useAppSelector } from '../../store/hooks';

interface TypingUser {
    username: string;
    timestamp: number;
}

export const useTypingIndicator = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const { user } = useAppSelector((state) => state.auth);
    const { isConnected, subscribe, publish } = useStomp({ autoConnect: true });
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

    // Subscribe to typing indicators
    useEffect(() => {
        if (!isConnected || !roomId) return;

        const destination = `/topic/room/${roomId}/typing`;

        const cleanup = subscribe(destination, (message: IMessage) => {
            try {
                const data = JSON.parse(message.body);

                if (data.username === user?.username) {
                    // Ignore own typing events
                    return;
                }

                setTypingUsers((prev) => {
                    const filtered = prev.filter((u) => u.username !== data.username);

                    if (data.isTyping) {
                        return [...filtered, { username: data.username, timestamp: Date.now() }];
                    }

                    return filtered;
                });
            } catch (error) {
                console.error('Error parsing typing indicator:', error);
            }
        });

        return () => {
            cleanup();
        };
    }, [isConnected, roomId, user?.username, subscribe]);

    // Clean up stale typing indicators
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setTypingUsers((prev) => prev.filter((u) => now - u.timestamp < 3000));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const startTyping = useCallback(() => {
        if (!roomId || !user?.username) return;

        publish(`/app/room/${roomId}/typing`, {
            username: user.username,
            isTyping: true,
            timestamp: new Date().toISOString(),
        });
    }, [roomId, user?.username, publish]);

    const stopTyping = useCallback(() => {
        if (!roomId || !user?.username) return;

        publish(`/app/room/${roomId}/typing`, {
            username: user.username,
            isTyping: false,
            timestamp: new Date().toISOString(),
        });
    }, [roomId, user?.username, publish]);

    return {
        typingUsers: typingUsers.map((u) => u.username),
        startTyping,
        stopTyping,
    };
};
