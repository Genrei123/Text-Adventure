import React, { useState, useEffect } from "react";
import axios from "axios";

// Define proper type for offers based on API response
interface TokenPackage {
  id: string;
  name: string;
  price: number;
  coins: number;
}

const CoinStore: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [offers, setOffers] = useState<TokenPackage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                // Updated to use the correct API endpoint from your routes
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/shop/tokens/packages');
                setOffers(response.data);
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
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/shop/tokens/purchase', {
                packageId: itemId,
                email: email
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

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-[#634630] p-6 rounded-lg shadow-lg max-w-4xl">
                <h2 className="text-xl font-bold mb-4 text-white font-cinzel">Buy Tokens</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : offers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {offers.map((offer) => (
                            <button
                                key={offer.id}
                                className="bg-[#2F2118] text-white py-4 px-6 rounded-lg flex flex-col items-center hover:bg-black transition-colors duration-300"
                                onClick={() => handleBuyCoins(offer.id)}
                            >
                                <img src="/Coin.svg" alt="Token Icon" className="w-12 h-12 mb-2" />
                                <span className="text-lg font-bold">{offer.name}</span>
                                <span className="text-yellow-400 text-xl">{offer.coins} Tokens</span>
                                <span className="mt-2">{offer.price} PHP</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-white text-center py-8">
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
            </div>
        </div>
    );
};

export default CoinStore;