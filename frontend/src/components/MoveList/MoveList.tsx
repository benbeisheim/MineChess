import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useRef } from "react";

const MoveList: React.FC = () => {
    const trysHistory = useSelector((state: RootState) => state.game.moveHistory);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Scroll to bottom when moves are added
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [trysHistory]);
    
    
    const renderMoveHistory = () => {
        const moves = [];
        for (let i = 0; i < trysHistory.length; i+=2) {
            moves.push([trysHistory[i], trysHistory[i+1] || null]);
        }

        return moves.map((move, index) => {
            return (
                <tr key={index}>
                    <td className="text-white text-center px-2">{Math.floor(index) + 1}.</td>
                    <td className="text-white text-center px-2">{move[0].notation}</td>
                    <td className="text-white text-center px-2">{move[1]?.notation}</td>
                </tr>
            );
        });
    };

    return (
        // Single flex container that grows and handles overflow
        <div className="h-[200px] flex flex-col bg-darkest-gray">
            <div className="shrink-0">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-white text-left px-2">Move</th>
                            <th className="text-white text-left px-2">White</th>
                            <th className="text-white text-left px-2">Black</th>
                        </tr>
                    </thead>
                </table>
            </div>
            {/* Direct scrollable container */}
            <div className="flex-grow overflow-y-auto" ref={scrollRef}>
                <table className="w-full">
                    <tbody>
                        {renderMoveHistory()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MoveList;