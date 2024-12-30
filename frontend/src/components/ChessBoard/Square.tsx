import React from 'react';
import { Position, PieceData, PlayerColor } from '../../types/chess';
import { Piece } from '../Piece/Piece';

interface SquareProps {
    position: Position;
    piece: PieceData | null;
    isLight: boolean;
    isHighlighted: boolean;
    isSelected: boolean;
    orientation: PlayerColor;
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
    orientation,
    notation,
    squareSize,
    onSquareClick
}) => {
    // Make the color classes more specific to ensure they apply
    const baseColor = isLight ? 'bg-amber-100' : 'bg-amber-800';
    const highlightClass = isHighlighted ? 'ring-2 ring-blue-400' : '';
    const selectedClass = isSelected ? 'ring-2 ring-blue-600' : '';
    
    // Determine if this square should show labels
    const shouldShowFileLabel = orientation === 'white' ? position.y === 7 : position.y === 0;
    const shouldShowRankLabel = orientation === 'white' ? position.x === 0 : position.x === 7;
    
    // Calculate label sizes proportional to square size
    const labelSize = Math.max(squareSize * 0.2, 12); // Min size of 12px
    
    return (
        <div 
            className={`${baseColor} ${highlightClass} ${selectedClass} 
                       relative flex items-center justify-center`}
            style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`,
            }}
            data-square={notation}
            onClick={onSquareClick}
        >
             {piece && (
                <Piece 
                    type={piece.type}
                    color={piece.color}
                    size={squareSize}
                />
            )}
            {shouldShowFileLabel && (
                <div 
                    className={"absolute bottom-1 right-1 georgia " + (isLight ? "text-amber-800" : "text-amber-100")} 
                    style={{ fontSize: `${labelSize}px`}}
                >
                    {notation[0]} {/* First character of notation is file */}
                </div>
            )}
            
            {shouldShowRankLabel && (
                <div 
                    className={"absolute top-1 left-1 georgia " + (isLight ? "text-amber-800" : "text-amber-100")}
                    style={{ fontSize: `${labelSize}px` }}
                >
                    {notation[1]} {/* Second character of notation is rank */}
                </div> 
            )}
        </div>
    );
};

export default Square;