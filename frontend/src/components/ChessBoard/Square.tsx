import React from 'react';
import { Position, PieceData, PlayerColor } from '../../types/chess';
import { Piece } from '../Piece/Piece';
import { SquareHighlight } from './SquareHighlight';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';
import PromotionChoice from '../Piece/PromotionChoice';

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
    const promotionSquare = useAppSelector((state: RootState) => state.game.promotionSquare);
    const isPromotionSquare = promotionSquare && promotionSquare.x === position.x && promotionSquare.y === position.y;
    // Make the color classes more specific to ensure they apply
    const baseColor = isLight ? 'bg-amber-100' : 'bg-amber-800';
    
    // Determine if this square should show labels
    const shouldShowFileLabel = orientation === 'white' ? position.y === 7 : position.y === 0;
    const shouldShowRankLabel = orientation === 'white' ? position.x === 0 : position.x === 7;
    
    // Calculate label sizes proportional to square size
    const labelSize = Math.max(squareSize * 0.2, 12); // Min size of 12px
    
    return (
        <div 
            className={`${baseColor}
                       relative flex items-center justify-center`}
            style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`,
            }}
            data-square={notation}
            onClick={onSquareClick}
        >
            {isHighlighted && <SquareHighlight size={squareSize} isPiece={piece !== null} isLight={isLight} />}
            {!isPromotionSquare && piece && (
                <Piece 
                    type={piece.type}
                    color={piece.color}
                    size={squareSize}
                    isSelected={isSelected}
                />
            )}
            {isPromotionSquare && ( <PromotionChoice /> )}
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