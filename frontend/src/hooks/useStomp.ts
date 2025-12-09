import { useEffect, useRef, useState, useCallback } from 'react';
import type { IMessage } from '@stomp/stompjs';
import stompClient from '../api/stompClient';
import { useAppSelector } from '../store/hooks';

interface UseStompOptions {
    autoConnect?: boolean;
}

interface UseStompReturn {
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    subscribe: (destination: string, callback: (message: IMessage) => void) => () => void;
    unsubscribe: (subscriptionId: string) => void;
    publish: (destination: string, body: any) => void;
}

export const useStomp = (options: UseStompOptions = {}): UseStompReturn => {
    const { autoConnect = false } = options;
    const [isConnected, setIsConnected] = useState(false);
    const { token } = useAppSelector((state) => state.auth);
    const subscriptionsRef = useRef<Set<string>>(new Set());

    const connect = useCallback(async () => {
        try {
            await stompClient.connect(token || undefined);
            setIsConnected(true);
        } catch (error) {
            console.error('Failed to connect to STOMP:', error);
            setIsConnected(false);
        }
    }, [token]);

    const disconnect = useCallback(() => {
        // Unsubscribe from all tracked subscriptions
        subscriptionsRef.current.forEach((subId) => {
            stompClient.unsubscribe(subId);
        });
        subscriptionsRef.current.clear();

        stompClient.disconnect();
        setIsConnected(false);
    }, []);

    const subscribe = useCallback(
        (destination: string, callback: (message: IMessage) => void): () => void => {
            const subscriptionId = stompClient.subscribe(destination, callback);
            subscriptionsRef.current.add(subscriptionId);
            return () => {
                stompClient.unsubscribe(subscriptionId);
                subscriptionsRef.current.delete(subscriptionId);
            };
        },
        []
    );

    const unsubscribe = useCallback((subscriptionId: string) => {
        stompClient.unsubscribe(subscriptionId);
        subscriptionsRef.current.delete(subscriptionId);
    }, []);

    const publish = useCallback((destination: string, body: any) => {
        stompClient.publish(destination, body);
    }, []);

    // Auto-connect on mount if enabled
    useEffect(() => {
        if (autoConnect && token) {
            connect();
        }

        // Cleanup on unmount
        return () => {
            if (autoConnect) {
                disconnect();
            }
        };
    }, [autoConnect, token, connect, disconnect]);

    // Update connection status periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setIsConnected(stompClient.isConnected());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        isConnected,
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        publish,
    };
};
