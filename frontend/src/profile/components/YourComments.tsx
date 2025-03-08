import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaGamepad, FaCommentDots } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from '../../../config/axiosConfig';

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    Game?: {
        id: number;
        title: string;
        slug: string;
        image_data?: string;
        primary_color?: string;
    };
    User?: {
        username: string;
    };
}

const YourComments = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { username, id } = useParams<{ username?: string; id?: string }>();
    const navigate = useNavigate();

    const handleGoToGame = (slug?: string) => {
        if (slug) {
            navigate(`/game/${slug}`);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const endpoint = username 
                    ? `/admin/users/username/${username}/comments`
                    : `/game/${id}/comments`;
                const response = await axiosInstance.get(endpoint);

                setComments(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load comments');
                setLoading(false);
                console.error('Error fetching comments:', err);
            }
        };
    
        fetchComments();
    }, [username, id]);
  
    if (!username && !id) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="text-red-500">No username or ID provided</div>
            </div>
        );
    }
  
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-t-[#B39C7D] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
  
    if (error) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
  
    if (comments.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 bg-[#2e2e2e] rounded-lg">
                <div className="text-[#B39C7D]/80 text-center">
                    <FaCommentDots className="mx-auto mb-4 text-4xl text-[#B39C7D]" />
                    No comments yet.
                </div>
            </div>
        );
    }
  
    return (
        <div className="space-y-4 p-4">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="relative bg-[#2e2e2e] rounded-lg p-4 shadow-lg border border-[#3A3A3A] hover:border-[#B39C7D] transition-colors duration-300"
                >
                    {/* Game Image Background */}
                    {comment.Game?.image_data && (
                        <div 
                            className="absolute inset-0 rounded-lg opacity-10 bg-cover bg-center"
                            style={{ 
                                backgroundImage: `url(${comment.Game.image_data})`,
                                backgroundColor: comment.Game.primary_color || '#1E1E1E'
                            }}
                        ></div>
                    )}

                    <div className="relative z-10">
                        <div className="flex items-center mb-4">
                            <FaUserCircle className="text-[#B39C7D] mr-3 text-3xl" />
                            <div className="flex-grow">
                                <span className="text-[#ffffff]/60 text-xs">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {comment.Game && (
                            <div 
                                className="mb-4 bg-[#563C2D] rounded-md p-3 flex items-center cursor-pointer hover:bg-[#6A4C3B] transition"
                                onClick={() => handleGoToGame(comment.Game?.slug)}
                            >
                                {comment.Game.image_data ? (
                                    <img 
                                        src={comment.Game.image_data} 
                                        alt={comment.Game.title} 
                                        className="w-16 h-16 rounded-md object-cover mr-3"
                                    />
                                ) : (
                                    <FaGamepad className="text-[#B28F4C] text-3xl mr-3" />
                                )}
                                <div>
                                    <h4 className="text-[#C9B57B] font-semibold">
                                        {comment.Game.title}
                                    </h4>
                                    <p className="text-[#B28F4C] text-sm">View Game Details</p>
                                </div>
                            </div>
                        )}

                        <p className="text-[#ffffff]/90 bg-black/30 p-3 rounded-md">
                            <FaCommentDots className="inline mr-2 text-[#B39C7D]" />
                            {comment.content}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
  
export default YourComments;