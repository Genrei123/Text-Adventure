import React, { useState } from "react";
import games from "../types/Games"; // Adjust the path as necessary

interface GameDetailsProps {
    title: string;
    description: string;
}

const GameDetails: React.FC<GameDetailsProps> = ({ title, description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncatedDescription =
        isExpanded || description.length <= 300
            ? description
            : description.slice(0, 300) + "...";

    return (
        <div className="w-full max-w-4xl mx-auto border rounded-lg shadow-md p-4 my-4 bg-[#563C2D] fade-in">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h1 className="text-2xl font-bold text-[#B28F4C]">
                    {title}
                </h1>
                <div className="cursor-pointer hover:underline text-[#C9B57B]">
                    GO TO GAME
                </div>
            </div>
            <div>
                <p className="text-white mb-2">{truncatedDescription}</p>
                {!isExpanded && description.length > 300 && (
                    <div
                        onClick={() => setIsExpanded(true)}
                        className="cursor-pointer hover:underline ml-2 text-[#C9B57B]"
                        aria-expanded={isExpanded}
                    >
                        Read More
                    </div>
                )}
                {isExpanded && (
                    <div
                        onClick={() => setIsExpanded(false)}
                        className="cursor-pointer hover:underline ml-2 text-blue-500"
                        aria-expanded={isExpanded}
                    >
                        See Less
                    </div>
                )}
            </div>
        </div>
    );
};

export default function YourGames() {
    return (
        <div className="container mx-auto py-8">
            <div className="max-h-[450px] overflow-y-auto m-1 p-2.5 custom-scrollbar">
                    {games.map((game, index) => (
                        <GameDetails
                            key={index}
                            title={game.title}
                            description={game.description}
                        />
                    ))}
                </div>
        </div>
    );
}

// Add the custom scrollbar styles and keyframe animation
const styles = `
.custom-scrollbar::-webkit-scrollbar {
    width: 12px;
}

.custom-scrollbar::-webkit-scrollbar-track {
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #B28F4C;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #B28F4C;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.fade-in {
    animation: fadeIn 1s ease-in-out;
}
`;

// Inject the styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
