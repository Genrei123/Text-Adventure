import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CoinStore from '../shop/CoinStore';

const Shop: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Get the status from URL query parameter
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const gameId = params.get('gameId');
        const cleared = params.get('cleared');
        const tokens = params.get('tokens') || ""; // Get number of tokens if available

        // If this is a payment return (cleared=true), clear history
        if (cleared === 'true') {
            // This is a more aggressive approach to clear history state
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = function () {
                // When user tries to go back, redirect them forward instead
                if (gameId) {
                    window.location.href = `/game/${gameId}`;
                } else {
                    window.location.href = '/home';
                }
            };

            // Clean the URL after processing to prevent showing message on refresh
            // This replaces the current URL with one without query parameters
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }

        // If we have both a success status and gameId, redirect immediately
        if (status === 'success' && gameId) {
            // Navigate directly to the game without showing the shop page
            navigate(`/game/${gameId}`, {
                replace: true,  // Replace current history entry
                state: {
                    purchaseSuccess: true,
                    message: `Oh Great Adventurer, an amount of ${tokens} Weavels has been added to your pouch.`
                }
            });
            return;
        }

        // Show temporary success message if status is success
        if (status === 'success') {
            setSuccessMessage(`Oh Great Adventurer, an amount of ${tokens} Weavels has been added to your pouch.`);

            // Clean the URL after processing to prevent showing message on refresh
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);

            // Set a timeout to clear the message after 5 seconds
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000); // Changed to 5 seconds as requested

            // Clear the timeout when component unmounts
            return () => {
                clearTimeout(timer);
                window.onpopstate = null;
            };
        }

        // Cleanup function to restore normal browser behavior when component unmounts
        return () => {
            window.onpopstate = null;
        };
    }, [location, navigate]);

    const handleClose = () => {
        // Try to get the gameId from the URL if available
        const params = new URLSearchParams(location.search);
        const gameId = params.get('gameId');

        if (gameId) {
            // Navigate to the specific game, replacing history
            navigate(`/game/${gameId}`, { replace: true });
        } else {
            // Navigate to home instead of using back button
            navigate('/home', { replace: true });
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#1E1E1E] py-8">
                <div className="container mx-auto px-4">
                    {/* Message as part of document flow */}
                    {successMessage && (
                        <div className="mx-auto max-w-md bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 shadow-lg transition-opacity duration-500">
                            {successMessage}
                        </div>
                    )}
                    <CoinStore onClose={handleClose} isStandalone={true} />
                </div>
            </div>
        </>
    );
};

export default Shop;