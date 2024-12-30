import { Position, BoardState, GameState } from "../types/chess";

export function getPseudoLegalMoves(position: Position, gameState: GameState) : Position[] {
    // Routes to specific piece movement functions based on piece type
    // Returns all moves that follow that piece's movement rules
    switch (gameState.boardState.board[position.y][position.x]?.type) {
        case 'pawn':
            return getPseudoLegalPawnMoves(position, gameState);
        case 'knight':
            return getPseudoLegalKnightMoves(position, gameState.boardState);
        case 'bishop':
            return getPseudoLegalBishopMoves(position, gameState.boardState);
        case 'rook':
            return getPseudoLegalRookMoves(position, gameState.boardState);
        case 'queen':
            return getPseudoLegalQueenMoves(position, gameState.boardState);
        case 'king':
            return getPseudoLegalKingMoves(position, gameState);
        default:
            return []
    }
}

// Individual piece movement calculators
// These consider basic movement rules and piece capture
function getPseudoLegalPawnMoves(position: Position, gameState: GameState) : Position[] {
    // Handles:
    // - Forward movement (one or two squares on first move)
    const moves = [];
    const piece = gameState.boardState.board[position.y][position.x];
    const dir = piece?.color === 'white' ? 1 : -1;
    // check first square ahead
    const ahead = { x: position.x, y: position.y + dir };
    if (gameState.boardState.board[ahead.y][ahead.x] === null) {
        moves.push(ahead);
    }
    // check second square if pawn has not moved
    if (!piece?.hasMoved) {
        if (gameState.boardState.board[position.y + 2 * dir][position.x] === null) {
            moves.push({ x: position.x, y: position.y + 2 * dir });
        }
    }
    // - Diagonal captures
    if (gameState.boardState.board[position.y+dir][position.x - 1]?.color !== piece?.color) {
        moves.push({ x: position.x - 1, y: position.y + dir });
    }
    if (gameState.boardState.board[position.y+dir][position.x + 1]?.color !== piece?.color) {
        moves.push({ x: position.x + 1, y: position.y + dir });
    }
    // - En passant opportunities
    if (gameState.enPassantTarget) {
        if (gameState.enPassantTarget.x === position.x - 1 && gameState.enPassantTarget.y === position.y + dir) {
            moves.push(gameState.enPassantTarget);
        }
    }
    return moves
}

function getPseudoLegalKnightMoves(position: Position, boardState: BoardState) : Position[] {
    // L-shaped movements
    // Can jump over pieces
    return []
}

function getPseudoLegalBishopMoves(position: Position, boardState: BoardState) : Position[] {
    // Diagonal movements
    // Stops at first piece encountered in each direction
    return []
}

function getPseudoLegalRookMoves(position: Position, boardState: BoardState) : Position[] {
    // Straight line movements
    // Stops at first piece encountered in each direction
    return []
}

function getPseudoLegalQueenMoves(position: Position, boardState: BoardState) : Position[] {
    // Combines bishop and rook movements
    return getPseudoLegalBishopMoves(position, boardState).concat(getPseudoLegalRookMoves(position, boardState))
}

function getPseudoLegalKingMoves(position: Position, gameState: GameState) : Position[] {
    // Single square movements
    return []
}