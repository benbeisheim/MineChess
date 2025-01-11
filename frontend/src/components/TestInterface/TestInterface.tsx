// src/components/TestInterface.tsx
import { useState } from 'react';
import  ChessGame  from '../ChessGame/ChessGame';
import { PlayerColor } from '../../types/chess';
export function TestInterface() {
    const [gameID, setGameID] = useState<string | null>(null);
    const [inputGameID, setInputGameID] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>(''); // For showing operation results
    const [playerColor, setPlayerColor] = useState<PlayerColor>("white");
    async function handleCreateGame() {
        try {
            setStatus('Creating game...');
            // First create the game
            const createResponse = await fetch('http://localhost:3000/api/game/create', {
                method: 'POST',
                credentials: 'include',
            });
    
            if (!createResponse.ok) {
                throw new Error('Failed to create game');
            }
    
            // Let's log the response to see what we're getting
            const createData = await createResponse.json();
            console.log('Create game response:', createData);
    
            // Extract the game ID using the correct property name
            const newGameID = createData.game_id;
            if (!newGameID) {
                throw new Error('No game ID received from server');
            }
    
            setStatus(`Game created with ID: ${newGameID}`);
    
            // Then join it
            const joinResponse = await fetch(`http://localhost:3000/api/game/join/${newGameID}`, {
                method: 'POST',
                credentials: 'include',
            });
    
            if (!joinResponse.ok) {
                throw new Error('Failed to join game');
            }
            const joinData = await joinResponse.json();
            console.log('joinData', joinData);
            setPlayerColor(joinData.color as PlayerColor);
            setStatus('Successfully created and joined game');
            setGameID(newGameID);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setStatus('Operation failed');
            console.error('Error:', err);
        }
    }

    async function handleJoinGame(e: React.FormEvent) {
        e.preventDefault();
        try {
            setStatus('Joining game...');
            const response = await fetch(`http://localhost:3000/api/game/join/${inputGameID}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to join game');
            }
            const joinData = await response.json();
            console.log('joinData', joinData);
            setPlayerColor(joinData.color as PlayerColor);
            setStatus('Successfully joined game');
            setGameID(inputGameID);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setStatus('Operation failed');
            console.error('Error:', err);
        }
    }

    // If we're in a game, show the chess board
    if (gameID) {
        return (
            <div>
                <div className="mb-4 p-4 bg-gray-100">
                    <h2>Game ID: {gameID}</h2>
                    <button 
                        onClick={() => setGameID(null)} 
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Leave Game
                    </button>
                </div>
                <ChessGame gameId={gameID} playerColor={playerColor} />
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Chess Game Test Interface</h1>
            
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}
            
            {status && (
                <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
                    Status: {status}
                </div>
            )}

            <div className="mb-8">
                <button 
                    onClick={handleCreateGame}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Create New Game
                </button>
            </div>

            <div>
                <h2 className="text-xl mb-2">Join Existing Game</h2>
                <form onSubmit={handleJoinGame} className="space-y-4">
                    <input
                        type="text"
                        value={inputGameID}
                        onChange={(e) => setInputGameID(e.target.value)}
                        placeholder="Enter Game ID"
                        className="px-4 py-2 border rounded"
                    />
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Join Game
                    </button>
                </form>
            </div>
        </div>
    );
}