import { FaUserCircle } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import { useParams } from "react-router-dom";

interface CommentProps {
    userName: string;
    comment: string;
    story: string;
    onGoToGame: () => void;
}

const Comment: React.FC<CommentProps> = ({ userName, comment, story, onGoToGame }) => {
    return (
        <div className="border border-gray-300 rounded-md m-2 p-3 bg-[#563C2D] shadow-md">
            <div className="flex items-center">
                <FaUserCircle size={40} className="mr-3 text-black" />
                <div className="flex-1 text-left">
                    <h5 className="text-white font-semibold">{userName} </h5>
                    <h5 className="text-[#C9B57B] font-semibold italic"> From "{story}"</h5>
                    <p className="text-[#B28F4C]">{comment}</p>
                </div>
                <div 
                    onClick={onGoToGame}
                    className="bg-[#1e1e1e] text-[#B28F4C] px-1 py-2 rounded-md cursor-pointer text-center hover:bg-[#2a2a2a] hover:shadow-[0_0_10px_#B28F4C] transition text-sm"
                >
                    Go To Game
                </div>
            </div>
        </div>
    );
};

const YourComments = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { username, id } = useParams<{ username?: string; id?: string }>();

    if (!username && !id) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="text-red-500">No username or ID provided</div>
            </div>
        );
    }
  
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
    }, []);
  
    if (loading) {
      return (
        <div className="flex justify-center items-center p-4">
          <div className="text-[#B39C7D]">Loading comments...</div>
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
        <div className="flex justify-center items-center p-4">
          <div className="text-[#B39C7D]/80">No comments yet.</div>
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-[#2e2e2e] rounded-lg p-4 shadow-lg border border-[#3A3A3A] hover:border-[#B39C7D] transition-colors duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[#B39C7D] font-medium">
                {comment.Game?.title || comment.User?.username}
              </h3>
              <span className="text-[#ffffff]/60 text-sm">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-[#ffffff]/80">{comment.content}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default YourComments;
