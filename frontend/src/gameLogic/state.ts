import { Position } from "../types/chess";
import { GameState } from "../types/chess";
import { isKingInCheck, isNoLegalMoves } from "./rules";

export function executeMove(from: Position, to: Position, gameState: GameState) {
    // make move
    gameState.boardState.board[to.y][to.x] = gameState.boardState.board[from.y][from.x];
    gameState.boardState.board[from.y][from.x] = null;
    // update moved pieces position
    gameState.boardState.board[to.y][to.x]!.position = {x: to.x, y: to.y};
    // if king moved, update king position
    if (gameState.boardState.board[to.y][to.x]?.type === 'king' && gameState.boardState.board[to.y][to.x]?.color === 'white') {
        gameState.boardState.whiteKingPosition = to;
    } else if (gameState.boardState.board[to.y][to.x]?.type === 'king' && gameState.boardState.board[to.y][to.x]?.color === 'black') {
        gameState.boardState.blackKingPosition = to;
    }
    // if en pessant target captured, remove captured piece
    if (gameState.enPassantTarget && gameState.enPassantTarget.x === to.x && gameState.enPassantTarget.y === to.y) {
        gameState.capturedPieces.push(gameState.boardState.board[gameState.enPassantTarget.y][gameState.enPassantTarget.x]!);
        gameState.boardState.board[gameState.enPassantTarget.y + (gameState.toMove === 'white' ? 1 : -1)][gameState.enPassantTarget.x] = null;
    }
    // If king castled, update rook position
    if (gameState.boardState.board[to.y][to.x]?.type === 'king' && Math.abs(from.x - to.x) === 2) {
        const rook = gameState.boardState.board[to.y][to.x === 2 ? 0 : 7];
        rook!.hasMoved = true;
        gameState.boardState.board[to.y][to.x === 2 ? 3 : 5] = gameState.boardState.board[to.y][to.x === 2 ? 0 : 7];
        gameState.boardState.board[to.y][to.x === 2 ? 0 : 7] = null;
    }
    // if pawn advanced two squares, set en passant target
    if (gameState.boardState.board[to.y][to.x]?.type === 'pawn' && Math.abs(from.y - to.y) === 2) {
        gameState.enPassantTarget = {x: from.x, y: to.y + (gameState.toMove === 'white' ? 1 : -1)};
    } else {
        gameState.enPassantTarget = null;
    }
    // set moving piece to hasMoved
    gameState.boardState.board[to.y][to.x]!.hasMoved = true;
    // switch turn
    gameState.toMove = gameState.toMove === 'white' ? 'black' : 'white';
    // check if king is in check
    gameState.isCheck = isKingInCheck(gameState.boardState, gameState.toMove);
    // if king is in check and no legal moves, game is over
    if (gameState.isCheck && isNoLegalMoves(gameState)) {
        gameState.resolve = 'checkmate';
    // if king is not in check and no legal moves, game is stalemate
    } else if (!gameState.isCheck && isNoLegalMoves(gameState)) {
        gameState.resolve = 'stalemate';
    }
}