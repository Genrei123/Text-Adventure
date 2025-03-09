import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../config/axiosConfig';
import Sidebar from '../components/Sidebar';
import GameHeader from '../components/GameHeader';
import ActionButton from './components/ActionButton';
import { motion } from "framer-motion";

interface GameDetails {
  title: string;
  description: string;
  primary_color?: string;
  image_data?: string;
}

const GameScreen: React.FC = () => {
  const { id: gameId } = useParams();
  const [userId, setUserId] = useState<number | null>(null);
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showScroll, setShowScroll] = useState(false);
  const [selectedAction, setSelectedAction] = useState('Say');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{
    content: string;
    isUser: boolean;
    timestamp: string;
    image_url?: string;
  }>>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  // Fetch userId from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.id) {
          setUserId(parsedData.id);
        }
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
      }
    }
  }, []);

  // Fetch game details and chat messages
  useEffect(() => {
    if (!userId || !gameId) return;

    const fetchGameDetails = async () => {
      try {
        const response = await axiosInstance.get(`/game/${gameId}`);
        setGameDetails({
          title: response.data.title,
          description: response.data.description,
          primary_color: response.data.primary_color,
          image_data: response.data.image_data,
        });
      } catch (error) {
        console.error('Error fetching game details:', error);
        setError('Failed to load game details.');
      }
    };

    const fetchChatMessages = async () => {
      try {
        const response = await axiosInstance.post('/ai/get-chat', {
          userId,
          gameId: parseInt(gameId, 10),
        });
        const formattedMessages = response.data.map((msg: any) => ({
          content: msg.content,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.createdAt).toLocaleTimeString(),
          image_url: msg.image_url || undefined,
        }));
        console.log('Fetched chat messages:', formattedMessages);
        setChatMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchGameDetails();
    fetchChatMessages();
  }, [userId, gameId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Door animation setup
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const backgroundVariants = {
    normal: { filter: "blur(50px)" },
    blurred: { filter: "blur(60px)", transition: { duration: 1.5, ease: "easeInOut" } },
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!message.trim()) {
      setError('Message cannot be empty.');
      return;
    }

    if (!userId || !gameId) {
      setError('User ID or Game ID not found. Please log in again.');
      return;
    }

    const payload = { userId, gameId: parseInt(gameId, 10), message, action: selectedAction };
    setMessage('');

    try {
      const displayMessage = `[${selectedAction}] ${message}`;
      const tempUserMessage = { content: displayMessage, isUser: true, timestamp: new Date().toLocaleTimeString() };
      setChatMessages(prev => [...prev, tempUserMessage]);

      const response = await axiosInstance.post('/ai/chat', payload);
      const aiResponse = {
        content: response.data.ai_response.content || "This is a simulated AI response.",
        isUser: false,
        timestamp: response.data.ai_response.createdAt
          ? new Date(response.data.ai_response.createdAt).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
        image_url: response.data.ai_response.image_url,
      };

      if (response.data.user_message && response.data.user_message.createdAt) {
        setChatMessages(prev => {
          const updatedMessages = prev.slice(0, -1);
          return [
            ...updatedMessages,
            {
              content: `[${selectedAction}] ${response.data.user_message.content}`,
              isUser: true,
              timestamp: new Date(response.data.user_message.createdAt).toLocaleTimeString(),
              image_url: response.data.user_message.image_url,
            },
            aiResponse,
          ];
        });
      } else {
        setChatMessages(prev => [...prev.slice(0, -1), tempUserMessage, aiResponse]);
      }

      setSuccess('Message sent successfully!');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const getContextFromMessages = (): string => {
    const recentMessages = chatMessages.slice(-5);
    const cleanedContents = recentMessages.map(msg => msg.content.replace(/^\[(Say|Do|See)\]\s+/i, ''));
    return cleanedContents.length === 0 && gameDetails?.description
      ? `Generate an image based on this game description: ${gameDetails.description}`
      : `Generate an image of the current scene in the story: ${cleanedContents.join(". ")}`;
  };

  const handleGenerateImage = async () => {
    if (!userId || !gameId) {
      setError('User ID or Game ID not found. Please log in again.');
      return;
    }

    setError('');
    setSuccess('');
    setIsGeneratingImage(true);

    try {
      const contextMessage = getContextFromMessages();
      const imagePrompt = contextMessage.substring(0, 997) + (contextMessage.length > 1000 ? "..." : "");
      const userPromptMessage = { content: `[Generate Image] Visualizing the current scene...`, isUser: true, timestamp: new Date().toLocaleTimeString() };
      setChatMessages(prev => [...prev, userPromptMessage]);

      const generatingMessage = { content: "Generating image of the current scene...", isUser: false, timestamp: new Date().toLocaleTimeString() };
      setChatMessages(prev => [...prev, generatingMessage]);

      const response = await axiosInstance.post('/openai/generate-image', { prompt: imagePrompt, userId, gameId: parseInt(gameId, 10) });
      setChatMessages(prev => prev.slice(0, -1));

      const image_url = response.data.imageUrl || "test";
      await axiosInstance.post('/ai/store-image', {
        userId,
        gameId: parseInt(gameId, 10),
        content: "Scene visualized:",
        image_url: image_url,
        role: 'assistant',
      });

      const imageResponse = { content: "Scene visualized:", isUser: false, timestamp: new Date().toLocaleTimeString(), image_url };
      setChatMessages(prev => [...prev, imageResponse]);
      setSuccess('Scene visualized successfully!');
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Image generation failed. Please try again.');
      setChatMessages(prev => [...prev.slice(0, -1), { content: "Failed to visualize the scene. Please try again.", isUser: false, timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <>
      {isAnimating && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
          <motion.div className="absolute top-0 left-0 w-1/2 h-full bg-black" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} exit={{ scaleX: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ transformOrigin: "left" }} />
          <motion.div className="absolute top-0 right-0 w-1/2 h-full bg-black" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} exit={{ scaleX: 1 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ transformOrigin: "right" }} />
        </div>
      )}

      <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col relative">
        <motion.div className="absolute inset-0" variants={backgroundVariants} initial="normal">
          <img src="./UserBG.svg" alt="Background" className="w-full h-full object-cover" />
        </motion.div>

        <div className="relative z-10">
          <div className="z-50">
            <GameHeader title={gameDetails?.title} />
            <Sidebar />
          </div>
          <br /><br /><br />
        </div>

        <div className="flex-grow flex justify-center items-start mt-[-5%] pt-4">
          <div ref={chatContainerRef} className="w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto h-[calc(100vh-200px)] scrollbar-hide bg-[#1E1E1E]/50 backdrop-blur-sm text-white" style={{ scrollbarColor: '#634630 #1E1E1E' }}>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                <p className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-[#311F17] text-white' : 'bg-[#634630] text-[#E5D4B3]'}`}>
                  {msg.content}
                </p>
                {msg.image_url && (
                  <div className={`mt-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                    <img src={`${import.meta.env.VITE_BACKEND_URL}` + msg.image_url} alt="Generated" className="max-w-full h-auto rounded-lg inline-block" />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 mx-auto mt-[0%] flex flex-col items-center md:items-start space-y-4 fixed bottom-0 md:relative md:bottom-auto bg-[#1E1E1E] md:bg-transparent p-4 md:p-0">
            <div className="flex space-x-4 w-full justify-center md:justify-start mb-2">
            <ActionButton action="Do" isSelected={selectedAction === "Do"} onClick={() => setSelectedAction("Do")} />
            <ActionButton action="Say" isSelected={selectedAction === "Say"} onClick={() => setSelectedAction("Say")} />
            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-full font-playfair text-xs md:text-base ${isGeneratingImage ? 'bg-[#634630]/50 text-gray-400 cursor-not-allowed' : `bg-[${gameDetails?.primary_color || '#634630'}] text-white hover:bg-[#311F17] transition-colors`}`}
            >
              {isGeneratingImage ? 'Generating...' : 'Visualize Scene'}
            </button>
            <button
              onClick={() => setShowDescription(!showDescription)}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-full font-playfair text-xs md:text-base bg-[${gameDetails?.primary_color || '#634630'}] text-white hover:bg-[#311F17] transition-colors`}
            >
              {showDescription ? 'Hide Description' : 'Show Description'}
            </button>

            <button
              onClick={() => alert('End Story')}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-full font-playfair text-xs md:text-base bg-[${gameDetails?.primary_color || '#634630'}] text-red hover:bg-[#8E1616] transition-colors`}
            >
              End Story
            </button>
            </div>

          <div className="w-full flex items-start bg-[#311F17] rounded-2xl focus-within:outline-none">
            <textarea
              ref={textareaRef}
              className={`w-full p-4 rounded-l-2xl bg-transparent text-white font-playfair text-xl focus:outline-none resize-none min-h-[56px] max-h-48 ${showScroll ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-[#634630] scrollbar-track-transparent' : 'overflow-y-hidden'}`}
              placeholder={`Type what you want to ${selectedAction.toLowerCase()}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ minHeight: '56px', height: `${Math.min(message.split('\n').length * 24 + 32, 192)}px` }}
            />
            <button className="p-4 bg-transparent rounded-r-2xl relative group self-start" onClick={handleSubmit}>
              <img src="/Enter.svg" alt="Enter" className="h-6 group-hover:opacity-0" />
              <img src="/Enter-after.svg" alt="Enter Hover" className="h-6 absolute top-4 left-4 opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>

        {showDescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Game Description</h2>
              <p className="text-sm italic" style={{ color: gameDetails?.primary_color || '#E5D4B3' }}>
                {gameDetails?.description}
              </p>
              <button
                onClick={() => setShowDescription(false)}
                className="mt-4 px-4 py-2 rounded-full font-playfair bg-[#634630] text-white hover:bg-[#311F17] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GameScreen;