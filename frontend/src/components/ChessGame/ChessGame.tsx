import { selectSquare } from "../../store/gameSlice";
import { useAppDispatch } from "../../store/hooks";
import { Position } from "../../types/chess";
import ChessBoard from "../ChessBoard/ChessBoard";
import PlayerControl from "../PlayerControl/PlayerControl";

const ChessGame: React.FC = () => {
    const dispatch = useAppDispatch();

    const onSquareClick = (position: Position) => {
        dispatch(selectSquare(position));
    };
;    
return (
    <div className="h-[95vh] aspect-[4/3] grid grid-cols-4 gap-4">
        <div className="col-span-3 flex flex-col justify-between">
            <ChessBoard orientation="white" onSquareClick={onSquareClick} />
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