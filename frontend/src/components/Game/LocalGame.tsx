import { useState } from 'react';
import ChessBoard from '../ChessBoard/ChessBoard';
import { GameState, Position } from '../../types/chess';
import { getInitialPosition } from '../../utils/pieces';
import { getLegalMoves } from '../../gameLogic/rules';
import { executeMove } from '../../gameLogic/state';

const LocalGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        boardState: getInitialPosition(),
        toMove: 'white',
        moveHistory: [],
        capturedPieces: [],
        isCheck: false,
        selectedSquare: null,
        legalMoves: [],
        enPassantTarget: null,
        resolve: null,
    });

    const handleSquareClick = (position: Position) => {
        const piece = gameState.boardState.board[position.y][position.x];
        if (gameState.resolve) {
            return;
        }

        // NO PIECE ON SQAURE
        // If the square is empty and no piece is selected, return
        if (!piece && !gameState.selectedSquare) {
            return;
        }

        // If the square is empty and a piece is selected, execute move if it is legal, unselect the piece otherwise
        if (!piece && gameState.selectedSquare) {
            if (gameState.legalMoves.some(move => move.x === position.x && move.y === position.y)) {
                // execute move
                setGameState({
                    ...executeMove(gameState.selectedSquare, position, gameState),
                    selectedSquare: null,
                    legalMoves: [],
                });
            } else {
                // unselect the piece
                setGameState({
                    ...gameState,
                    selectedSquare: null,
                    legalMoves: []
                });
            }
            return;
        }
        // PIECE ON SQUARE
        // If the piece belongs to the current player, select it
        if (piece?.color === gameState.toMove) {
            setGameState({
                ...gameState,
                selectedSquare: position,
                legalMoves: getLegalMoves(position, gameState)
            });
        // Otherwise, if the piece is capturable, execute the move, else, unselect the selected piece
        } else if (gameState.selectedSquare) {
            if (gameState.legalMoves.some(move => move.x === position.x && move.y === position.y)) {
                // execute move
                setGameState({
                    ...executeMove(gameState.selectedSquare, position, gameState),
                    selectedSquare: null,
                    legalMoves: [],
                });
            } else {
                // unselect the piece
                setGameState({
                    ...gameState,
                    selectedSquare: null,
                    legalMoves: []
                });
            }
        }
    };

    return (
        <div>
            <ChessBoard orientation="white" gameState={gameState} onSquareClick={handleSquareClick} />
            <div>
                {gameState.resolve && <h1>{gameState.resolve}</h1>}
            </div>
        </div>
    );
};

export default LocalGame;