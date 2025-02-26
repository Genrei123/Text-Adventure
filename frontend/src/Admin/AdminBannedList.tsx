import React from 'react';
import Sidebar from './Components/Sidebar';

const BannedList: React.FC = () => {
    return (
        <div className="bg-[#2F2118] min-h-screen text-white flex flex-col md:flex-row">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center p-4">
                <h1 className="text-white text-[4vh] font-cinzel mb-4">
                    Banned List
                </h1>

                <div className="w-[90%] sm:w-[75%] md:w-[5%] lg:w-[55%] bg-[#634630] rounded-lg p-4 shadow-lg transition-all duration-500 ease-in-out">
                    <div className="overflow-x-auto max-h-[50vh]">
                        <table className="w-full text-center border-collapse">
                            <thead className="bg-[#150F0B]">
                                <tr>
                                    <th className="p-2">Username</th>
                                    <th className="p-2">Reason</th>
                                    <th className="p-2">Ban Duration</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="p-2">Data {index * 4 + 1}</td>
                                        <td className="p-2">Data {index * 4 + 2}</td>
                                        <td className="p-2">Data {index * 4 + 3}</td>
                                        <td className="p-2">Action {index + 1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="w-full flex justify-start mt-4">
                    <button className="px-4 py-2 bg-[#634630] text-white rounded-lg shadow-lg transition-all duration-500 ease-in-out hover:bg-[#4e3625]">
                        Reported Players
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannedList;
