import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Define proper type for offers based on API response
interface TokenPackage {
    id: string;
    name: string;
    price: number;
    tokens: number;
    currency?: string;
    isPopular?: boolean;
    isBestValue?: boolean;
}

interface CoinStoreProps {
    onClose: () => void;
    isStandalone?: boolean;
}

const CoinStore: React.FC<CoinStoreProps> = ({ onClose, isStandalone = false }) => {
    const [offers, setOffers] = useState<TokenPackage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredOffer, setHoveredOffer] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                // Updated to use the correct API endpoint from your routes
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/shop/tokens/packages');

                // Sort offers by price (lowest to highest)
                const sortedOffers = [...response.data].sort((a, b) => a.price - b.price);
                setOffers(sortedOffers);
                setError(null);
            } catch (error) {
                console.error('Error fetching token packages:', error);
                setError('Failed to load token packages. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const handleBuyCoins = async (itemId: string) => {
        const email = localStorage.getItem('email');
        if (!email) {
            setError('User email not found. Please log in again.');
            return;
        }

        try {
            // Get current game ID from URL if in a game
            let gameId;
            const pathMatch = window.location.pathname.match(/\/game\/(\d+)/);
            if (pathMatch && pathMatch[1]) {
                gameId = pathMatch[1];
            }

            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/shop/tokens/purchase', {
                packageId: itemId,
                email: email,
                gameId: gameId // Pass the gameId if available
            });

            const { paymentLink } = response.data;
            if (paymentLink) {
                window.location.href = paymentLink;
            } else {
                setError('Payment link not received from server');
            }
        } catch (error) {
            console.error('Error purchasing token package:', error);
            setError('Failed to process purchase. Please try again later.');
        }
    };

    const renderContent = () => (
        <>
            {/* Header with title and info icon */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white font-cinzel">Buy Weavels</h2>

                {/* Info icon with tooltip */}
                <div
                    className="cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <div className="bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center text-[#2F2118] font-bold">
                        !
                    </div>

                    {/* Tooltip */}
                    {showTooltip && (
                        <div className="absolute right-6 mt-2 bg-[#2F2118] border border-yellow-500 p-4 rounded-lg shadow-lg w-64 z-10 text-left">
                            <h3 className="text-yellow-400 font-bold text-center mb-2">✨ Weavel: The Sage's Currency ✨</h3>
                            <p className="text-white text-sm">
                                A Weavel is your key to crafting tales with the AI Sage! Each Weavel lets you weave one story per interaction.
                            </p>
                            <p className="text-white text-sm mt-2">
                                Gather Weavels to unlock endless medieval adventures!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
                    <p className="text-white">Loading available packages...</p>
                </div>
            ) : offers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {offers.map((offer) => (
                        <motion.button
                            key={offer.id}
                            className={`relative ${offer.isPopular
                                    ? 'bg-gradient-to-b from-[#3a1e0b] to-[#2F2118] border-2 border-yellow-500 shadow-lg'
                                    : offer.isBestValue
                                        ? 'bg-gradient-to-b from-[#0b3a1e] to-[#2F2118] border-2 border-green-500 shadow-lg'
                                        : 'bg-[#2F2118]'
                                } text-white py-4 px-6 rounded-lg flex flex-col items-center transition-all duration-300`}
                            onClick={() => handleBuyCoins(offer.id)}
                            onMouseEnter={() => setHoveredOffer(offer.id)}
                            onMouseLeave={() => setHoveredOffer(null)}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: `0px 0px 12px ${offer.isBestValue ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 215, 0, 0.5)'}`
                            }}
                            transition={{ type: "tween", duration: 0.1 }}
                        >
                            {/* Popular Badge */}
                            {offer.isPopular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-[#2F2118] text-xs font-bold px-3 py-1 rounded-full">
                                    POPULAR
                                </div>
                            )}

                            {/* Best Value Badge */}
                            {offer.isBestValue && !offer.isPopular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-[#2F2118] text-xs font-bold px-3 py-1 rounded-full">
                                    BEST VALUE
                                </div>
                            )}

                            <div className={`relative ${offer.isPopular ? 'animate-pulse-glow' :
                                    offer.isBestValue ? 'animate-pulse-glow-green' : ''
                                }`}>
                                <img src="/Coin.svg" alt="Token Icon" className="w-12 h-12 mb-2" />
                                {offer.isPopular && (
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 blur-md -z-10"></div>
                                )}
                                {offer.isBestValue && !offer.isPopular && (
                                    <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 blur-md -z-10"></div>
                                )}
                            </div>

                            <span className="text-lg font-bold">{offer.name}</span>
                            <span className={`text-xl ${offer.isPopular ? 'text-yellow-300' :
                                    offer.isBestValue ? 'text-green-300' :
                                        'text-yellow-400'
                                }`}>
                                {offer.tokens} Weavels
                            </span>

                            <span className="mt-2 mb-2">
                                {offer.price} {offer.currency || 'PHP'}
                            </span>

                            {/* Buy Now button - always visible but highlights on hover */}
                            <span className={`mt-1 px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${hoveredOffer === offer.id
                                    ? offer.isBestValue ? 'bg-green-500 text-[#2F2118]' : 'bg-yellow-500 text-[#2F2118]'
                                    : 'bg-[#634630] text-white bg-opacity-70'
                                }`}>
                                Buy Now
                            </span>
                        </motion.button>
                    ))}
                </div>
            ) : (
                <div className="text-white text-center py-16">
                    No token packages available at the moment.
                </div>
            )}

            <div className="flex justify-end">
                <button
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-300"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </>
    );

    // When used as a standalone page, render with a container
    if (isStandalone) {
        return (
            <div className="max-w-4xl mx-auto bg-[#634630] p-6 rounded-lg shadow-lg my-8">
                {renderContent()}
            </div>
        );
    }

    // When used as a modal, render with overlay and positioning
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-[#634630] p-6 rounded-lg shadow-lg max-w-4xl relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default CoinStore;