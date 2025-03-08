import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../../../config/axiosConfig';
import LoadingBook from '../../components/LoadingBook';
import { useLoading } from '../../context/LoadingContext';

interface Story {
    id: number;
    title: string;
    description: string;
    slug?: string;
    image_data?: string;
    genre?: string;
    primary_color?: string;
}

const GameDetails: React.FC<Story & { onGameClick?: () => void }> = ({ 
    title, 
    description, 
    genre,
    image_data,
    primary_color,
    onGameClick 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncatedDescription =
        isExpanded || description.length <= 300
            ? description
            : description.slice(0, 300) + "...";

    return (
        <div 
            className="relative group cursor-pointer"
            onClick={onGameClick}
        >
            <div 
                className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl"
                style={{ backgroundColor: primary_color || '#1E1E1E' }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300"></div>
                
                {/* Image */}
                <img 
                    src={image_data || 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                    alt={title} 
                    className="w-full h-full object-cover"
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-cinzel font-extrabold text-[#F1E3C6] mb-2">
                        {title}
                    </h3>
                    <p className="text-lg font-playfair text-[#FFFBEA] mb-4 line-clamp-2">
                        {isExpanded ? description : truncatedDescription}
                    </p>

                    {description.length > 300 && (
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="text-[#C8A97E] hover:underline font-cinzel"
                        >
                            {isExpanded ? 'Show Less' : 'Read More'}
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[#F1E3C6] font-cinzel">
                            📋 {genre || 'Unspecified'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function YourGames() {
    const [games, setGames] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { navigateWithLoading } = useLoading();

    useEffect(() => {
        const fetchUserGames = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/game/games/user/${username}`);
                setGames(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user games:', error);
                setError('Failed to fetch games');
                setLoading(false);
            }
        };

        if (username) {
            fetchUserGames();
        }
    }, [username]);

    const handleGameClick = (slug?: string) => {
        if (slug) {
            if (onGameClick) {
                onGameClick(slug);
            } else {
                navigateWithLoading(`/game/${slug}`);
            }
        }
    };

    if (loading) {
        return <LoadingBook message="Loading Games..." size="md" />;
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full">
            {games.length === 0 ? (
                <div className="bg-[#2e2e2e] w-full p-4 text-center text-[#B39C7D] font-cinzel">
                    No games created yet
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <GameDetails
                            key={game.id}
                            {...game}
                            onGameClick={() => handleGameClick(game.slug)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}