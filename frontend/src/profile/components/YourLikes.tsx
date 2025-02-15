import React, { useState } from "react";
import likes from "../types/Likes"; // Adjust the path as necessary

const YourLikes: React.FC = () => {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

    const toggleDescription = (index: number) => {
        const updatedExpandedItems = new Set(expandedItems);
        if (expandedItems.has(index)) {
            updatedExpandedItems.delete(index);
        } else {
            updatedExpandedItems.add(index);
        }
        setExpandedItems(updatedExpandedItems);
    };

    return (
        <div className="max-h-96 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent fade-in custom-scrollbar">
            {likes.map((like, index) => {
                const isExpanded = expandedItems.has(index);
                const truncatedDescription =
                    like.description.length > 100 && !isExpanded
                        ? like.description.substring(0, 100) + "..."
                        : like.description;

                return (
                    <div key={index} className="flex flex-col md:flex-row bg-[#563C2D] rounded-xl p-4 mb-4">
                        <div className="flex-1 p-2">
                            <div className="flex justify-between text-gold-500">
                                <p className="text-white">{like.username}</p>
                                <p className="text-white">{like.dateCreated}</p>
                            </div>
                            <h2 className="text-2xl font-cinzel text-[#B28F4C] font-bold truncate md:whitespace-nowrap">{like.title}</h2>
                            <div className="flex gap-3 text-white my-2">
                                <div className="flex items-center gap-1"><img src="/Star.svg" alt="Stars" className="w-5 h-5" /> {like.stars}</div>
                                <div className="flex items-center gap-1"><img src="/Comments.svg" alt="Comments" className="w-5 h-5" /> {like.comments}</div>
                                <div className="flex items-center gap-1"><img src="/Favorites.svg" alt="Favorites" className="w-5 h-5" /> {like.favorites}</div>
                            </div>
                            <div className="flex justify-between items-center overflow-hidden my-2">
                                <p className={`text-white ${isExpanded ? "whitespace-normal" : "truncate"}`}>{truncatedDescription}</p>
                                <button onClick={() => toggleDescription(index)} className="text-[#2F2118] font-bold ml-2 cursor-pointer">{isExpanded ? "Show Less" : "Read More"}</button>
                            </div>
                            <div className="text-white flex gap-2 my-2">
                                <strong>Genre:</strong>
                                {like.genres.map((genre, genreIndex) => (
                                    <span key={genreIndex} className="mx-1">{genre}{genreIndex < like.genres.length - 1 ? "," : ""}</span>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button className="bg-[#B28F4C] text-gold-500 px-4 py-2 rounded-xl">Explore</button>
                            </div>
                        </div>
                    </div>
                );
            })}
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
export default YourLikes;
