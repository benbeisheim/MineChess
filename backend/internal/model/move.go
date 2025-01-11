package model

type WSMove struct {
	From      Position
	To        Position
	Promotion PieceType
}

type CastleRookMove struct {
	From Position
	To   Position
}

type Ply struct {
	Piece          *Piece
	From           Position
	To             Position
	CapturedPiece  *Piece
	CastleRookMove *CastleRookMove
	Promotion      PieceType
	Notation       string
}

type Move struct {
	WhitePly Ply
	BlackPly Ply
}
