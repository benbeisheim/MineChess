import { Position, BoardState, PlayerColor, GameState } from "../types/chess";
import { getPseudoLegalMoves } from "./moves";

export function getLegalMoves(position: Position, gameState: GameState) : Position[] {
    // Gets pseudo-legal moves and filters out those that leave king in check
    const pseudoLegalMoves = getPseudoLegalMoves(position, gameState);
    return filterMovesForCheck(position, pseudoLegalMoves, gameState.boardState);
}

function filterMovesForCheck(position: Position, moves: Position[], boardState: BoardState) : Position[] {
    // Tests each move by temporarily applying it and checking if it leaves king in check
    return []
}

function isKingInCheck(boardState: BoardState, color: PlayerColor) : boolean {
    // Finds king position
    // Checks if any opponent piece can capture king
    return false
}

function findKingPosition(boardState: BoardState, color: PlayerColor) : Position {
    // Helper function to locate king of specified color
    return color === 'black' ? boardState.blackKingPosition : boardState.whiteKingPosition
}

function isSquareAttacked(position: Position, attackingColor: PlayerColor, boardState: BoardState) : boolean {
    // Determines if any piece of attackingColor can move to position
    // Used for both check detection and calculating attacked squares
    return false
}