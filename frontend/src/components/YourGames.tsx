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
        <div
            className="w-full max-w-4xl mx-auto border rounded-lg shadow-md p-4 my-4"
            style={{ backgroundColor: "#563C2D" }}
        >
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h1 className="text-2xl font-bold" style={{ color: "#B28F4C" }}>
                    {title}
                </h1>
                <div
                    className="cursor-pointer text-blue-500 hover:underline"
                    style={{ color: "#C9B57B" }}
                >
                    GO TO GAME
                </div>
            </div>
            <div>
                <p className="text-white mb-2">{truncatedDescription}</p>
                {!isExpanded && description.length > 300 && (
                    <div
                        onClick={() => setIsExpanded(true)}
                        className="text-blue-500 hover:underline ml-2 cursor-pointer"
                        aria-expanded={isExpanded}
                        style={{ color: "#C9B57B" }}
                    >
                        Read More
                    </div>
                )}
                {isExpanded && (
                    <div
                        onClick={() => setIsExpanded(false)}
                        className="text-blue-500 hover:underline ml-2 cursor-pointer"
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
    const scrollContainerStyle = {
        maxHeight: "400px",
        overflowY: "auto" as "auto",
        margin: "2px",
        padding: "10px", // Added padding to separate data from scroll
        scrollbarColor: "#634630 transparent",
        scrollbarWidth: "auto" as "auto",
        "&::-webkit-scrollbar": {
            width: "12px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
        },
        "@media (max-width: 600px)": {
            maxHeight: "200px",
        },
    };

    return (
        <div className="container mx-auto py-8" style={scrollContainerStyle}>
            {games.map((game, index) => (
                <GameDetails
                    key={index}
                    title={game.title}
                    description={game.description}
                />
            ))}
        </div>
    );
}
