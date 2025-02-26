import React from 'react';

const Sidebar: React.FC = () => {
    return (
    <> 
        <div className="bg-[#1e1e1e] w-17 md:w-40 lg:w-60 h-screen fixed left-0 shadow-[10px_0_15px_-3px_rgba(0,0,0,10)] flex flex-col items-center justify-start pt-40 hidden md:flex">
            <h1 className="text-white text-xl md:text-2xl lg:text-3xl mb-8 absolute top-20">Admin Page</h1>
            <button className="group flex items-center w-full px-7 py-2 text-white hover:bg-[#333] mb-4">
            <img src="/Dashboard.svg" alt="Dashboard Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/Dashboard-after.svg" alt="Dashboard Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            <span className="ml-2 group-hover:text-[#C9B57B] hidden md:inline">Dashboard</span>
            </button>
            <button className="group flex items-center w-full px-7 py-2 text-white hover:bg-[#333] mb-4">
            <img src="/Ban.svg" alt="Banned Players Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/Ban-after.svg" alt="Banned Players Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            <span className="ml-2 group-hover:text-[#C9B57B] hidden md:inline">Banned Players</span>
            </button>
            <button className="group flex items-center w-full px-7 py-2 text-white hover:bg-[#333]">
            <img src="/List.svg" alt="Player List Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/List-after.svg" alt="Player List Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            <span className="ml-2 group-hover:text-[#C9B57B] hidden md:inline">Player List</span>
            </button>
        </div>  

        <div className="bg-[#1e1e1e] w-full h-12 fixed top-0 shadow-[0_10px_15px_-3px_rgba(0,0,0,10)] flex items-center justify-around pt-10 md:hidden">
            <h1 className="text-white text-xl mb-2 translate-y-[-40%]">Admin Page</h1>
            <button className="group flex items-center px-4 py-1 text-white hover:bg-[#333] mb-4 -translate-y-2">
            <img src="/Dashboard.svg" alt="Dashboard Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/Dashboard-after.svg" alt="Dashboard Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            </button>
            <button className="group flex items-center px-4 py-1 text-white hover:bg-[#333] mb-4 -translate-y-2">
            <img src="/Ban.svg" alt="Banned Players Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/Ban-after.svg" alt="Banned Players Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            </button>
            <button className="group flex items-center px-4 py-1 text-white hover:bg-[#333] mb-4 -translate-y-2">
            <img src="/List.svg" alt="Player List Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/List-after.svg" alt="Player List Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            </button>
        </div>
    </>
    );
};

export default Sidebar;
