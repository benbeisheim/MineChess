import React, { useRef, useState, useEffect } from 'react';
import Square from './Square';
import { Position, PlayerColor, GameState } from '../../types/chess';

// The board dimensions are defined as constants to make the code more maintainable
const BOARD_SIZE = 8;
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse(); // Reversed for traditional chess board layout

interface ChessBoardProps {
    // We'll expand this interface as we add more functionality
    orientation: PlayerColor;
    gameState: GameState;
    onSquareClick: (position: Position) => void;
    maxSize?: number;
    padding?: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
    orientation,
    gameState,
    onSquareClick,
    maxSize = 1000,
    padding = 16 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState(64);

    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;
            
            // Get container dimensions
            const container = containerRef.current.parentElement;
            if (!container) return;
            
            const containerWidth = container.clientWidth - (padding * 2);
            const containerHeight = container.clientHeight - (padding * 2);
            
            // Calculate the largest possible square size that fits
            const maxSquareWidth = containerWidth / 8;  // 8 squares 
            const maxSquareHeight = containerHeight / 8;
            
            // Use the smaller dimension to maintain square aspect ratio
            let newSize = Math.floor(Math.min(maxSquareWidth, maxSquareHeight));
            
            // Ensure we never set a negative or too small size
            newSize = Math.max(newSize, 20); // Minimum square size of 20px
            
            // Apply maximum size constraint
            newSize = Math.min(newSize, Math.floor(maxSize / 9));
            
            console.log('Calculated dimensions:', {
                containerWidth,
                containerHeight,
                maxSquareWidth,
                maxSquareHeight,
                newSize
            });
            
            setSquareSize(newSize);
        };
    
        // Initial size calculation
        requestAnimationFrame(updateSize);
        
        // Set up resize observer
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateSize);
        });
        
        if (containerRef.current?.parentElement) {
            resizeObserver.observe(containerRef.current.parentElement);
        }
        
        return () => resizeObserver.disconnect();
    }, [maxSize, padding]);

    const { boardState, toMove, selectedSquare, legalMoves } = gameState;
    
    // Function to determine if a square should be light or dark
    const isLightSquare = (x: number, y: number): boolean => {
        return (x + y) % 2 === 0;
    };

    // Function to create a coordinate notation for a square
    const getSquareNotation = (position: Position): string => {
        const files =  FILES;
        const ranks = RANKS;
        return orientation === 'white' ? `${files[position.x]}${ranks[position.y]}` : `${files[7 - position.x]}${ranks[7 - position.y]}`;
    };

    const isSquareHighlighted = (pos: Position): boolean => {
        return legalMoves.some(move => move.x === pos.x && move.y === pos.y);
    };


    const renderBoard = () => {
        // Create arrays of indices based on orientation
        const rankIndices = orientation === 'white' 
            ? Array.from({ length: BOARD_SIZE }, (_, i) => i)
            : Array.from({ length: BOARD_SIZE }, (_, i) => BOARD_SIZE - 1 - i);
        
        const fileIndices = orientation === 'white'
            ? Array.from({ length: BOARD_SIZE }, (_, i) => i)
            : Array.from({ length: BOARD_SIZE }, (_, i) => BOARD_SIZE - 1 - i);
    
        return rankIndices.map(rankIndex => (
            <div key={rankIndex} className="flex flex-row items-center">
                <div className="inline-flex flex-row gap-0">
                    {fileIndices.map(fileIndex => {
                        // Now the position always correctly maps to boardState
                        const position = { x: fileIndex, y: rankIndex };
                        return renderSquare(position);
                    })}
                </div>
            </div>
        ));
    };
    
    // Simplified renderSquare function - no need for coordinate transformation
    const renderSquare = (position: Position) => {
        const piece = boardState.board[position.y][position.x];
        const isSelected = selectedSquare?.x === position.x && selectedSquare?.y === position.y;
        
        return (
            <Square 
                key={`${position.x}-${position.y}`}
                position={position}
                piece={piece}
                isLight={isLightSquare(position.x, position.y)}
                isHighlighted={isSquareHighlighted(position)}
                isSelected={isSelected}
                notation={getSquareNotation(position)}
                squareSize={squareSize}
                orientation={orientation}
                onSquareClick={() => onSquareClick(position)}
            />
        );
    };

    return (
        <div ref={containerRef} className="inline-flex w-full h-full bg-slate-100 rounded-lg shadow-lg p-4 items-center justify-center">
            <div className="inline-flex flex-col">
                <div className="inline-flex flex-row justify-center items-center">
                    <p className="text-2xl font-bold border-l-amber-950">{toMove}</p>
                </div>
                <div className="inline-flex flex-col">
                    {renderBoard()}
                </div>
            </div>
        </div>
    );
};

export default ChessBoard;