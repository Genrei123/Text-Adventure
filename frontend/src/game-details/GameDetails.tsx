import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import YourComments from '../profile/components/YourComments.tsx';
import samplePortraitCardData from '../home/types/Story.ts'; // Adjust the import path accordingly
import { useNavigate } from 'react-router-dom';

const GameDetails: React.FC = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("comments");
    const story = samplePortraitCardData[0]; // Displaying the first story as an example

    function handleClick(): void {
        // TODO
        navigate('/game');
    }

    return (
        <div className="w-full h-[150vh] bg-cover bg-center bg-[url('path/to/your/image.jpg')]">
            <Navbar />
            <Sidebar />
            <br />
            <br />
            <div className="w-7/10 h-[40%] bg-[#634630] mt-10 rounded-2xl mx-[10%] relative overflow-hidden border-4 border-[#634630] ">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <img src={story.imageUrl} alt={story.title} className="rounded-2xl w-full h-full object-cover" />

                {/* Bottom content */}
                <div className="absolute bottom-4 left-4 bg-opacity-50 text-white px-4 py-2 rounded-lg">
                    <h2 className="text-[250%] font-bold font-cinzel text-[#C9B57B] drop-shadow-[2px_2px_4px_rgba(0,0,0,2)]">
                        {story.title}
                    </h2>
                    <p className="text-[100%] font-cinzel mb-[20%] drop-shadow-[2px_2px_4px_rgba(0,0,0,2)]">
                        {story.description}
                    </p>
                </div>
                <br></br>

                 {/* Icons, Counts, and Play Button on the Right */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-6  bg-opacity-50 text-white px-4 py-2 rounded-lg">
                {/* Icons and Counts */}
                <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <img src="/Star.svg" alt="Heart Icon" className="w-4 h-4" />
                    <span>10</span>
                </div>
                <div className="flex items-center space-x-1">
                    <img src="/Comments.svg" alt="Star Icon" className="w-4 h-4" />
                    <span>8.5</span>
                </div>
                <div className="flex items-center space-x-1">
                    <img src="/Favorites.svg" alt="Eye Icon" className="w-4 h-4" />
                    <span>120</span>
                </div>
                </div>

                {/* Play Game Button */}
                <button className="bg-[#1e1e1e] text-white px-4 py-1 rounded-lg hover:bg-white hover:text-black transition"
                onClick={handleClick}>
                Play Game
                </button>
                </div>
                
            </div>
            <br></br>
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
                    <p className="text-white mx-[10%] text-left text-[100%]">{story.summary}</p>
                </div>
            )}
        </div>
    );
};

export default GameDetails;
