package model

import (
	"encoding/json"
	"errors"
	"fmt"
	"sync"

	"github.com/benbeisheim/MineChess/backend/internal/ws"
	"github.com/gofiber/websocket/v2"
)

// The connections for a specific game
type GameConnections struct {
	connections map[string]*websocket.Conn // playerID -> connection
	mu          sync.RWMutex
}

// The Game struct focuses on a single game's state and its observers
type Game struct {
	ID          string
	mu          sync.Mutex
	state       GameState
	connections *GameConnections // Connections just for this game
}

type GameState struct {
	Board           *BoardState    `json:"boardState"`
	ToMove          string         `json:"toMove"`
	MoveHistory     []Move         `json:"moveHistory"`
	CapturedPieces  CapturedPieces `json:"capturedPieces"`
	IsCheck         bool           `json:"isCheck"`
	SelectedSquare  *Position      `json:"selectedSquare"` // Made nullable
	LegalMoves      []Position     `json:"legalMoves"`
	EnPassantTarget *Position      `json:"enPassantTarget"` // Made nullable
	Resolve         *string        `json:"resolve"`         // Made nullable
	Clock           struct {
		White int `json:"white"`
		Black int `json:"black"`
	} `json:"clock"`
	Players struct {
		White string `json:"white"`
		Black string `json:"black"`
	} `json:"players"`
	PromotionSquare *Position `json:"promotionSquare"` // Made nullable
}

type CapturedPieces struct {
	White []Piece `json:"white"`
	Black []Piece `json:"black"`
}

func NewGame(id string) *Game {
	return &Game{
		ID:          id,
		mu:          sync.Mutex{},
		state:       newGameState(),
		connections: NewGameConnections(),
	}
}

func NewGameConnections() *GameConnections {
	return &GameConnections{
		connections: make(map[string]*websocket.Conn),
	}
}

func newGameState() GameState {
	return GameState{
		Board:          NewBoard(),
		ToMove:         "white",
		MoveHistory:    make([]Move, 0),
		CapturedPieces: newCapturedPieces(),
		Players: struct {
			White string `json:"white"`
			Black string `json:"black"`
		}{
			White: "",
			Black: "",
		},
		Clock: struct {
			White int `json:"white"`
			Black int `json:"black"`
		}{
			White: 3000,
			Black: 3000,
		},
		LegalMoves: make([]Position, 0),
	}
}

func newCapturedPieces() CapturedPieces {
	return CapturedPieces{
		White: make([]Piece, 0),
		Black: make([]Piece, 0),
	}
}

func (g *Game) AddPlayer(playerID string) (string, error) {
	fmt.Println("Adding player to game in model/game", playerID, g.state.Players)
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.state.Players.White == "" {
		g.state.Players.White = playerID
		return "white", nil
	}
	if g.state.Players.Black == "" {
		g.state.Players.Black = playerID
		return "black", nil
	}
	return "", errors.New("game is full")
}

func (g *Game) GetState() GameState {
	g.mu.Lock()
	defer g.mu.Unlock()

	return g.state
}

func (g *Game) IsPlayerInGame(playerID string) bool {
	g.mu.Lock()
	defer g.mu.Unlock()
	fmt.Println("Checking if player is in game", playerID)
	if g.state.Players.White != "" {
		fmt.Println("White player is in game", g.state.Players.White)
	}
	if g.state.Players.Black != "" {
		fmt.Println("Black player is in game", g.state.Players.Black)
	}

	if g.state.Players.White != "" && g.state.Players.White == playerID {
		return true
	}
	if g.state.Players.Black != "" && g.state.Players.Black == playerID {
		return true
	}
	return false
}

func (g *Game) isPlayerInGame(playerID string) bool {
	if g.state.Players.White != "" && g.state.Players.White == playerID {
		return true
	}
	if g.state.Players.Black != "" && g.state.Players.Black == playerID {
		return true
	}
	return false
}

func (g *Game) CanSpectate() bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	return g.state.Players.White == "" || g.state.Players.Black == ""
}

func (g *Game) canSpectate() bool {
	return g.state.Players.White == "" || g.state.Players.Black == ""
}

func (g *Game) MakeMove(move WSMove) error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.state.ToMove != g.state.Board.Board[move.From.Y][move.From.X].Color {
		return errors.New("not your turn")
	}

	// Validate and execute the move
	if err := g.validateMove(move); err != nil {
		return err
	}

	return g.executeMove(move)
}

/*
	func (g *Game) Resign(playerID string) error {
		g.mu.Lock()
		defer g.mu.Unlock()

		if !g.IsPlayerInGame(playerID) {
			return errors.New("player not in game")
		}

		return nil
	}

	func (g *Game) OfferDraw(playerID string) error {
	    g.mu.Lock()
	    defer g.mu.Unlock()

	    if !g.IsPlayerInGame(playerID) {
	        return errors.New("player not in game")
	    }

	    g.drawOffer = &DrawOffer{
	        OfferedBy: playerID,
	        OfferedAt: time.Now(),
	    }
	    return nil
	}
*/
func (g *Game) validateMove(move WSMove) error {
	// TODO: Implement move validation
	return nil
}

