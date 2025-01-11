package model

import "fmt"

type PieceType string

func (p PieceType) getPieceNotation() string {
	switch p {
	case King:
		return "K"
	case Queen:
		return "Q"
	case Rook:
		return "R"
	case Bishop:
		return "B"
	case Knight:
		return "N"
	case Pawn:
		return ""
	}
	return ""
}

const (
	King   PieceType = "king"
	Queen  PieceType = "queen"
	Rook   PieceType = "rook"
	Bishop PieceType = "bishop"
	Knight PieceType = "knight"
	Pawn   PieceType = "pawn"
)

type BoardState struct {
	Board             [][]*Piece `json:"board"`
	BlackKingPosition Position   `json:"blackKingPosition"`
	WhiteKingPosition Position   `json:"whiteKingPosition"`
}

type Square struct {
	Position Position `json:"position"`
	Piece    *Piece   `json:"piece"`
}

type Piece struct {
	Type     PieceType `json:"type"`
	Color    string    `json:"color"`
	Position Position  `json:"position"`
	HasMoved bool      `json:"hasMoved"`
}

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func (p Position) getSquareNotation() string {
	return fmt.Sprintf("%c%d", p.X+97, 8-p.Y)
}

func (p Position) getFileNotation() string {
	return fmt.Sprintf("%c", p.X+97)
}

func NewBoard() *BoardState {
	board := &BoardState{}
	for i := 0; i < 8; i++ {
		board.Board = append(board.Board, make([]*Piece, 8))
	}
	board.Board[0][0] = &Piece{Type: "rook", Color: "black", HasMoved: false, Position: Position{X: 0, Y: 0}}
	board.Board[0][7] = &Piece{Type: "rook", Color: "black", HasMoved: false, Position: Position{X: 7, Y: 0}}
	board.Board[7][0] = &Piece{Type: "rook", Color: "white", HasMoved: false, Position: Position{X: 7, Y: 0}}
	board.Board[7][7] = &Piece{Type: "rook", Color: "white", HasMoved: false, Position: Position{X: 7, Y: 7}}
	board.Board[0][1] = &Piece{Type: "knight", Color: "black", HasMoved: false, Position: Position{X: 0, Y: 1}}
	board.Board[0][6] = &Piece{Type: "knight", Color: "black", HasMoved: false, Position: Position{X: 0, Y: 6}}
	board.Board[7][1] = &Piece{Type: "knight", Color: "white", HasMoved: false, Position: Position{X: 7, Y: 1}}
	board.Board[7][6] = &Piece{Type: "knight", Color: "white", HasMoved: false, Position: Position{X: 7, Y: 6}}
	board.Board[0][2] = &Piece{Type: "bishop", Color: "black", HasMoved: false, Position: Position{X: 0, Y: 2}}
	board.Board[0][5] = &Piece{Type: "bishop", Color: "black", HasMoved: false, Position: Position{X: 0, Y: 5}}
	board.Board[7][2] = &Piece{Type: "bishop", Color: "white", HasMoved: false, Position: Position{X: 7, Y: 2}}
	board.Board[7][5] = &Piece{Type: "bishop", Color: "white", HasMoved: false, Position: Position{X: 7, Y: 5}}
	board.Board[0][3] = &Piece{Type: "queen", Color: "black", HasMoved: false, Position: Position{X: 0, Y: 3}}
	board.Board[0][4] = &Piece{Type: "king", Color: "black", HasMoved: false, Position: Position{X: 0, Y: 4}}
	board.Board[7][3] = &Piece{Type: "queen", Color: "white", HasMoved: false, Position: Position{X: 7, Y: 3}}
	board.Board[7][4] = &Piece{Type: "king", Color: "white", HasMoved: false, Position: Position{X: 7, Y: 4}}
	for i := 0; i < 8; i++ {
		board.Board[1][i] = &Piece{Type: "pawn", Color: "black", HasMoved: false, Position: Position{X: 1, Y: i}}
		board.Board[6][i] = &Piece{Type: "pawn", Color: "white", HasMoved: false, Position: Position{X: 6, Y: i}}
	}
	board.BlackKingPosition = Position{X: 4, Y: 0}
	board.WhiteKingPosition = Position{X: 4, Y: 7}
	return board
}
