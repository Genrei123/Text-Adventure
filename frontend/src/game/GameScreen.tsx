import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../config/axiosConfig';
import Sidebar from '../components/Sidebar';
import GameHeader from '../components/GameHeader';
import ActionButton from './components/ActionButton';
import { motion, AnimatePresence } from "framer-motion";
import Homepage from '../home/Homepage';

const GameScreen: React.FC = () => {
    const { id: gameId } = useParams();
    const [userId, setUserId] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showScroll, setShowScroll] = useState(false);
    const [selectedAction, setSelectedAction] = useState('Say'); // Default action is 'Say'
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chatMessages, setChatMessages] = useState<Array<{ content: string, isUser: boolean, timestamp: string }>>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isAnimating, setIsAnimating] = useState(true);

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

    useEffect(() => {
        if (!userId || !gameId) return;

        const fetchChatMessages = async () => {
            try {
                const response = await axiosInstance.post('/ai/get-chat', {
                    userId,
                    gameId: parseInt(gameId, 10)
                });
                const formattedMessages = response.data.map((msg: any) => ({
                    content: msg.content,
                    isUser: msg.role === 'user',
                    timestamp: new Date(msg.createdAt).toLocaleTimeString()
                }));
                setChatMessages(formattedMessages);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };

        fetchChatMessages();
    }, [userId, gameId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; // Scroll to bottom
        }
    }, [chatMessages]);

    // Game Over animation setup
    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(false), 5000);
        const gameOverTimer = setTimeout(() => setIsGameOver(true), 6000);
        return () => {
            clearTimeout(timer);
            clearTimeout(gameOverTimer);
        };
    }, []);

    // Animation variants
    const gameOverVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.5
            }
        }
    };

    const backgroundVariants = {
        normal: {
            filter: "blur(50px)"
        },
        blurred: {
            filter: "blur(60px)",
            transition: {
                duration: 1.5,
                ease: "easeInOut"
            }
        }
    };

    const glowVariants = {
        visible: {
            textShadow: [
                "0 0 5px #ff0000",
                "0 0 10px #ff0000",
                "0 0 20px #ff0000",
                "0 0 10px #ff0000",
                "0 0 5px #ff0000"
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
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

        // Include the selected action in the payload
        const payload = {
            userId,
            gameId: parseInt(gameId, 10),
            message,
            action: selectedAction // Add the selected action to the payload
        };

        setMessage(''); // Clear message input

        try {
            // Format message with action prefix for display
            const displayMessage = `[${selectedAction}] ${message}`;
            
            // Temporarily show user's message with current time
            const tempUserMessage = {
                content: displayMessage,
                isUser: true,
                timestamp: new Date().toLocaleTimeString()
            };
            setChatMessages(prevMessages => [...prevMessages, tempUserMessage]); // Append to bottom

            const response = await axiosInstance.post('/ai/chat', payload);

            const aiResponse = {
                content: response.data.ai_response.content || "This is a simulated AI response.",
                isUser: false,
                timestamp: response.data.ai_response.createdAt
                    ? new Date(response.data.ai_response.createdAt).toLocaleTimeString()
                    : new Date().toLocaleTimeString()
            };

            // Replace temp user message with backend data if available
            if (response.data.user_message && response.data.user_message.createdAt) {
                setChatMessages(prevMessages => {
                    const updatedMessages = prevMessages.slice(0, -1); // Remove temp message
                    return [
                        ...updatedMessages,
                        {
                            content: `[${selectedAction}] ${response.data.user_message.content}`,
                            isUser: true,
                            timestamp: new Date(response.data.user_message.createdAt).toLocaleTimeString()
                        },
                        {
                            content: response.data.ai_response.content,
                            isUser: false,
                            timestamp: new Date(response.data.ai_response.createdAt).toLocaleTimeString()
                        }
                    ];
                });
            } else {
                setChatMessages(prevMessages => [...prevMessages.slice(0, -1), tempUserMessage, aiResponse]);
            }

            setSuccess('Message sent successfully!');
        } catch (err) {
            console.error('Error sending message:', err);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <>
            {/* Door animation for gamescreen */}
            {isAnimating && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
                    <motion.div
                        className="absolute top-0 left-0 w-1/2 h-full bg-black"
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        exit={{ scaleX: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        style={{ transformOrigin: "left" }}
                    />
                    <motion.div
                        className="absolute top-0 right-0 w-1/2 h-full bg-black"
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        exit={{ scaleX: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        style={{ transformOrigin: "right" }}
                    />
                </div>
            )}

            <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col relative">
                {/* Background with blur animation */}
                <motion.div 
                    className="absolute inset-0"
                    variants={backgroundVariants}
                    initial="normal"
                    animate={isGameOver ? "blurred" : "normal"}
                >
                    {/* put the code for fetching story background here */}
                    <img src="/warhammer.jpg" alt="Background" className="w-full h-full object-cover" />
                </motion.div>

                {/* Game Over Overlay */}
                <AnimatePresence>
                    {isGameOver && (
                        <motion.div
                            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 pointer-events-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="p-8 rounded-lg flex flex-col items-center"
                                variants={gameOverVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.h1
                                    className="text-4xl md:text-6xl font-bold text-red-600 tracking-wider font-cinzel"
                                    variants={glowVariants}
                                    animate="visible"
                                >
                                    GAME OVER
                                </motion.h1>

                                {/* Add buttons below the GAME OVER text */}
                                <div className="flex space-x-4 mt-8">
                                    {/* Return to Home Button */}
                                    <motion.button
                                        className="px-6 py-3 bg-[#311F17] text-[#E5D4B3] rounded-lg font-playfair text-lg border border-[#634630] focus:outline-none"
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor: "#634630",
                                            borderColor: "#E5D4B3",
                                            transition: { duration: 0.3, ease: "easeInOut" },
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.href = '/home'} // Redirect to /home
                                    >
                                        Return to Home
                                    </motion.button>

                                    {/* View Summary Button */}
                                    <motion.button
                                        className="px-6 py-3 bg-[#311F17] text-[#E5D4B3] rounded-lg font-playfair text-lg border border-[#634630] focus:outline-none"
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor: "#634630",
                                            borderColor: "#E5D4B3",
                                            transition: { duration: 0.3, ease: "easeInOut" },
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => console.log("View Summary clicked")} // Replace with actual logic
                                    >
                                        View Summary
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main content */}
                <div className="relative z-10">
                    <div className="z-50">
                        <GameHeader/>
                        <Sidebar/>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <div className="flex-grow flex justify-center items-start mt-[-5%] pt-4">
                    <div 
                        ref={chatContainerRef}
                        className="w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto h-[calc(100vh-200px)] scrollbar-hide bg-[#1E1E1E]/50 backdrop-blur-sm text-white"
                        style={{ scrollbarColor: '#634630 #1E1E1E' }}
                    >
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                                <p className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-[#311F17] text-white' : 'bg-[#634630] text-[#E5D4B3]'}`}>
                                    {msg.content}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2 mx-auto mt-[0%] flex flex-col items-center md:items-start space-y-4 fixed bottom-0 md:relative md:bottom-auto bg-[#1E1E1E] md:bg-transparent p-4 md:p-0">
                    {/* Action buttons row */}
                    <div className="flex space-x-4 w-full justify-center md:justify-start mb-2">
                        <ActionButton 
                            action="Do" 
                            isSelected={selectedAction === "Do"} 
                            onClick={() => setSelectedAction("Do")} 
                        />
                        <ActionButton 
                            action="Say" 
                            isSelected={selectedAction === "Say"} 
                            onClick={() => setSelectedAction("Say")} 
                        />
                        <ActionButton 
                            action="See" 
                            isSelected={selectedAction === "See"} 
                            onClick={() => setSelectedAction("See")} 
                        />
                    </div>
                    
                    <div className="w-full flex items-start bg-[#311F17] rounded-2xl focus-within:outline-none">
                        <textarea
                            ref={textareaRef}
                            className={`w-full p-4 rounded-l-2xl bg-transparent text-white font-playfair text-xl focus:outline-none resize-none min-h-[56px] max-h-48 ${
                                showScroll ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-[#634630] scrollbar-track-transparent' : 'overflow-y-hidden'
                            }`}
                            placeholder={`Type what you want to ${selectedAction.toLowerCase()}...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            style={{
                                minHeight: '56px',
                                height: `${Math.min(message.split('\n').length * 24 + 32, 192)}px`
                            }}
                        />
                        <button className="p-4 bg-transparent rounded-r-2xl relative group self-start" onClick={handleSubmit}>
                            <img src="/Enter.svg" alt="Enter" className="h-6 group-hover:opacity-0" />
                            <img src="/Enter-after.svg" alt="Enter Hover" className="h-6 absolute top-4 left-4 opacity-0 group-hover:opacity-100" />
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                </div>
            </div>
        </>
    );
};

export default GameScreen;