func (g *Game) executeMove(move WSMove) error {
	fmt.Println("Executing move", move)
	ply := g.makePly(move)
	// move the piece
	piece := g.state.Board.Board[move.From.Y][move.From.X]
	g.state.Board.Board[move.From.Y][move.From.X] = nil
	g.state.Board.Board[move.To.Y][move.To.X] = piece
	// set hasMoved to true
	g.state.Board.Board[move.To.Y][move.To.X].HasMoved = true
	// if promotion, change piece type
	if move.Promotion != "" {
		g.state.Board.Board[move.To.Y][move.To.X].Type = move.Promotion
	}
	// if king move, handle castle and update king position
	if piece.Type == King {
		ply = g.handleCastle(move, ply)
		switch g.state.ToMove {
		case "white":
			g.state.Board.WhiteKingPosition = move.To
		case "black":
			g.state.Board.BlackKingPosition = move.To
		}
	}
	// if en passant, handle en passant
	if piece.Type == Pawn {
		ply = g.handleEnPassant(move, ply)
	}

	// Add the ply to the move history
	if g.state.ToMove == "white" {
		// If white moved, add Move
		g.state.MoveHistory = append(g.state.MoveHistory, Move{
			WhitePly: ply,
		})
	} else {
		// If black moved, add BlackPly to the last Move
		lastIdx := len(g.state.MoveHistory) - 1
		g.state.MoveHistory[lastIdx].BlackPly = ply
	}

	// update moved pieces position
	g.state.Board.Board[move.To.Y][move.To.X].Position = move.To

	// switch turn
	g.switchTurn()
	// check if opponent king is in check after move
	g.state.IsCheck = isKingInCheck(g.state.Board, g.state.ToMove)
	// check if game is over
	if isNoLegalMoves(g.state.Board, g.state.ToMove) {
		switch g.state.IsCheck {
		case true:
			result := "checkmate"
			g.state.Resolve = &result
		case false:
			result := "stalemate"
			g.state.Resolve = &result
		}
	}

	go g.BroadcastState()

	return nil
}

func isKingInCheck(board *BoardState, color string) bool {
	// TODO: Implement king in check detection
	return false
}

func isNoLegalMoves(board *BoardState, color string) bool {
	// TODO: Implement no legal moves detection
	return false
}

