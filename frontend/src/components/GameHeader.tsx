import React, { useState } from 'react';

const GameHeader: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <nav className="bg-[#1E1E1E] py-[1.06rem] px-0 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
            <div className="flex justify-between items-center">
                <div className="text-xl font-cinzel text-[#C8A97E] font-bold hidden sm:block ml-[5%]">SAGE.AI</div>
                <div className="flex items-center">
                    <div className="absolute left-[40%] transform -translate-x-1/2 text-s font-cinzel text-[#ffffff] font-bold sm:text-base truncate max-w-[20ch]">
                        The Warhammer Titan sdhjsajkdhaskdj
                    </div>

                </div>
                <div className="flex items-center">                     
                        <img src="/Coin.svg" alt="Coins" className="w-6 h-6" />
                        <br></br>
                        <span className="text-x1 font-cinzel text-[#ffffff] font-bol">{new Intl.NumberFormat().format(100000)}</span>
                        <button className="mr-1 relative group" onClick={() => setShowModal(true)}>
                            <img src="/add.svg" alt="Button" className="w-7 h-6 mr-[10%]" />
                            <img src="/add-after.svg" alt="Hover Button" className="w-7 h-6 mr-[10%] absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                        {showModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-[#634630] p-6 rounded-lg shadow-lg">
                                    <h2 className="text-xl font-bold mb-4 text-white font-cinzel">Buy Token</h2>
                                    <div className="flex space-x-2">
                                        <button className="bg-[#2F2118] text-white py-2 px-4 rounded-lg flex flex-col items-center space-x-2 hover:bg-black transition-colors duration-300">
                                            <img src="/Coin.svg" alt="Coin Icon" className="w-10 h-10" />                                          
                                            <br></br>
                                            <span>200 Coin Package</span>
                                        </button>
                                        <button className="bg-[#2F2118] text-white py-2 px-4 rounded-lg flex flex-col items-center space-x-2 hover:bg-black transition-colors duration-300">
                                            <img src="/Coin.svg" alt="Coin Icon" className="w-10 h-10" />
                                            <br></br>
                                            <span>200 Coin Package</span>
                                        </button>
                                        <button className="bg-[#2F2118] text-white py-2 px-4 rounded-lg flex flex-col items-center space-x-2 hover:bg-black transition-colors duration-300">
                                            <img src="/Coin.svg" alt="Coin Icon" className="w-10 h-10" />
                                            <br></br>
                                            <span>3000 Coins Package</span>
                                        </button>
                                        <button className="bg-[#2F2118] text-white py-2 px-4 rounded-lg flex flex-col items-center space-x-2 hover:bg-black transition-colors duration-300">
                                            <img src="/Coin.svg" alt="Coin Icon" className="w-10 h-10" />
                                            <br></br>
                                            <span>5000 Coins Package</span>
                                        </button>
                                    </div>
                                    <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded" onClick={() => setShowModal(false)}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>
            </div>
        </nav>
    );
};

export default GameHeader;