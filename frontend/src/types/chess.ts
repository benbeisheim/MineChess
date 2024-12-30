// Represents a position on the chess board
export interface Position {
    x: number;  // 0-7, representing columns A-H
    y: number;  // 0-7, representing rows 1-8
}

// Defines all possible piece types in chess
export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

// Defines the two possible colors in chess
export type PlayerColor = 'white' | 'black';

// Represents a chess piece with all its properties
export interface PieceData {
    type: PieceType;
    color: PlayerColor;
    position: Position;
    hasMoved: boolean;  // Important for special moves like castling and pawn's first move
}

// Represents the complete state of a chess game
export interface GameState {
    boardState: BoardState;
    toMove: PlayerColor;
    moveHistory: Move[];
    capturedPieces: PieceData[];
    isCheck: boolean;
    selectedSquare: Position | null;
    legalMoves: Position[];
    enPassantTarget: Position | null;
    resolve: 'checkmate' | 'stalemate' | null;
}

// Represents the chess board as a 2D grid of squares
export interface BoardState {
    board: (PieceData | null) [][];
    blackKingPosition: Position;
    whiteKingPosition: Position;
}

// Represents a single square on the board
export interface Square {
    position: Position;
    piece: PieceData | null;  // null means empty square
    isHighlighted: boolean;  // For showing possible moves
    isSelected: boolean;  // For showing the selected piece
}

// Represents a move in chess notation, contains necessary information for game reconstruction (makeMove/unMakeMove)
export interface Move {
    piece: PieceData;
    from: Position;
    to: Position;
    capturedPiece?: PieceData;  // Optional - present if a piece was captured
    rookMove?: {
        from: Position;
        to: Position;
    };
    promotedTo?: PieceType;
    notation: string;  // Chess notation (e.g., "e4", "Nxf3")
}

// Defines the shape of our game logic handlers
export interface GameRules {
    isLegalMove(from: Position, to: Position, gameState: GameState): boolean;
    calculateLegalMoves(piece: PieceData, gameState: GameState): Position[];
    isCheck(gameState: GameState): boolean;
    isCheckmate(gameState: GameState): boolean;
    isStalemate(gameState: GameState): boolean;
}

// Represents a game action that can be performed
export interface GameAction {
    type: 'MOVE' | 'RESIGN' | 'OFFER_DRAW';
    payload: {
        from?: Position;
        to?: Position;
        promotionChoice?: PieceType;
    };
}