func (g *Game) handleEnPassant(move WSMove, ply Ply) Ply {
	// if the move is an en passant capture, remove the captured piece and alter ply notation
	if g.state.EnPassantTarget != nil && move.To.X == g.state.EnPassantTarget.X && move.To.Y == g.state.EnPassantTarget.Y {
		fmt.Println("En passant capture")
		switch g.state.ToMove {
		case "white":
			fmt.Println("White en passant capture", move.To.Y, move.To.X)
			g.state.CapturedPieces.White = append(g.state.CapturedPieces.White, *g.state.Board.Board[move.To.Y+1][move.To.X])
			g.state.Board.Board[move.To.Y+1][move.To.X] = nil
		case "black":
			fmt.Println("Black en passant capture", move.To.Y, move.To.X)
			g.state.CapturedPieces.Black = append(g.state.CapturedPieces.Black, *g.state.Board.Board[move.To.Y-1][move.To.X])
			g.state.Board.Board[move.To.Y-1][move.To.X] = nil
		}
		ply.Notation = "x" + ply.Notation
	}
	// if the move is double pawn move, set en passant target
	switch move.To.Y - move.From.Y {
	case 2:
		g.state.EnPassantTarget = &Position{X: move.To.X, Y: move.To.Y - 1}
	case -2:
		g.state.EnPassantTarget = &Position{X: move.To.X, Y: move.To.Y + 1}
	default:
		g.state.EnPassantTarget = nil
	}

	return ply
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func (g *Game) handleCastle(move WSMove, ply Ply) Ply {
	// TODO: Implement castle handling
	// assume only called for king move
	if abs(move.From.X-move.To.X) == 2 {
		switch move.To.X {
		case 2:
			rook := g.state.Board.Board[move.From.Y][0]
			g.state.Board.Board[move.From.Y][0] = nil
			g.state.Board.Board[move.From.Y][3] = rook
			ply.CastleRookMove = &CastleRookMove{
				From: Position{X: 0, Y: move.From.Y},
				To:   Position{X: 3, Y: move.From.Y},
			}
			ply.Notation = "O-O-O"
		case 6:
			rook := g.state.Board.Board[move.From.Y][7]
			g.state.Board.Board[move.From.Y][7] = nil
			g.state.Board.Board[move.From.Y][5] = rook
			ply.CastleRookMove = &CastleRookMove{
				From: Position{X: 7, Y: move.From.Y},
				To:   Position{X: 5, Y: move.From.Y},
			}
			ply.Notation = "O-O"
		}
	}
	return ply
}

func (g *Game) makePly(move WSMove) Ply {
	// return ply without rook castle move, add castle rook move in castle detection
	return Ply{
		Piece:          g.state.Board.Board[move.From.Y][move.From.X],
		From:           move.From,
		To:             move.To,
		CapturedPiece:  g.state.Board.Board[move.To.Y][move.To.X],
		CastleRookMove: nil,
		Promotion:      move.Promotion,
		Notation:       g.getNotation(move),
	}
}

func (g *Game) getNotation(move WSMove) string {
	// TODO: Implement notation
	piece := g.state.Board.Board[move.From.Y][move.From.X]
	from := move.From
	to := move.To
	pieceNotationPrefix := piece.Type.getPieceNotation()
	pieceNotationCapture := ""
	if g.state.Board.Board[to.Y][to.X] != nil {
		pieceNotationCapture = "x"
	}
	pieceNotationSuffix := to.getSquareNotation()
	pawnFileSpecifier := ""
	if piece.Type == Pawn && from.X != to.X {
		pawnFileSpecifier = from.getFileNotation()
	}
	return fmt.Sprintf("%s%s%s%s", pieceNotationPrefix, pawnFileSpecifier, pieceNotationCapture, pieceNotationSuffix)
}

func (g *Game) switchTurn() {
	if g.state.ToMove == "white" {
		g.state.ToMove = "black"
	} else {
		g.state.ToMove = "white"
	}
}

func (g *Game) RegisterConnection(playerID string, conn *websocket.Conn) error {
	g.mu.Lock()
	isAuthorized := g.isPlayerInGame(playerID) || g.canSpectate()
	g.mu.Unlock()

	if !isAuthorized {
		return errors.New("not authorized to join this game")
	}

	g.connections.mu.Lock()
	// If there's an existing connection for this player, close it properly
	if existingConn, exists := g.connections.connections[playerID]; exists {
		g.connections.mu.Unlock() // Unlock before closing to prevent deadlock
		fmt.Printf("Found existing connection for player %s, closing it\n", playerID)
		existingConn.WriteMessage(websocket.CloseMessage,
			websocket.FormatCloseMessage(websocket.CloseNormalClosure, "New connection established"))
		existingConn.Close()

		// Reacquire lock after closing old connection
		g.connections.mu.Lock()
	}

	// Register the new connection
	g.connections.connections[playerID] = conn
	g.connections.mu.Unlock()

	fmt.Printf("New connection registered for player %s\n", playerID)

	// Send initial state to just this connection instead of broadcasting to all
	state := g.getStateForPlayer(playerID, g.state)
	err := conn.WriteJSON(state)
	if err != nil {
		fmt.Printf("Failed to send initial state to player %s: %v\n", playerID, err)
		return err
	}

	fmt.Printf("Initial state sent to player %s\n", playerID)
	return nil
}

// Modify BroadcastState to safely handle concurrent access
func (g *Game) BroadcastState() error {
	// Get a snapshot of the current state under the game mutex
	g.mu.Lock()
	currentState := g.state // Assuming you have a way to copy the state
	g.mu.Unlock()

	// Get a snapshot of connections under the connections mutex
	g.connections.mu.RLock()
	// Make a copy of the connections we need to broadcast to
	activeConnections := make(map[string]*websocket.Conn)
	for playerID, conn := range g.connections.connections {
		activeConnections[playerID] = conn
	}
	g.connections.mu.RUnlock()

	// Now broadcast to each connection without holding any locks
	for playerID, conn := range activeConnections {
		playerState := g.getStateForPlayer(playerID, currentState)
		fmt.Println("Broadcasting state to player", playerID, playerState)
		jsonGameState, err := json.Marshal(playerState)
		if err != nil {
			fmt.Println("Failed to marshal state to JSON", err)
			continue
		}

		if err := conn.WriteJSON(ws.Message{
			Type:    ws.MessageTypeGameState,
			Payload: json.RawMessage(jsonGameState),
		}); err != nil {
			fmt.Println("Failed to send state to player", playerID, err)
			// Consider removing failed connections
			g.connections.mu.Lock()
			delete(g.connections.connections, playerID)
			g.connections.mu.Unlock()
			continue
		}
		fmt.Println("Sent state to player", playerID)
	}
	return nil
}

// UnregisterConnection removes a WebSocket connection
func (g *Game) UnregisterConnection(playerID string) {
	fmt.Println("Unregistering connection for game", g.ID, "and player", playerID)
	g.connections.mu.Lock()
	defer g.connections.mu.Unlock()

	delete(g.connections.connections, playerID)
	fmt.Println("Unregistered connection for game", g.ID, "and player", playerID)
}

func (g *Game) getStateForPlayer(playerID string, state GameState) GameState {
	// currently just returns the state, will implement mine chess specific state later
	return state
}
