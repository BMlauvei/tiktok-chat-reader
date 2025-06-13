import { WebcastPushConnection } from 'tiktok-live-connector';

export class TikTokConnectionWrapper {
    constructor(username, options = {}) {
        this.username = username;
        this.connection = null;
        this.isConnected = false;
        this.options = {
            processInitialData: true,
            enableExtendedGiftInfo: true,
            enableWebsocketUpgrade: true,
            requestPollingIntervalMs: 1000,
            ...options
        };
        this.eventHandlers = new Map();
    }

    async connect() {
        try {
            this.connection = new WebcastPushConnection(this.username, this.options);
            
            // Event listeners'ı bağla
            this.setupEventListeners();
            
            const state = await this.connection.connect();
            this.isConnected = true;
            
            return state;
        } catch (error) {
            this.isConnected = false;
            throw error;
        }
    }

    disconnect() {
        if (this.connection) {
            this.connection.disconnect();
            this.isConnected = false;
        }
    }

    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }

    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    setupEventListeners() {
        if (!this.connection) return;

        this.connection.on('chat', (data) => {
            this.emit('chat', data);
        });

        this.connection.on('gift', (data) => {
            this.emit('gift', data);
        });

        this.connection.on('social', (data) => {
            this.emit('social', data);
        });

        this.connection.on('like', (data) => {
            this.emit('like', data);
        });

        this.connection.on('share', (data) => {
            this.emit('share', data);
        });

        this.connection.on('roomUser', (data) => {
            this.emit('roomUser', data);
        });

        this.connection.on('disconnected', () => {
            this.isConnected = false;
            this.emit('disconnected');
        });

        this.connection.on('error', (error) => {
            this.emit('error', error);
        });
    }

    getConnectionState() {
        return {
            username: this.username,
            isConnected: this.isConnected,
            connection: this.connection
        };
    }
}