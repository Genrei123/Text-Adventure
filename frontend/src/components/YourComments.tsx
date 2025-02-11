import React from "react";
import { FaUserCircle } from "react-icons/fa";
import comments from "../types/Comments"; // Update the path to your Comments.ts file.

interface CommentProps {
    userName: string;
    comment: string;
    onGoToGame: () => void;
}

const Comment: React.FC<CommentProps> = ({ userName, comment, onGoToGame }) => {
    return (
        <div className="border border-gray-300 rounded-md m-2 p-3 bg-[#563C2D] shadow-md">
            <div className="flex items-center">
                <FaUserCircle size={40} className="mr-3 text-black" />
                <div className="flex-1 text-left">
                    <h5 className="text-white font-semibold">{userName}</h5>
                    <p className="text-[#B28F4C]">{comment}</p>
                </div>
                <div 
                    onClick={onGoToGame}
                    className="bg-[#1e1e1e] text-[#B28F4C] px-3 py-2 rounded-md cursor-pointer text-center hover:bg-[#2a2a2a] transition"
                >
                    Go To Game
                </div>
            </div>
        </div>
    );
};

const YourComments: React.FC = () => {
    return (
        <div className="max-h-[400px] overflow-y-auto m-2 p-2 scrollbar-thin scrollbar-thumb-[#B28F4C] scrollbar-track-transparent sm:max-h-[400px] custom-scrollbar fade-in">
        {comments.map((commentData, index) => (
            <Comment
                key={index}
                userName={commentData.userName}
                comment={commentData.comment}
                onGoToGame={commentData.onGoToGame} 
            />
            ))}
        </div>
    );
};

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

export default YourComments;
