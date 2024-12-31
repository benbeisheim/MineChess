import ChessBoard from "../ChessBoard/ChessBoard";
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { initializeBoard, selectSquare } from '../../store/gameSlice';
import { Position } from '../../types/chess';
const LocalGame: React.FC = () => {
    const dispatch = useAppDispatch();
    const gameState = useAppSelector(state => state.game);

    useEffect(() => {
        // Initialize the board when component mounts
        dispatch(initializeBoard());
    }, [dispatch]);

    const onSquareClick = (position: Position) => {
        dispatch(selectSquare(position));
    };

    return (
        <ChessBoard
            gameState={gameState}
            onSquareClick={onSquareClick}
            orientation="white"
        />
    );
};
export default LocalGame;