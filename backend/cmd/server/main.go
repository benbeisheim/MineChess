package main

import (
	"log"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

type GameManager struct {
	games map[string]*Game
	mu    sync.RWMutex
}

type Game struct {
	ID          string
	White       *Player
	Black       *Player
	Board       *Board
	ToMove      string
	MoveHistory []Move
	Mines       map[string]Position
	mu          sync.Mutex
}

type Player struct {
	ID       string
	Color    string
	Conn     *websocket.Conn
	TimeLeft int
}

type Board struct {
	Squares [][]Square
}

type Square struct {
	Position Position
	Piece    *Piece
}

type Piece struct {
	Type  string
	Color string
}

type Position struct {
	X int
	Y int
}

type Move struct {
	From Position
	To   Position
}

func main() {
	app := fiber.New()
	gameManager := &GameManager{
		games: make(map[string]*Game),
	}

	// Middleware to check if request is websocket
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// WebSocket endpoint for game connections
	app.Get("/ws/game/:gameId", websocket.New(func(c *websocket.Conn) {
		// Get game ID from params
		gameId := c.Params("gameId")

		// Handle websocket connection
		defer c.Close()

		for {
			messageType, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				break
			}
			// Handle different message types...

			// Example echo
			if err := c.WriteMessage(messageType, message); err != nil {
				log.Println("write:", err)
				break
			}
		}
	}))

	// REST endpoints
	api := app.Group("/api")

	// Create new game
	api.Post("/game/create", gameController.createGame)

	// Join existing game
	api.Post("/game/join/:gameId", func(c *fiber.Ctx) error {
		gameId := c.Params("gameId")
		// Join game logic
		return c.JSON(fiber.Map{
			"gameId": gameId,
			"color":  "white", // or black
		})
	})

	log.Fatal(app.Listen(":3000"))
}
