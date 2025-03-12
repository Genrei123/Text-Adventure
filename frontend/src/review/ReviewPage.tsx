import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { StatCardProps, GenreTagProps, ActionButtonProps, ReviewPageProps, defaultReviewPageProps } from './types/ReviewPage';

const ReviewPage: React.FC<ReviewPageProps> = ({
    title = defaultReviewPageProps.title,
    subtitle = defaultReviewPageProps.subtitle,
    reads = defaultReviewPageProps.reads,
    saves = defaultReviewPageProps.saves,
    comments = defaultReviewPageProps.comments,
    image = defaultReviewPageProps.image
}) => {
    const [currentReads, setCurrentReads] = useState(reads);
    const [currentSaves, setCurrentSaves] = useState(saves);
    const [currentComments, setCurrentComments] = useState(comments);
    const [currentView, setCurrentView] = useState<'details' | 'comments'>('details');

    const genres = ["Fantasy", "Mystery", "Adventure"];
    const stats = [
        { icon: "/assets/icons/reads.png", value: currentReads, label: "Reads" },
        { icon: "/assets/icons/saves.png", value: currentSaves, label: "Saves" },
        { icon: "/assets/icons/comments.png", value: currentComments, label: "Comments" }
    ];

    const handleDetailsClick = () => setCurrentView('details');
    const handleCommentClick = () => setCurrentView('comments');

    const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg bg-gray-800">
            <img loading="lazy" src={icon} alt="" className="w-6 aspect-square" />
            <div className="text-white">{value}</div>
            {label && <span className="text-sm text-gray-300">{label}</span>}
        </div>
    );

    const GenreTag: React.FC<GenreTagProps> = ({ name }) => (
        <div className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white shadow-md">
            {name}
        </div>
    );

    const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, count, onClick }) => (
        <button
            onClick={onClick}
            className="flex items-center px-4 py-2 text-lg font-bold bg-gray-900 border border-gray-700 text-white rounded-full shadow-md hover:bg-gray-800"
        >
            <img src={icon} alt="" className="w-4 mr-2" />
            {label}
            {count !== undefined && (
                <>
                    <div className="mx-2 border-l border-white h-6" />
                    <span>{count}</span>
                </>
            )}
        </button>
    );

    const DetailsSection: React.FC = () => (
        <div className="flex-1 mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-400">DETAILS</h2>
            <p className="text-base md:text-lg text-gray-300 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
        </div>
    );

    const CommentsSection: React.FC = () => (
        <div className="flex-1 mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-400">COMMENTS</h2>
            <p className="text-base md:text-lg text-gray-300 mt-4">
                Comments section content goes here.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col md:flex-row">
            {/* <Sidebar /> */}
            <div className="flex-1 flex flex-col items-center">
                <nav className="bg-[#1e1e1e] py-4 px-6 shadow-lg w-full flex justify-between items-center">
                    <div className="text-2xl font-cinzel text-[#C8A97E]">Sage.AI</div>
                    <div className="text-2xl font-cinzel text-white hidden md:block">HIDDEN TAVERN</div>
                    <div className="flex items-center space-x-4">
                        <img src="/Tokens.svg" alt="Tokens" className="w-8 h-8 rounded-full" />
                        <span className="text-xl text-white">14</span>
                    </div>
                </nav>
                <div className="relative w-full max-w-7xl h-60 flex flex-col justify-end p-6 rounded-3xl overflow-hidden shadow-xl">
                    <img src={image} alt="Hidden Tavern" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
                        <p className="text-xl md:text-2xl mt-2">{subtitle}</p>
                    </div>
                </div>
                <div className="flex flex-col w-full max-w-6xl mt-6">
                    <div className="flex flex-row gap-4 mb-6 justify-center">
                        <ActionButton icon="/assets/icons/details.png" label="Details" onClick={handleDetailsClick} />
                        <ActionButton icon="/assets/icons/comments.png" label="Comments" count={currentComments} onClick={handleCommentClick} />
                    </div>
                    <div className="flex flex-col md:flex-row">
                        {currentView === 'details' ? <DetailsSection /> : <CommentsSection />}
                        <div className="flex flex-col gap-6 ml-0 md:ml-6">
                            {stats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center mt-6">
                        <span className="text-xl">Genre:</span>
                        {genres.map((genre, index) => (
                            <GenreTag key={index} name={genre} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;

// mga kulang
// Add a "Play Game" button in the Details section.
// Introduce a state to track "liked" status.
// Display total likes and show whether the user has liked the game.