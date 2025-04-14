import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../config/axiosConfig'; // Adjust path as needed
import Sidebar from '../components/Sidebar';
import GameHeader from '../components/GameHeader';
import ActionButton from './components/ActionButton'; // Adjust path as needed

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

    const fetchGameState = async () => {
      try {
        const response = await axiosInstance.get(`/nih/game/${gameId}/player/${playerId}/state`);
        const { locationId, locationDetails, inventory } = response.data.state;
        setGameState({ locationId, locationDetails, inventory });
        setGameMessages((prev) => [
          ...prev,
          {
            content: `You are in ${locationDetails.name}: ${locationDetails.description}. Inventory: ${inventory.map((i: Item) => i.name).join(', ') || 'empty'}`,
            isUser: false,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (error) {
        console.error('Error fetching game state:', error);
        setError('Failed to load game state.');
      }
    };

    fetchGameState();
  }, [playerId, gameId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [gameMessages]);

  const handleAction = async (action: string, option?: string) => {
    setError('');
    setSuccess('');

    if (!playerId || !gameId) {
      setError('Player ID or Game ID not found. Please log in again.');
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
        const { location, narration } = response.data;
        setGameState((prev) => prev ? { ...prev, locationId: location.id, locationDetails: location } : null);
        setGameMessages((prev) => [
          ...prev,
          { content: narration, isUser: false, timestamp: new Date().toLocaleTimeString() },
        ]);
      } else if (action === 'Use' && option) {
        const item = gameState?.inventory.find((i) => i.name === option);
        if (!item) {
          throw new Error('Item not found in inventory.');
        }
        const response = await axiosInstance.post(`/nih/game/${gameId}/player/${playerId}/use-item`, {
          itemId: item.id,
          target: item.usableOn[0] || 'default',
        });
        const { inventory, narration } = response.data;
        setGameState((prev) => prev ? { ...prev, inventory } : null);
        setGameMessages((prev) => [
          ...prev,
          { content: narration, isUser: false, timestamp: new Date().toLocaleTimeString() },
        ]);
      } else if (action === 'Look') {
        const response = await axiosInstance.get(`/nih/game/${gameId}/player/${playerId}/state`);
        const { locationDetails, inventory } = response.data.state;
        const content = `You look around ${locationDetails.name}: ${locationDetails.description}. Exits: ${Object.keys(locationDetails.exits).join(', ')}. Inventory: ${inventory.map((i: Item) => i.name).join(', ') || 'empty'}.`;
        setGameMessages((prev) => [
          ...prev,
          { content, isUser: false, timestamp: new Date().toLocaleTimeString() },
        ]);
      } else if (action === 'Exit') {
        if (gameState?.locationId === 'real_world') {
          setGameMessages((prev) => [
            ...prev,
            { content: 'You’ve escaped to the real world. Game Over!', isUser: false, timestamp: new Date().toLocaleTimeString() },
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

  const handleChatSubmit = () => {
    if (chatInput.trim() === '') return;

    if (!hasTypedInput) {
      setHasTypedInput(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false); // Hide the popup after 2.5 seconds
      }, 2500);
    }

    const userMessage = {
      content: chatInput.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setGameMessages((prev) => [...prev, userMessage]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
      <GameHeader />
      <br /><br /><br />

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
          />
          <ActionButton
            action="Use"
            isSelected={selectedAction === 'Use'}
            onClick={() => setSelectedAction(selectedAction === 'Use' ? null : 'Use')}
          />
          <ActionButton
            action="Check"
            isSelected={selectedAction === 'Look'}
            onClick={() => handleAction('Look')}
          />
          <ActionButton
            action="Exit"
            isSelected={selectedAction === 'Exit'}
            onClick={() => handleAction('Exit')}
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
        {selectedAction === 'Move' && gameState?.locationDetails.exits && (
          <div className="flex space-x-4 w-full justify-center md:justify-start flex-wrap">
            {Object.keys(gameState.locationDetails.exits).map((direction) => (
              <button
                key={direction}
                className="p-2 bg-[#634630] text-[#E5D4B3] rounded-lg hover:bg-[#311F17]"
                onClick={() => handleAction('Move', direction)}
              >
                Go {direction}
              </button>
            ))}
          </div>
        )}

        {selectedAction === 'Use' && gameState?.inventory && gameState.inventory.length > 0 && (
          <div className="flex space-x-4 w-full justify-center md:justify-start flex-wrap">
            {gameState.inventory.map((item) => (
              <button
                key={item.id}
                className="p-2 bg-[#634630] text-[#E5D4B3] rounded-lg hover:bg-[#311F17]"
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
            />
            <button
              onClick={handleChatSubmit}
              className="px-4 py-2 bg-[#634630] text-[#E5D4B3] rounded hover:bg-[#311F17]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NihGameScreen;