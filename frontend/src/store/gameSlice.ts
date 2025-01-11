import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Position, GameState, PlayerColor } from '../types/chess';
import { getLegalMoves } from '../gameLogic/rules';
import { getInitialPosition } from '../utils/pieces';

// Define the initial state of our game
const initialState: GameState = {
    boardState: getInitialPosition(),
    selectedSquare: null,
    legalMoves: [],
    toMove: 'white',
    enPassantTarget: null,
    moveHistory: [],
    capturedPieces: [],
    isCheck: false,
    resolve: null,
    clock: {
        white: 3000,
        black: 3000
    },
    players: {
        white: 'Player 1',
        black: 'Player 2'
    },
    promotionSquare: null
};

// Create the slice
const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // Initialize the board
        initializeBoard() {
            return initialState;
        },
        // Local UI state management
        selectSquare(state, action: PayloadAction<{position: Position, playerColor: PlayerColor}>) {
            const { position, playerColor } = action.payload;
            console.log("Selecting square", position, playerColor);
            
            // Only allow selection if it's the player's turn
            if (state.toMove !== playerColor) {
                console.log("Not the player's turn - returning");
                return state;
            }

            const piece = state.boardState.board[position.y][position.x];

            if (piece?.color === playerColor) {
                console.log("Piece is the player's color - selecting");
                // Select the piece and calculate legal moves
                state.selectedSquare = position;
                state.legalMoves = getLegalMoves(position, state);
                state.promotionSquare = null;
            } else if (state.selectedSquare) {
                console.log("Piece is not the player's color - checking legal moves");
                // If we have a piece selected and clicked a legal move square,
                // we'll handle this through the WebSocket
                if (state.legalMoves.some(move => 
                    move.x === position.x && move.y === position.y
                )) {
                    console.log("Legal move square - clearing selection");
                    // Clear selection state after attempting move
                    state.selectedSquare = null;
                    state.legalMoves = [];
                    state.promotionSquare = null;
                } else {
                    // Invalid move square - just clear selection
                    console.log("Invalid move square - clearing selection");
                    state.selectedSquare = null;
                    state.legalMoves = [];
                    state.promotionSquare = null;
                }
            }
        },

        // Update the clock
        updateClock(state, action: PayloadAction<{timeLeft: number, color: PlayerColor}>) {
            const { timeLeft, color } = action.payload;
            state.clock[color] = timeLeft;
            if (timeLeft <= 0) {
                state.resolve = 'checkmate';
            }
            return state;
        },
        setPromotionSquare(state, action: PayloadAction<Position>) {
            state.promotionSquare = action.payload;
            state.legalMoves = [];
            return state;
        },
        updateGameState(state, action: PayloadAction<GameState>) {
            console.log("Updating game state", action.payload, state.boardState);
            // websocket game state updates provide full state
            return {
                ...action.payload,
            };
        },
    }
});

// Export actions and reducer
export const { selectSquare, initializeBoard, updateClock, updateGameState, setPromotionSquare } = gameSlice.actions;
export default gameSlice.reducer;