import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../config/axiosConfig"; // Adjust path as needed

interface GameVisit {
  gameId: string;
  visitCount: number;
}

interface Game {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  // Add other game properties as needed
}

interface PortraitCardProps {
  visitedGames?: GameVisit[];
}

const PortraitCard: React.FC<PortraitCardProps> = ({ visitedGames = [] }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (visitedGames.length === 0) {
          setLoading(false);
          return;
        }

        // Get game details for each visited game
        const gameIds = visitedGames.map(game => game.gameId);
        const response = await axiosInstance.get('/games/by-ids', {
          params: { ids: gameIds.join(',') }
        });

        if (response.data) {
          // Sort games by visit count (most visited first)
          const sortedGames = response.data.sort((a: Game, b: Game) => {
            const aVisits = visitedGames.find(g => g.gameId === a.id)?.visitCount || 0;
            const bVisits = visitedGames.find(g => g.gameId === b.id)?.visitCount || 0;
            return bVisits - aVisits;
          });

          setGames(sortedGames);
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [visitedGames]);

  if (loading) {
    return <div className="text-center text-[#C8A97E]">Loading your games...</div>;
  }

  if (games.length === 0) {
    return <div className="text-center text-[#C8A97E]">No games in your journey yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => {
        const visitCount = visitedGames.find(g => g.gameId === game.id)?.visitCount || 0;
        
        return (
          <Link
            to={`/game-details/${game.id}`}
            key={game.id}
            className="block group"
          >
            <div className="relative overflow-hidden rounded transition duration-300 transform hover:scale-105">
              <img
                src={game.coverImage || "/game-placeholder.jpg"}
                alt={game.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-lg font-cinzel text-white">{game.title}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-[#C8A97E]">
                    Visited {visitCount} time{visitCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PortraitCard;