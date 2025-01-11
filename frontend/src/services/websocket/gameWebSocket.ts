// src/services/websocket/types.ts
// Define types for our WebSocket messages

import { AppDispatch } from "../../store";
import { updateGameState } from "../../store/gameSlice";
import { PieceType, Position, WSMove } from "../../types/chess";

export type WSMessageType = 'move' | 'gameState' | 'error';

export interface WSMessage {
    type: WSMessageType;
    payload: any;  // We could make this more specific with a union type
}

// src/services/websocket/GameWebSocket.ts
// This class manages the WebSocket connection for a specific game
export class GameWebSocket {
    private socket: WebSocket | null = null;
    private gameId: string;
    private dispatch: AppDispatch;
    private isConnecting: boolean = false;

    constructor(gameId: string, dispatch: AppDispatch) {
        this.gameId = gameId;
        this.dispatch = dispatch;
        this.handleMessage = this.handleMessage.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleError = this.handleError.bind(this);
        this.connect();
    }

    private connect() {
        // Prevent multiple connection attempts
        if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
            console.log("WebSocket already connected");
            return;
        }

        this.isConnecting = true;
        console.log("Connecting to WebSocket for game:", this.gameId);
        
        this.socket = new WebSocket(`ws://localhost:3000/ws/game/${this.gameId}`);
        
        this.socket.onopen = this.handleOpen;
        this.socket.onclose = this.handleClose;
        this.socket.onmessage = this.handleMessage;
        this.socket.onerror = this.handleError;
    }

    // Make sure to clean up properly
    public disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.isConnecting = false;
    }
    private handleOpen() {
        console.log('WebSocket connection established');
        this.isConnecting = false;
    }

    public sendMove(move: WSMove) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'move',
                payload: move
            }));
        } else {
            console.error('WebSocket is not connected');
            // Optionally dispatch an error state
        }
    }

    private handleMessage(event: MessageEvent) {
        try {
            const message = JSON.parse(event.data);
            console.log("Received message:", message);
            
            switch (message.type) {
                case 'gameState':
                    // Update the entire game state from server
                    this.dispatch(updateGameState(message.payload));
                    break;
                    
                default:
                    console.error('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    private handleClose(event: CloseEvent) {
        console.log('WebSocket connection closed:', event);
        this.isConnecting = false;
        // Implement reconnection logic if needed
    }

    private handleError(error: Event) {
        console.error('WebSocket error:', error);
    }
}