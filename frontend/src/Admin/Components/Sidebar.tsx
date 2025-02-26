import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
    <> 
        <div className="bg-[#1e1e1e] w-17 md:w-40 lg:w-60 h-screen fixed left-0 shadow-[10px_0_15px_-3px_rgba(0,0,0,10)] flex flex-col items-center justify-start pt-40 hidden md:flex overflow-hidden">
            <h1 className="text-white text-xl md:text-2xl lg:text-3xl mb-8 absolute top-20">Admin Page</h1>
            <Link to="/Admin/Dashboard">
            <button className="group flex items-center w-full px-7 py-2 text-white hover:bg-[#333] mb-4 justify-start">
            <img src="/Dashboard.svg" alt="Dashboard Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/Dashboard-after.svg" alt="Dashboard Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            <span className="ml-2 group-hover:text-[#C9B57B] hidden md:inline">Dashboard</span>
            </button>
            </Link>
            <Link to="/Admin/Banned">
            <button className="group flex items-center w-full px-7 py-2 text-white hover:bg-[#333] mb-4 justify-start">
            <img src="/Ban.svg" alt="Banned Players Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/Ban-after.svg" alt="Banned Players Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            <span className="ml-2 group-hover:text-[#C9B57B] hidden md:inline">Banned</span>
            </button>
            </Link>    
            <Link to="/Admin/PlayerList">
            <button className="group flex items-center w-full px-7 py-2 text-white hover:bg-[#333] justify-start">
            <img src="/List.svg" alt="Player List Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/List-after.svg" alt="Player List Icon Hover" className="w-7 h-7 hidden group-hover:block" />
            <span className="ml-2 group-hover:text-[#C9B57B] hidden md:inline">Players</span>
            </button>
            </Link>
            <div className="bg-[#B28F4C] rounded-full h-10 w-20 fixed left-[1%] bottom-10 flex items-center justify-center md:w-40 mx-4">
            <button className="group flex items-center w-full px-7 py-2 text-white hover:bg-[#9C551F] rounded-full justify-center">
                <span className="group-hover:text-[#ffffff] md:inline">Logout</span>
            </button>
            </div>
        </div>  

        <div className="bg-[#1e1e1e] w-full h-12 fixed top-0 shadow-[0_10px_15px_-3px_rgba(0,0,0,10)] flex items-center justify-around pt-10 md:hidden">
            <h1 className="text-white text-xl mb-2 translate-y-[-40%]">Admin Page</h1>
            <button className="group flex items-center px-4 py-1 text-white hover:bg-[#333] mb-4 -translate-y-2">
            <img src="/Dashboard.svg" alt="Dashboard Icon" className="w-7 h-7 group-hover:hidden" />
            <img src="/Dashboard-after.svg" alt="Dashboard Icon Hoyver" className="w-7 h-7 hidden group-hover:block" />
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
