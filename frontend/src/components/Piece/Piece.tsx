import { PieceType, PlayerColor } from '../../types/chess';
import { getPieceImage } from '../../utils/pieces';

interface PieceProps {
    type: PieceType;
    color: PlayerColor;
    size: number;  // We'll pass this down from the square size
    isSelected: boolean;
}

export const Piece: React.FC<PieceProps> = ({ type, color, size, isSelected }) => {
    const pieceImage = getPieceImage(color, type);

    return (
        <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <img 
                src={pieceImage} 
                alt={`${color} ${type}`}
                className={isSelected ? 'w-[100%] h-[100%]' : 'w-[85%] h-[85%]'} // Making piece slightly smaller than square
            />
        </div>
    );
};