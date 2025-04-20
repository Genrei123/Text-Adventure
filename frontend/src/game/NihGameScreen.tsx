import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../config/axiosConfig';
import Sidebar from '../components/Sidebar';
import GameHeader from '../components/GameHeader';
import ActionButton from './components/ActionButton';

// Define interfaces
interface Item {
  id: string;
  name: string;
  description: string;
  usableOn: string[];
}

interface Location {
  id: string;
  name: string;
  description: string;
  exits: Record<string, string>;
}

interface GameState {
  locationId: string;
  locationDetails: Location;
  inventory: Item[];
  moveCount?: number;
  movesLeft?: number;
  gameCompleted?: boolean;
}

interface GameMessage {
  content: string;
  isUser: boolean;
  timestamp: string;
}

const NihGameScreen: React.FC = () => {
  const { id: gameId } = useParams();
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [gameMessages, setGameMessages] = useState<GameMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [hasTypedInput, setHasTypedInput] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [gameSummary, setGameSummary] = useState('');
  const [moveCount, setMoveCount] = useState(0);
  const [movesLeft, setMovesLeft] = useState(30);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.id) {
          setPlayerId(parsedData.id);
        }
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!playerId || !gameId) return;

    // Start a new game when component mounts
    startNewGame();
    
    // Fetch inventory to ensure it's properly initialized
    fetchInventory();
  }, [playerId, gameId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [gameMessages]);

  // Add function to fetch inventory
  const fetchInventory = async () => {
    try {
      if (!playerId || !gameId) return;
      
      const response = await axiosInstance.get(`/nih/game/${gameId}/player/${playerId}/inventory`);
      const { inventory } = response.data;
      
      if (gameState) {
        setGameState({
          ...gameState,
          inventory: inventory || []
        });
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // New function to start a new game
  const startNewGame = async () => {
    try {
      if (!playerId || !gameId) return;
      
      const response = await axiosInstance.post(`/nih/game/${gameId}/player/${playerId}/start-new-game`);
      const { location, narration, moveCount: newMoveCount } = response.data;
      
      setGameState({ 
        locationId: location.id, 
        locationDetails: location, 
        inventory: [], // Will be updated by fetchInventory
        moveCount: newMoveCount || 0,
        movesLeft: 30 - (newMoveCount || 0),
        gameCompleted: false
      });
      
      setMoveCount(newMoveCount || 0);
      setMovesLeft(30 - (newMoveCount || 0));
      setGameMessages([{
        content: narration.content,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      
      // Reset other state variables
      setShowSummaryModal(false);
      setGameSummary('');
      setError('');
      setSuccess('');
      
      // Fetch inventory immediately after starting new game
      fetchInventory();
    } catch (error) {
      console.error('Error starting new game:', error);
      setError('Failed to start new game.');
    }
  };

  // New function to end game early
  const endGameEarly = async () => {
    try {
      if (!playerId || !gameId) {
        setError('Player ID or Game ID not found. Please log in again.');
        return;
      }

      const userMessage = {
        content: `[End Game] Ending game early`,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setGameMessages((prev) => [...prev, userMessage]);

      const response = await axiosInstance.post(`/nih/game/${gameId}/player/${playerId}/end-game-early`);
      const { summary, moveCount: finalMoveCount } = response.data;
      
      setMoveCount(finalMoveCount);
      setMovesLeft(0);
      setGameSummary(summary);
      setShowSummaryModal(true);
      
      if (gameState) {
        setGameState({
          ...gameState,
          moveCount: finalMoveCount,
          movesLeft: 0,
          gameCompleted: true
        });
      }
      
      setGameMessages((prev) => [
        ...prev,
        { 
          content: `Game ended after ${finalMoveCount} moves.`, 
          isUser: false, 
          timestamp: new Date().toLocaleTimeString() 
        }
      ]);
      
    } catch (err: any) {
      console.error(`Error ending game:`, err);
      setError(err.response?.data?.message || `Failed to end game.`);
    }
  };

  const handleAction = async (action: string, option?: string) => {
    setError('');
    setSuccess('');

    if (!playerId || !gameId) {
      setError('Player ID or Game ID not found. Please log in again.');
      return;
    }

    // If game is completed, prevent actions
    if (gameState?.gameCompleted) {
      setError('Game is over. Start a new game to continue playing.');
      return;
    }

    const userMessage = {
      content: `[${action}] ${option || action}`,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setGameMessages((prev) => [...prev, userMessage]);

    try {
      if (action === 'Move' && option) {
        const response = await axiosInstance.post(`/nih/game/${gameId}/player/${playerId}/change-location`, {
          direction: option.toLowerCase(),
        });
        const { location, narration, moveCount: newMoveCount, movesLeft: newMovesLeft, gameCompleted, gameSummary } = response.data;
        
        setMoveCount(newMoveCount);
        setMovesLeft(newMovesLeft);
        
        setGameState((prev) => prev ? { 
          ...prev, 
          locationId: location.id, 
          locationDetails: location,
          moveCount: newMoveCount,
          movesLeft: newMovesLeft,
          gameCompleted: gameCompleted || false
        } : null);
        
        setGameMessages((prev) => [
          ...prev,
          { content: narration.content, isUser: false, timestamp: new Date().toLocaleTimeString() },
        ]);
        
        // Check if game is completed and show summary modal
        if (gameCompleted && gameSummary) {
          setGameSummary(gameSummary);
          setShowSummaryModal(true);
        }
        
        // Fetch inventory after move to ensure it's up to date
        fetchInventory();
      } else if (action === 'Use' && option) {
        const item = gameState?.inventory.find((i) => i.name === option);
        if (!item) {
          throw new Error('Item not found in inventory.');
        }
        const response = await axiosInstance.post(`/nih/game/${gameId}/player/${playerId}/use-item`, {
          itemId: item.id,
          target: item.usableOn[0] || 'default',
        });
        const { inventory, narration, moveCount: newMoveCount, movesLeft: newMovesLeft, gameCompleted, gameSummary } = response.data;
        
        setMoveCount(newMoveCount);
        setMovesLeft(newMovesLeft);
        
        setGameState((prev) => prev ? { 
          ...prev, 
          inventory,
          moveCount: newMoveCount,
          movesLeft: newMovesLeft,
          gameCompleted: gameCompleted || false
        } : null);
        
        setGameMessages((prev) => [
          ...prev,
          { content: narration.content, isUser: false, timestamp: new Date().toLocaleTimeString() },
        ]);
        
        // Check if game is completed and show summary modal
        if (gameCompleted && gameSummary) {
          setGameSummary(gameSummary);
          setShowSummaryModal(true);
        }
      } else if (action === 'Look') {
        const response = await axiosInstance.get(`/nih/game/${gameId}/player/${playerId}/state`);
        const { locationDetails, inventory, moveCount: newMoveCount, movesLeft: newMovesLeft } = response.data.state;
        
        setMoveCount(newMoveCount || moveCount);
        setMovesLeft(newMovesLeft || movesLeft);
        
        // Update inventory in state
        if (gameState) {
          setGameState({
            ...gameState,
            inventory: inventory || gameState.inventory
          });
        }
        
        const content = `You look around ${locationDetails.name}: ${locationDetails.description}. Exits: ${Object.keys(locationDetails.exits).join(', ')}. Inventory: ${inventory.map((i: Item) => i.name).join(', ') || 'empty'}. Moves made: ${newMoveCount}, Moves left: ${newMovesLeft}.`;
        
        setGameMessages((prev) => [
          ...prev,
          { content, isUser: false, timestamp: new Date().toLocaleTimeString() },
        ]);
      } else if (action === 'StartNew') {
        await startNewGame();
        setSuccess('New game started!');
      } else if (action === 'EndGame') {
        await endGameEarly();
      } else if (action === 'Exit') {
        // Keep the original Exit logic
        if (gameState?.locationId === 'real_world') {
          setGameMessages((prev) => [
            ...prev,
            { content: "You've escaped to the real world. Game Over!", isUser: false, timestamp: new Date().toLocaleTimeString() },
          ]);
        } else {
          throw new Error('You can only exit from the Real World!');
        }
      }

      setSuccess(`${action} action performed successfully!`);
    } catch (err: any) {
      console.error(`Error performing ${action}:`, err);
      setError(err.response?.data?.message || `Failed to perform ${action.toLowerCase()}.`);
    }

    setSelectedAction(null);
  };

  // Updated to use the chat API endpoint
  const handleChatSubmit = async () => {
    if (chatInput.trim() === '' || !playerId || !gameId) return;

    if (!hasTypedInput) {
      setHasTypedInput(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false); // Hide the popup after 2.5 seconds
      }, 2500);
    }

    const messageText = chatInput.trim();
    
    // Add user message to chat display immediately
    const userMessage = {
      content: messageText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setGameMessages((prev) => [...prev, userMessage]);
    setChatInput(''); // Clear input field

    try {
      // Call the chat API endpoint
      const response = await axiosInstance.post('/ai/chat', {
        userId: playerId,
        gameId: gameId,
        message: messageText
      });

      // Add AI response to chat display
      const aiMessage = {
        content: response.data.ai_response.content,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setGameMessages((prev) => [...prev, aiMessage]);
      
      // Fetch inventory after chat to ensure it's up to date
      // (in case AI response affects the game state)
      fetchInventory();
      
    } catch (err: any) {
      console.error('Error sending chat message:', err);
      setError(err.response?.data?.message || 'Failed to send message.');
    }
  };

  // JSX for Summary Modal
  const SummaryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#311F17] text-[#E5D4B3] p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Adventure Summary</h2>
        <div className="mb-4">
          <p className="mb-2 z-999">Moves made: {moveCount} / 30</p>
          <p className="mb-4">Game completed!</p>
          <div className="border-t border-[#634630] pt-4">
            <h3 className="text-xl mb-2">Your Story:</h3>
            <p className="whitespace-pre-line">{gameSummary}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => {
              setShowSummaryModal(false);
              startNewGame();
            }}
            className="px-4 py-2 bg-[#634630] text-[#E5D4B3] rounded-lg hover:bg-[#311F17] mr-2"
          >
            Start New Game
          </button>
          <button 
            onClick={() => setShowSummaryModal(false)}
            className="px-4 py-2 bg-[#634630] text-[#E5D4B3] rounded-lg hover:bg-[#311F17]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
      <GameHeader />
      <br /><br /><br />

      {/* Move Counter */}
      <div className="w-full md:w-1/2 mx-auto text-center my-2 z-50">
        <div className="bg-[#311F17] text-[#E5D4B3] p-2 rounded-lg inline-block">
          <span className="font-bold">Moves: {moveCount}/30</span> - <span>{movesLeft} moves remaining</span>
        </div>
      </div>

      <div className="flex-grow flex justify-center items-center mt-[-5%]">
        <div
          ref={chatContainerRef}
          className="bg- text-white w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto max-h-[calc(1.5em*30)] scrollbar-hide"
          style={{ scrollbarColor: '#634630 #1E1E1E' }}
        >
          {gameMessages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
              <p className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-[#311F17] text-white' : 'bg-[#634630] text-[#E5D4B3]'}`}>
                {msg.content}
              </p>
              <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>

              {/* Feedback Messages (Error or Success) */}
              {index === gameMessages.length - 1 && (
                <>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  {success && <p className="text-green-500 mt-2">{success}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/2 mx-auto mt-[0%] flex flex-col items-center md:items-start space-y-4 fixed bottom-0 md:relative md:bottom-auto bg-[#1E1E1E] md:bg-transparent p-4 md:p-0">

        {/* Inventory Display */}
        <div className="w-full text-center md:text-left">
          <h3 className="text-lg font-bold">Inventory</h3>
          {gameState?.inventory && gameState.inventory.length > 0 ? (
            <ul className="list-none">
              {gameState.inventory.map((item) => (
                <li key={item.id} className="text-sm">
                  {item.name} - {item.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">Your inventory is empty.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 w-full justify-center md:justify-start mb-4">
          <ActionButton
            action="Navigate"
            isSelected={selectedAction === 'Move'}
            onClick={() => setSelectedAction(selectedAction === 'Move' ? null : 'Move')}
            disabled={gameState?.gameCompleted}
          />
          <ActionButton
            action="Use"
            isSelected={selectedAction === 'Use'}
            onClick={() => setSelectedAction(selectedAction === 'Use' ? null : 'Use')}
            disabled={gameState?.gameCompleted}
          />
          <ActionButton
            action="Check"
            isSelected={selectedAction === 'Look'}
            onClick={() => handleAction('Look')}
            disabled={gameState?.gameCompleted}
          />
          <ActionButton
            action="End Game"
            isSelected={selectedAction === 'EndGame'}
            onClick={() => handleAction('EndGame')}
            disabled={gameState?.gameCompleted}
          />
          <ActionButton
            action="New Game"
            isSelected={selectedAction === 'StartNew'}
            onClick={() => handleAction('StartNew')}
          />
        </div>

        {/* Popup for first-time typed input */}
        {showPopup && (
          <div className="w-full text-center">
            <p className="bg-[#D4A373] text-black font-bold px-4 py-2 rounded-lg shadow-md">
              You're now heading on your own Conclusion
            </p>
          </div>
        )}

        {/* Dynamic Action Options */}
        {selectedAction === 'Move' && gameState?.locationDetails.exits && !gameState?.gameCompleted && (
          <div className="flex space-x-4 w-full justify-center md:justify-start flex-wrap">
            {Object.keys(gameState.locationDetails.exits).map((direction) => (
              <button
                key={direction}
                className="p-2 bg-[#634630] text-[#E5D4B3] rounded-lg hover:bg-[#311F17] m-1"
                onClick={() => handleAction('Move', direction)}
              >
                Go {direction}
              </button>
            ))}
          </div>
        )}

        {selectedAction === 'Use' && gameState?.inventory && gameState.inventory.length > 0 && !gameState?.gameCompleted && (
          <div className="flex space-x-4 w-full justify-center md:justify-start flex-wrap">
            {gameState.inventory.map((item) => (
              <button
                key={item.id}
                className="p-2 bg-[#634630] text-[#E5D4B3] rounded-lg hover:bg-[#311F17] m-1"
                onClick={() => handleAction('Use', item.name)}
              >
                Use {item.name}
              </button>
            ))}
          </div>
        )}

        {/* Chatbox Input */}
        <div className="w-full flex flex-col items-center md:items-start">
          <div className="flex w-full gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleChatSubmit();
              }}
              className="flex-grow p-2 rounded bg-[#2A2A2A] text-white border border-[#634630] focus:outline-none"
              placeholder="Type your message..."
              disabled={gameState?.gameCompleted}
            />
            <button
              onClick={handleChatSubmit}
              className={`px-4 py-2 bg-[#634630] text-[#E5D4B3] rounded hover:bg-[#311F17] ${gameState?.gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={gameState?.gameCompleted}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummaryModal && <SummaryModal />}
    </div>
  );
};

export default NihGameScreen;