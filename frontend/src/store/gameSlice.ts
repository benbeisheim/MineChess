import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Position, GameState } from '../types/chess';
import { getLegalMoves } from '../gameLogic/rules';
import { executeMove } from '../gameLogic/state';
import { getInitialPosition } from '../utils/pieces';

// Define the initial state of our game
const initialState: GameState = {
    boardState: {
        board: getInitialPosition().board,
        whiteKingPosition: { x: 4, y: 7 },
        blackKingPosition: { x: 4, y: 0 }
    },
    selectedSquare: null,
    legalMoves: [],
    toMove: 'white',
    enPassantTarget: null,
    moveHistory: [],
    capturedPieces: [],
    isCheck: false,
    resolve: null,
    clock: {
        white: 600,
        black: 600
    },
    players: {
        white: {
            name: 'Player 1',
        },
        black: {
            name: 'Player 2',
        }
    }
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
        // Handle selecting a square
        selectSquare(state, action: PayloadAction<Position>): GameState {
            const piece = state.boardState.board[action.payload.y][action.payload.x];
            const position = action.payload;
            // If game is resolved, return no changes
            if (state.resolve) {
                return state;
            }
    
            // NO PIECE ON SQAURE
            // If the square is empty and no piece is selected, return no changes
            if (!piece && !state.selectedSquare) {
                return state;
            }
    
            // If the square is empty and a piece is selected, execute move if it is legal, unselect the piece otherwise
            if (!piece && state.selectedSquare) {
                if (state.legalMoves.some(move => move.x === position.x && move.y === position.y)) {
                    // execute move
                    executeMove(state.selectedSquare, position, state);
                    state.selectedSquare = null;
                    state.legalMoves = [];
                    return state;
                } else {
                    // unselect the piece
                    state.selectedSquare = null;
                    state.legalMoves = [];
                }
                return state;
            }
            // PIECE ON SQUARE
            // If the piece belongs to the current player, select it
            if (piece?.color === state.toMove) {
                state.selectedSquare = position;
                state.legalMoves = getLegalMoves(position, state);
                return state;
            // Otherwise, if the piece is capturable, execute the move, else, unselect the selected piece
            } else if (state.selectedSquare) {
                if (state.legalMoves.some(move => move.x === position.x && move.y === position.y)) {
                    // execute move
                    executeMove(state.selectedSquare, position, state);
                    state.selectedSquare = null;
                    state.legalMoves = [];
                    return state;
                } else {
                    // unselect the piece
                    state.selectedSquare = null;
                    state.legalMoves = [];
                }
                return state;
            }
            return state;
        },
        // Execute a move
        makeMove(state, action: PayloadAction<{from: Position, to: Position}>) {
            const { from, to } = action.payload;
            return executeMove(from, to, state);
        },
        // Reset the game
        resetGame() {
            return initialState;
        }
    }
});

// Export actions and reducer
export const { selectSquare, makeMove, resetGame, initializeBoard } = gameSlice.actions;
export default gameSlice.reducer;