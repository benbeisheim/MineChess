import { selectSquare, setPromotionSquare } from "../../store/gameSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { PieceType, Position } from "../../types/chess";
import ChessBoard from "../ChessBoard/ChessBoard";
import PlayerControl from "../PlayerControl/PlayerControl";
import { GameWebSocket } from "../../services/websocket/gameWebSocket";
import { useEffect, useRef } from "react";
import { PlayerColor } from "../../types/chess";
import { RootState } from "../../store";
interface ChessGameProps {
    gameId: string;
    playerColor: PlayerColor;
}

const ChessGame: React.FC<ChessGameProps> = ({ gameId, playerColor }) => {
    const dispatch = useAppDispatch();
    const gameState = useAppSelector((state: RootState) => state.game);
    const gameSocket = useRef<GameWebSocket | null>(null);

    useEffect(() => {
        gameSocket.current = new GameWebSocket(gameId, dispatch);
        
        return () => {
            gameSocket.current?.disconnect();
        };
    }, [gameId, dispatch]);

    const onSquareClick = (position: Position) => {
        const selectedSquare = gameState.selectedSquare;
        console.log("Selected square, position", selectedSquare, position);
        // For any move besides promotion, select the square
        if (selectedSquare && gameState.boardState.board[selectedSquare.y][selectedSquare.x]?.type === 'pawn' && (position.y === 0 || position.y === 7)) {
            console.log("Setting promotion square", position);
            dispatch(setPromotionSquare(position));
            return;
        } else {
            dispatch(selectSquare({ position, playerColor }));
        }
        
        // If this click would result in a move, send it to the server
        if (selectedSquare && gameState.legalMoves.some(move => 
            move.x === position.x && move.y === position.y
        )) {
            gameSocket.current?.sendMove({
                from: selectedSquare,
                to: position,
            });
        }
    };

    const handlePromotionClick = (pieceType: PieceType) => {
        console.log("Handling promotion click for", pieceType);
        if (gameState.promotionSquare && gameState.selectedSquare) {
            gameSocket.current?.sendMove({
                from: gameState.selectedSquare,
                to: gameState.promotionSquare,
                promotion: pieceType
            });
        }
    };

    return (
        <div className="h-[95vh] aspect-[4/3] grid grid-cols-4 gap-4">
            <div className="col-span-3 flex flex-col justify-between">
                <ChessBoard 
                    orientation={playerColor} 
                    onSquareClick={onSquareClick} 
                    handlePromotionClick={handlePromotionClick} 
                />
            </div>
            <div className="col-span-1 h-full"> 
                <PlayerControl 
                    onResign={() => {}}
                    onDrawOffer={() => {}}
                />
            </div>
        </div>
    );
    };

export default ChessGame;