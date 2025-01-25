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
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                margin: "10px",
                padding: "10px",
                backgroundColor: "#563C2D",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <FaUserCircle size={40} style={{ marginRight: "10px" }} />
                <div style={{ flex: 1, textAlign: "left" }}>
                    <h5 style={{ margin: 0, color: "white" }}>{userName}</h5>
                    <p style={{ margin: 0, color: "#B28F4C", textAlign: "left" }}>{comment}</p>
                </div>
                <div
                    onClick={onGoToGame}
                    style={{
                        backgroundColor: "#1e1e1e",
                        color: "#B28F4C",
                        padding: "10px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center",
                    }}
                >
                    Go To Game
                </div>
            </div>
        </div>
    );
};

const YourComments: React.FC = () => {
    return (
        <div
            style={{
                maxHeight: "400px",
                overflowY: "auto",
                margin: "2px",
                scrollbarColor: "#634630 transparent", // For Firefox
            }}
            className="comments-container"
        >
            <style>
                {`
                    .comments-container::-webkit-scrollbar {
                        width: 8px;
                    }

                    .comments-container::-webkit-scrollbar-thumb {
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 10px;
                    }

                    .comments-container::-webkit-scrollbar-track {
                        background-color: transparent;
                    }

                    @media (max-width: 600px) {
                        .comments-container {
                            max-height: 200px; /* Adjusted height for mobile view */
                        }
                    }
                `}
            </style>

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

export default YourComments;
