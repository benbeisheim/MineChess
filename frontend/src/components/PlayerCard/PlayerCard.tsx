import { RootState } from "../../store";
import { updateClock } from "../../store/gameSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Player } from "../../types/chess";
import Clock from "../Clock/Clock";

const PlayerCard: React.FC<{
    player: Player;
}> = ({ player }) => {
    const dispatch = useAppDispatch();
    const { clock, toMove } = useAppSelector((state: RootState) => state.game);
    const timeLeft = clock[player.color];
    const isActive = timeLeft > 0 && toMove === player.color;

    return (
        <div className="flex w-full border-2 border-neutral-500">
            <div className="text-2xl font-bold text-white w-1/2">{player.name}</div>
            <Clock 
                initialTime={timeLeft}
                isRunning={isActive}
                onTimeUpdate={(time) => {
                    dispatch(updateClock({
                        timeLeft: Math.floor(time),
                        color: player.color
                    }));
                }}
            />
        </div>
    );
};

export default PlayerCard;