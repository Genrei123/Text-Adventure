import React from 'react';
import Sidebar from './Components/Sidebar';

const AdminDashboard: React.FC = () => {
    return (
        <>
            <div className="bg-[#2F2118] min-h-screen flex flex-col items-center justify-center relative p-4 md:p-0 ">
                <Sidebar />
                <h1 className="text-white text-[5vh] absolute top-[10%] left-1/2 transform -translate-x-1/2 font-cinzel">
                        Dashboard
                </h1>
                
                <div className="flex flex-col md:flex-row items-center md:justify-center gap-4 mt-[25%] md:mt-0 md:ml-[5%]">
                    {/* Total Registered Card */}
                    <div className="bg-[#634630] rounded-lg shadow-lg p-4 h-[18vh] w-[90vw] md:w-[35vw] shadow-black flex items-center">
                        <div className="flex flex-col items-start">
                            <span className="text-[#B28F4C] text-4xl font-cinzel font-bold">30,000</span>
                            <span className="text-white text-sm font-cinzel font-bold">Total Registered Players</span>
                        </div>
                        <img src="/Total.svg" alt="Photo Icon" className="h-10 w-10 object-cover rounded-full ml-auto" />
                    </div>

                    {/* Active Players */}
                    <div className="bg-[#503E31] rounded-lg shadow-lg p-4 h-[16vh] w-[90vw] md:w-[18vw] shadow-black flex items-center">
                        <div className="flex flex-col items-start">
                            <span className="text-[#B28F4C] text-2xl font-cinzel font-bold">10,000</span>
                            <span className="text-white text-lg font-cinzel font-bold">Active Players</span>
                        </div>
                        <img src="/Active.svg" alt="Photo Icon" className="h-8 w-8 object-cover rounded-full ml-auto" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:justify-center gap-4 mt-4 md:ml-[5%]">
                    {/* Total Players */}
                    <div className="bg-[#724829] rounded-lg shadow-lg p-4 h-[16vh] w-[90vw] md:w-[18vw] shadow-black flex items-center">
                        <div className="flex flex-col items-start">
                            <span className="text-[#B28F4C] text-2xl font-cinzel font-bold">50,000</span>
                            <span className="text-white text-lg font-cinzel font-bold">Total Players</span>
                        </div>
                        <img src="/TotalP.svg" alt="Photo Icon" className="h-8 w-8 object-cover rounded-full ml-auto" />
                    </div>

                    {/* Stories Created */}
                    <div className="bg-[#482F1C] rounded-lg shadow-lg p-4 h-[16vh] w-[90vw] md:w-[18vw] shadow-black flex items-center">
                        <div className="flex flex-col items-start">
                            <span className="text-[#B28F4C] text-2xl font-cinzel font-bold">2,500</span>
                            <span className="text-white text-lg font-cinzel font-bold">Stories Created</span>
                        </div>
                        <img src="/Stories.svg" alt="Photo Icon" className="h-8 w-8 object-cover rounded-full ml-auto" />
                    </div>
                </div>
            </div>
        </>

    );
};

export default AdminDashboard;
