import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';

// WebSocket URL from environment variable or default
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8081/ws';

class StompClient {
    private client: Client | null = null;
    private subscriptions: Map<string, StompSubscription> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;
    private isConnecting = false;

    constructor() {
        this.initializeClient();
    }

    private initializeClient() {
        this.client = new Client({
            brokerURL: WS_URL,
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                console.log('STOMP connected');
                this.reconnectAttempts = 0;
                this.isConnecting = false;
            },

            onDisconnect: () => {
                console.log('STOMP disconnected');
            },

            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
                console.error('Details:', frame.body);
            },

            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
            },

            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
                this.handleReconnect();
            },
        });
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isConnecting) {
            this.reconnectAttempts++;
            console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

            setTimeout(() => {
                if (this.client && !this.client.active) {
                    this.connect();
                }
            }, this.reconnectDelay * this.reconnectAttempts);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
        }
    }

    connect(token?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                this.initializeClient();
            }

            if (this.client!.active) {
                resolve();
                return;
            }

            this.isConnecting = true;

            // Add token to headers if provided
            if (token) {
                this.client!.connectHeaders = {
                    Authorization: `Bearer ${token}`,
                };
            }

            // Set up one-time connect callback
            const originalOnConnect = this.client!.onConnect;
            this.client!.onConnect = (frame) => {
                originalOnConnect(frame);
                resolve();
            };

            // Set up one-time error callback
            const originalOnStompError = this.client!.onStompError;
            this.client!.onStompError = (frame) => {
                originalOnStompError(frame);
                this.isConnecting = false;
                reject(new Error(frame.headers['message'] || 'STOMP connection error'));
            };

            this.client!.activate();
        });
    }

    subscribe(
        destination: string,
        callback: (message: IMessage) => void,
        headers?: Record<string, string>
    ): string {
        if (!this.client || !this.client.active) {
            throw new Error('STOMP client is not connected');
        }

        const subscription = this.client.subscribe(destination, callback, headers);
        const subscriptionId = subscription.id;
        this.subscriptions.set(subscriptionId, subscription);

        return subscriptionId;
    }

    unsubscribe(subscriptionId: string): void {
        const subscription = this.subscriptions.get(subscriptionId);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionId);
        }
    }

    publish(
        destination: string,
        body: any,
        headers?: Record<string, string>
    ): void {
        if (!this.client || !this.client.active) {
            throw new Error('STOMP client is not connected');
        }

        this.client.publish({
            destination,
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                ...headers,
            },
        });
    }

    disconnect(): void {
        if (this.client && this.client.active) {
            // Unsubscribe from all subscriptions
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
            this.subscriptions.clear();

            this.client.deactivate();
        }
    }

    isConnected(): boolean {
        return this.client?.active || false;
    }
}

// Singleton instance
const stompClient = new StompClient();

export default stompClient;
