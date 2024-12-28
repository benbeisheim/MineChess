import React from 'react';
import { Position, Piece } from '../types/chess';

interface SquareProps {
    position: Position;
    piece: Piece | null;
    isLight: boolean;
    isHighlighted: boolean;
    isSelected: boolean;
    notation: string;
    squareSize: number;
    onSquareClick?: () => void;
}

const Square: React.FC<SquareProps> = ({
    position,
    piece,
    isLight,
    isHighlighted,
    isSelected,
    notation,
    squareSize,
    onSquareClick
}) => {
    // Make the color classes more specific to ensure they apply
    const baseColor = isLight ? 'bg-amber-100' : 'bg-amber-800';
    const highlightClass = isHighlighted ? 'ring-2 ring-blue-400' : '';
    const selectedClass = isSelected ? 'ring-2 ring-blue-600' : '';
    
    return (
        <div 
            className={`${baseColor} ${highlightClass} ${selectedClass} 
                       inline-flex items-center justify-center relative`}
            style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`,
                flexBasis: `${squareSize}px`,
                flexShrink: 0,  // Prevent squares from shrinking
                flexGrow: 0,    // Prevent squares from growing
            }}
            data-square={notation}
            onClick={onSquareClick}
        >
            {/* We'll add piece rendering here later */}
        </div>
    );
};

export default Square;