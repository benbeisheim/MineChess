import { useState } from 'react';
import ChessBoard from '../ChessBoard/ChessBoard';
import { GameState, Position } from '../../types/chess';
import { getInitialPosition } from '../../utils/pieces';

const LocalGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        boardState: getInitialPosition(),
        toMove: 'white',
        moveHistory: [],
        capturedPieces: [],
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
        selectedSquare: null,
        legalMoves: [],
        enPassantTarget: null,
    });

    const handleSquareClick = (position: Position) => {
        const piece = gameState.boardState.board[position.y][position.x];


        // NO PIECE ON SQAURE
        // If the square is empty and no piece is selected, return
        if (!piece && !gameState.selectedSquare) {
            return;
        }

        // If the square is empty and a piece is selected, execute move if it is legal, unselect the piece otherwise
        if (!piece && gameState.selectedSquare) {
            gameState.legalMoves.includes(position) ? 
            // replace with move execution later
            setGameState({
                ...gameState,
                selectedSquare: null,
                legalMoves: []
            }) : 
            setGameState({
                ...gameState,
                selectedSquare: null,
                legalMoves: []
            });
            return;
        }
        // PIECE ON SQUARE
        // If the piece belongs to the current player, select it
        if (piece?.color === gameState.toMove) {
            setGameState({
                ...gameState,
                selectedSquare: position,
                legalMoves: [{x: 4, y: 4}] // calculateLegalMoves(position, gameState)  // You'll implement this later
            });
        // Otherwise, if the piece is capturable, execute the move, else, unselect the selected piece
        } else {
            gameState.legalMoves.includes(position) ? 
            // replace with move execution later
            setGameState({
                ...gameState,
                selectedSquare: null,
                legalMoves: []
            }) : 
            setGameState({
                ...gameState,
                selectedSquare: null,
                legalMoves: []
            });
        }
    };

    return (
        <ChessBoard orientation="white" gameState={gameState} onSquareClick={handleSquareClick} />
    );
};

export default LocalGame;