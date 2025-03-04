import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import Sidebar from '../../components/Sidebar';
import GameHeader from '../../components/GameHeader';

const ImageGeneratorScreen: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showScroll, setShowScroll] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chatMessages, setChatMessages] = useState<Array<{ content: string, isUser: boolean, timestamp: string, imageUrl?: string }>>([]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; // Scroll to bottom
        }
    }, [chatMessages]);

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

        if (!prompt.trim()) {
            setError('Prompt cannot be empty.');
            return;
        }

        const payload = {
            prompt
        };

        try {
            // Temporarily show user's prompt with current time
            const tempUserMessage = {
                content: prompt,
                isUser: true,
                timestamp: new Date().toLocaleTimeString()
            };
            setChatMessages(prevMessages => [...prevMessages, tempUserMessage]); // Append to bottom

            const response = await axiosInstance.post('/openai/generate-image', payload);

            const aiResponse = {
                content: response.data.imageUrl || "Image generation failed.",
                isUser: false,
                timestamp: new Date().toLocaleTimeString(),
                imageUrl: response.data.imageUrl
            };

            // Replace temp user message with backend data if available
            setChatMessages(prevMessages => [...prevMessages.slice(0, -1), aiResponse]);

            setSuccess('Image generated successfully!');
            setPrompt('');
        } catch (err) {
            console.error('Error generating image:', err);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
            <GameHeader />
            <Sidebar />
            <br />
            <br />
            <br />
            <div className="flex-grow flex justify-center items-center mt-[-5%]">
                <div
                    ref={chatContainerRef}
                    className="bg- text-white w-full md:w-1/2 p-4 rounded mt-1 mx-auto overflow-y-auto max-h-[calc(1.5em*30)] scrollbar-hide"
                    style={{ scrollbarColor: '#634630 #1E1E1E' }}
                >
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                            <p className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-[#311F17] text-white' : 'bg-[#634630] text-[#E5D4B3]'}`}>
                                {msg.content}
                            </p>
                            {msg.imageUrl && (
                                <img src={msg.imageUrl} alt="Generated" className="max-w-full h-auto mt-2 rounded-lg" />
                            )}
                            <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full md:w-1/2 mx-auto mt-[0%] flex flex-col items-center md:items-start space-y-4 fixed bottom-0 md:relative md:bottom-auto bg-[#1E1E1E] md:bg-transparent p-4 md:p-0">
                <div className="w-full flex items-start bg-[#311F17] rounded-2xl focus-within:outline-none">
                    <textarea
                        ref={textareaRef}
                        className={`w-full p-4 rounded-l-2xl bg-transparent text-white font-playfair text-xl focus:outline-none resize-none min-h-[56px] max-h-48 ${
                            showScroll ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-[#634630] scrollbar-track-transparent' : 'overflow-y-hidden'
                        }`}
                        placeholder="Type your prompt here..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        style={{
                            minHeight: '56px',
                            height: `${Math.min(prompt.split('\n').length * 24 + 32, 192)}px`
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
    );
};

export default ImageGeneratorScreen;