import React from 'react';
import { getSquareHighlight } from '../../utils/squareHighlights';

interface SquareHighlightProps {
    size: number;
    isPiece: boolean;
    isLight: boolean;
}

export const SquareHighlight: React.FC<SquareHighlightProps> = ({ size, isPiece, isLight }) => {
    const highlight = getSquareHighlight(isLight);
    return (
        <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <img 
                src={highlight} 
                alt="red target highlight"
                className={isPiece ? (isLight ? "w-[100%] h-[100%] " : "w-[80%] h-[80%]") : (isLight ? "w-[40%] h-[40%]" : "w-[30%] h-[30%]")} 
            />
        </div>
    );
};