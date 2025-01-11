package model

import (
	"github.com/gofiber/websocket/v2"
)

type Player struct {
	ID       string
	Color    string
	Conn     *websocket.Conn
	TimeLeft int
}

type PlayerColor string

const (
	PlayerColorWhite PlayerColor = "white"
	PlayerColorBlack PlayerColor = "black"
)
