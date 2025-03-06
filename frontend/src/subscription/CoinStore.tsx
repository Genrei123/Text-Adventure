import React, { useState, useEffect } from "react";
import axios from "axios";

const CoinStore: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [offers, setOffers] = useState<{ id: string, name: string, price: number, coins: number }[]>([]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shop/items`);
                setOffers(response.data);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, []);

    const handleBuyCoins = async (itemId: string) => {
        const email = localStorage.getItem('email'); // Retrieve email from local storage
        if (!email) {
            console.error('User email not found in local storage');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shop/buy-item`, {
                itemId: itemId,
                email: email // Use the email from local storage
            });
            const { paymentLink } = response.data;
            window.location.href = paymentLink; // Redirect to the payment link
        } catch (error) {
            console.error('Error buying coins:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-[#634630] p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-white font-cinzel">Buy Token</h2>
                <div className="flex space-x-2 mb-4">
                    {offers.map((offer) => (
                        <button
                            key={offer.id}
                            className="bg-[#2F2118] text-white py-2 px-4 rounded-lg flex flex-col items-center hover:bg-black transition-colors duration-300"
                            onClick={() => handleBuyCoins(offer.id)}
                        >
                            <img src="/Coin.svg" alt="Coin Icon" className="w-10 h-10" />
                            <br />
                            <span>{offer.coins} Coins Package</span>
                            <span>{offer.price} PHP</span>
                        </button>
                    ))}
                </div>
                <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default CoinStore;