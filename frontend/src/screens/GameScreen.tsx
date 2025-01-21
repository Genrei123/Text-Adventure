import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from '../axiosConfig/axiosConfig';

const GameScreen: React.FC = () => {
    const [userInput, setUserInput] = useState('');
    const [sessionId] = useState('session123'); // Example session ID
    const [gameId] = useState(1); // Example Game ID
    const [userId] = useState(1); // Example User ID

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/chat', {
                session_id: sessionId,
                model: 'gpt-4',
                role: 'user',
                content: userInput,
                GameId: gameId,
                UserId: userId,
            });

            console.log('Response processed:', response.data);
            setUserInput(''); // Clear the input field after submission
        } catch (error) {
            console.error('Error processing response:', error);
            alert('Failed to submit response. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
            <Sidebar />
            <div className="flex-grow flex justify-center items-center mt-[-5%]">
                <div className="bg- text-white w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto max-h-[calc(1.5em*30)] scrollbar-hide" style={{ scrollbarColor: '#634630 #1E1E1E' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="w-full flex items-center bg-[#311F17] rounded-2xl focus-within:outline-none">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="w-full h-full p-4 rounded-l-2xl bg-transparent text-white font-playfair text-xl focus:outline-none"
                                placeholder="Type your text here..."
                            />
                            <button type="submit" className="p-4 bg-transparent rounded-r-2xl relative group">
                                <img src="/Enter.svg" alt="Enter" className="h-6 group-hover:opacity-0" />
                                <img src="/Enter-After.svg" alt="Enter Hover" className="h-6 absolute top-4 left-4 opacity-0 group-hover:opacity-100" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;
