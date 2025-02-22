import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import YourComments from '../profile/components/YourComments.tsx';
import axiosInstance from '../../config/axiosConfig'; // Import your axios instance

const GameDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract game ID from the URL
    const navigate = useNavigate();
    
    const [game, setGame] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("comments");

    useEffect(() => {
        if (!id) {
            setError("Invalid game ID.");
            setLoading(false);
            return;
        }

        axiosInstance.get(`/game/${id}`)
            .then((response) => {
                setGame(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.response?.data?.message || "Failed to fetch game details");
                setLoading(false);
            });
    }, [id]);

    function handleClick(): void {
        navigate(`/game/${id}`);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[150vh] bg-cover bg-center bg-[url('path/to/your/image.jpg')]">
            <Navbar />
            <Sidebar />
            <br />
            <br />
            <div className="w-7/10 h-[40%] bg-[#634630] mt-10 rounded-2xl mx-[10%] relative overflow-hidden border-4 border-[#634630]">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <img src={game.imageUrl} alt={game.title} className="rounded-2xl w-full h-full object-cover" />

                {/* Bottom content */}
                <div className="absolute bottom-4 left-4 bg-opacity-50 text-white px-4 py-2 rounded-lg">
                    <h2 className="text-[250%] font-bold font-cinzel text-[#C9B57B] drop-shadow-[2px_2px_4px_rgba(0,0,0,2)]">
                        {game.title}
                    </h2>
                    <p className="text-[100%] font-cinzel mb-[20%] drop-shadow-[2px_2px_4px_rgba(0,0,0,2)]">
                        {game.description}
                    </p>
                </div>

                {/* Icons, Counts, and Play Button on the Right */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-6 bg-opacity-50 text-white px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <img src="/Star.svg" alt="Rating" className="w-4 h-4" />
                            <span>{game.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <img src="/Comments.svg" alt="Comments" className="w-4 h-4" />
                            <span>{game.commentsCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <img src="/Favorites.svg" alt="Favorites" className="w-4 h-4" />
                            <span>{game.favorites}</span>
                        </div>
                    </div>

                    {/* Play Game Button */}
                    <button
                        className="bg-[#1e1e1e] text-white px-4 py-1 rounded-lg hover:bg-white hover:text-black transition"
                        onClick={handleClick}
                    >
                        Play Game
                    </button>
                </div>
            </div>

            <br />

            <div className="w-[90%] mx-[10%]">
                <div className="flex border-b border-[#3A3A3A]">
                    <button
                        onClick={() => setActiveTab("comments")}
                        className={`px-4 py-2 text-[#ffffff] ${activeTab === "comments" ? "border-b-2 border-[#B39C7D]" : ""} mr-4 transition-colors duration-300 ease-in-out hover:shadow-[0_0_10px_2px_rgba(179,156,125,0.75)] rounded-full bg-transparent`}
                    >
                        COMMENTS
                    </button>
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`px-4 py-2 text-[#ffffff] ${activeTab === "details" ? "border-b-2 border-[#B39C7D]" : ""} mr-4 transition-colors duration-300 ease-in-out hover:shadow-[0_0_10px_2px_rgba(179,156,125,0.75)] rounded-full bg-transparent`}
                    >
                        DETAILS
                    </button>
                </div>
            </div>

            <div className="mt-4">
                {activeTab === "comments" && (
                    <div className="mx-[10%]">
                        <h2 className="text-2xl text-[#B39C7D] mb-4 font-cinzel">Comments</h2>
                        <YourComments />
                    </div>
                )}
            </div>

            {activeTab === "details" && (
                <div className="mx-[10%]">
                    <h2 className="text-2xl text-[#B39C7D] mb-4 font-cinzel">Details</h2>
                    <p className="text-white mx-[10%] text-left text-[100%]">{game.summary}</p>
                </div>
            )}
        </div>
    );
};

export default GameDetails;
