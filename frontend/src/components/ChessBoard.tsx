import React, { useRef, useState, useEffect } from 'react';
import Square from './Square';
import { Position } from '../types/chess';

// The board dimensions are defined as constants to make the code more maintainable
const BOARD_SIZE = 8;
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse(); // Reversed for traditional chess board layout

interface ChessBoardProps {
    // We'll expand this interface as we add more functionality
    orientation?: string;
    maxSize?: number;
    padding?: number;

}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
    orientation = 'white',
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
            const maxSquareWidth = containerWidth / 9;  // 8 squares + 1 unit for labels
            const maxSquareHeight = containerHeight / 9;
            
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
    // The rest of your ChessBoard component implementation...
    // Function to determine if a square should be light or dark
    const isLightSquare = (x: number, y: number): boolean => {
        return (x + y) % 2 === 0;
    };

    // Function to create a coordinate notation for a square
    const getSquareNotation = (position: Position): string => {
        const files = orientation === 'white' ? FILES : FILES.reverse();
        const ranks = orientation === 'white' ? RANKS : RANKS.reverse();
        return `${files[position.x]}${ranks[position.y]}`;
    };

    // Function to render each square of the board
    const renderSquare = (position: Position) => {
        const squareNotation = getSquareNotation(position);
        
        return (
            <Square 
                key={squareNotation}
                position={position}
                piece={null}
                isLight={isLightSquare(position.x, position.y)}
                isHighlighted={false}
                isSelected={false}
                notation={squareNotation}
                squareSize={squareSize}
                onSquareClick={() => {}}
            />
        );
    };

    // Function to render rank labels (1-8)
    const renderRankLabel = (rankIndex: number) => {
        const labelSize = squareSize * 0.375; // Make label width proportional to square size
        return (
            <div 
                key={rankIndex} 
                style={{
                    width: `${labelSize}px`,
                    height: `${squareSize}px`,
                    color: 'red'
                }}
                className="flex items-center justify-center text-sm"
            >
                {orientation === 'white' ? RANKS[rankIndex] : RANKS[RANKS.length - 1 - rankIndex]}
            </div>
        );
    };

    // Function to render file labels (a-h)
    const renderFileLabel = (fileIndex: number) => {
        const labelSize = squareSize * 0.375; // Make label height proportional to square size
        return (
            <div 
                key={fileIndex} 
                style={{
                    width: `${squareSize}px`,
                    height: `${labelSize}px`,
                    color: 'red'
                }}
                className="flex items-center justify-center text-sm"
            >
                {orientation === 'white' ? FILES[fileIndex] : FILES[FILES.length - 1 - fileIndex]}
            </div>
        );
    };

    const renderBoard = () => {
        return Array.from({ length: BOARD_SIZE }, (_, rankIndex) => (
            // This div represents a row in our chess board
            <div key={rankIndex} className="flex flex-row items-center"> {/* Explicitly set flex-row */}
                {renderRankLabel(rankIndex)}
                {/* This div will contain all squares in the current rank/row */}
                <div className="inline-flex flex-row gap-0"> {/* Explicitly set flex-row to ensure horizontal layout */}
                    {Array.from({ length: BOARD_SIZE }, (_, fileIndex) => 
                        renderSquare({ x: fileIndex, y: rankIndex })
                    )}
                </div>
            </div>
        ));
    };

    return (
        <div ref={containerRef} className="inline-flex w-full h-full bg-slate-100 rounded-lg shadow-lg p-4">
            <div className="inline-flex flex-col">
                {/* Board rows */}
                <div className="inline-flex flex-col">
                    {renderBoard()}
                </div>
                {/* File labels row */}
                <div className="inline-flex flex-row items-center">
                    {Array.from({ length: BOARD_SIZE }, (_, fileIndex) => 
                        renderFileLabel(fileIndex)
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChessBoard;