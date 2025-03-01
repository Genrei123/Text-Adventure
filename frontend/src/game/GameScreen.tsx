import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import GameHeader from '../components/GameHeader';
import { motion, AnimatePresence } from "framer-motion";
import Homepage from '../home/Homepage';

const GameScreen: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [chatMessages, setChatMessages] = useState<Array<{content: string, isUser: boolean, timestamp: string}>>([]);
    const [isGameOver, setIsGameOver] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!message.trim()) {
            setError('Message cannot be empty.');
            return;
        }

        const payload = {
            session_id: 'abc123',
            model: 'gpt-4',
            role: 'user',
            content: message,
            GameId: 1,
            UserId: 70,
        };

        console.log('Payload:', payload);

        try {
            const newUserMessage = {
                content: message,
                isUser: true,
                timestamp: new Date().toLocaleTimeString()
            };
            setChatMessages(prevMessages => [...prevMessages, newUserMessage]);

            setTimeout(() => {
                const aiResponse = {
                    content: "This is a simulated AI response.",
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString()
                };
                setChatMessages(prevMessages => [...prevMessages, aiResponse]);
            }, 1000);

            setSuccess('Message sent successfully!');
            setMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(false), 5000);
        const gameOverTimer = setTimeout(() => setIsGameOver(true), 6000);
        return () => {
            clearTimeout(timer);
            clearTimeout(gameOverTimer);
        };
    }, []);
    // animation effects here
    // Game Over animation variants
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

    // Background blur variants
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
    // Testing Glowing text
    // Glowing text animation
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
                {/* gameoverscreen starts here */}
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
                {/* gameoverscreen end here */}

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
                    <div className="flex space-x-2">
                        <button className="p-2 text-white rounded relative group">
                            <img src="/Settings.svg" alt="Icon" className="w-6 h-6 group-hover:opacity-0" />
                            <img src="/Settings-After.svg" alt="Icon Hover" className="w-6 h-6 absolute top-2 left-2 opacity-0 group-hover:opacity-100" />
                        </button>
                        <button className="p-2 text-white rounded flex items-center space-x-2 bg-transparent group hover:bg-[#311F17] transition duration-300 text-sm md:text-base relative">
                            <img src="/Story.svg" alt="Icon 2" className="w-5 h-5 md:w-6 md:h-6 group-hover:opacity-0" />
                            <img src="/Story-after.svg" alt="Icon 2 Hover" className="w-5 h-5 md:w-6 md:h-6 absolute top-2 left-0 opacity-0 group-hover:opacity-100" />
                            <span>Story</span>
                        </button>
                        <button className="p-2 text-white rounded flex items-center space-x-2 bg-transparent group hover:bg-[#311F17] transition duration-300 text-sm md:text-base relative">
                            <img src="/Do.svg" alt="Icon 3" className="w-5 h-5 md:w-6 md:h-6 group-hover:opacity-0" />
                            <img src="/Do-after.svg" alt="Icon 3 Hover" className="w-5 h-5 md:w-6 md:h-6 absolute top-2 left-0 opacity-0 group-hover:opacity-100" />
                            <span>Do</span>
                        </button>
                        <button className="p-2 text-white rounded flex items-center space-x-2 bg-transparent group hover:bg-[#311F17] transition duration-300 text-sm md:text-base relative">
                            <img src="/Say.svg" alt="Icon 4" className="w-5 h-5 md:w-6 md:h-6 group-hover:opacity-0" />
                            <img src="/Say-after.svg" alt="Icon 4 Hover" className="w-5 h-5 md:w-6 md:h-6 absolute top-2 left-0 opacity-0 group-hover:opacity-100" />
                            <span>Say</span>
                        </button>
                        <button className="p-2 text-white rounded flex items-center space-x-2 bg-transparent group hover:bg-[#311F17] transition duration-300 text-sm md:text-base relative">
                            <img src="/See.svg" alt="Icon 5" className="w-5 h-5 md:w-6 md:h-6 group-hover:opacity-0" />
                            <img src="/See-after.svg" alt="Icon 5 Hover" className="w-5 h-5 md:w-6 md:h-6 absolute top-2 left-0 opacity-0 group-hover:opacity-100" />
                            <span>See</span>
                        </button>
                    </div>
                    <div className="w-full flex items-center bg-[#311F17] rounded-2xl focus-within:outline-none">
                        <input 
                            type="text" 
                            className="w-full h-full p-4 rounded-l-2xl bg-transparent text-white font-playfair text-xl focus:outline-none" 
                            placeholder="Type your text here..." 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="p-4 bg-transparent rounded-r-2xl relative group" onClick={handleSubmit}>
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