import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import GameHeader from '../components/GameHeader';

const GameScreen: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [chatMessages, setChatMessages] = useState<Array<{content: string, isUser: boolean, timestamp: string}>>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Frontend validation
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
            UserId: 70, // Replace with dynamic user ID if needed
        };

        // Log the payload for debugging
        console.log('Payload:', payload);

        try {
            // TODO! Send the message to the backend
            // For now, we'll just add the message to the chat
            const newUserMessage = {
                content: message,
                isUser: true,
                timestamp: new Date().toLocaleTimeString()
            };
            setChatMessages(prevMessages => [...prevMessages, newUserMessage]);

            // Simulate a response from the AI
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
            setError(
                'An unexpected error occurred. Please try again.'
            );
        }
    };

    return (
        <>
        <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
            <GameHeader/>
            <Sidebar/>
            <br/>
            <br/>
            <br/>
            <div className="flex-grow flex justify-center items-center mt-[-5%]">
                <div className="bg- text-white w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto max-h-[calc(1.5em*30)] scrollbar-hide" style={{ scrollbarColor: '#634630 #1E1E1E' }}>
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