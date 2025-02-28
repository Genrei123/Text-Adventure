import React from "react";

const CoinStore: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-[#634630] p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-white font-cinzel">Buy Token</h2>
                <div className="flex space-x-2">
                    {[200, 200, 3000, 5000].map((amount, index) => (
                        <button key={index} className="bg-[#2F2118] text-white py-2 px-4 rounded-lg flex flex-col items-center hover:bg-black transition-colors duration-300">
                            <img src="/Coin.svg" alt="Coin Icon" className="w-10 h-10" />
                            <br />
                            <span>{amount} Coins Package</span>
                        </button>
                    ))}
                </div>
                <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default CoinStore;