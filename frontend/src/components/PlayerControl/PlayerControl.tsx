import { RootState } from "../../store";
import { useAppSelector } from "../../store/hooks";
import MoveList from "../MoveList/MoveList";
import PlayerCard from "../PlayerCard/PlayerCard";

interface PlayerControlProps {
    onResign?: () => void;
    onDrawOffer?: () => void;
}

const PlayerControl: React.FC<PlayerControlProps> = ({ onResign, onDrawOffer }) => {
    const { players } = useAppSelector((state: RootState) => state.game);
    return (
        <div className="flex flex-col bg-darker-gray p-4 h-full justify-center">
            <div className="shrink-0 mb-4">
                <PlayerCard player={{name: players.black.name, color: 'black'}} />
            </div>
            <div className="shrink-0 flex gap-2 mb-4">
                <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600" onClick={onResign}>Resign</button>
                <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600" onClick={onDrawOffer}>Offer Draw</button>
            </div>
            <MoveList />
            <div className="shrink-0 mb-4">
                <PlayerCard player={{name: players.white.name, color: 'white'}} />
            </div>
        </div>
    );
};

export default PlayerControl;