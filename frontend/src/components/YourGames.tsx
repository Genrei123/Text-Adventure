import React from "react"
import { useState } from "react"

interface GameDetailsProps {
    title?: string
    description?: string
}

function GameDetails({ title = "Untitled Game", description = "No description available." }: GameDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const truncatedDescription = isExpanded || description.length <= 300 ? description : description.slice(0, 300) + "..."

    return (
        <div className="w-full max-w-4xl mx-auto border rounded-lg shadow-md p-4" style={{ backgroundColor: "#563C2D" }}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h1 className="text-2xl font-bold" style={{ color: "#B28F4C" }}>Your Games</h1>
                <div className="cursor-pointer text-blue-500 hover:underline" style={{ color: "#C9B57B" }}>GO TO GAME</div>
            </div>
            <div>
                <h2 className="text-3xl font-semibold mb-2" style={{ color: "white", fontFamily: "Cinzel" }}>{title}</h2>
                <p className="text-white mb-2">
                    {truncatedDescription}
                </p>
                {!isExpanded && description.length > 300 && (
                    <div
                        onClick={() => setIsExpanded(true)}
                        className="text--500 hover:underline ml-2 cursor-pointer"
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
    )
}

export default function GamesPage() {
    const gameTitle = "Example Game Title"
    const gameDescription =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

    return (
        <div className="container mx-auto py-8">
            <GameDetails title={gameTitle} description={gameDescription} />
            {/* Example of a game with missing data */}
            <div className="mt-8">
                <GameDetails />
            </div>
        </div>
    )
}
