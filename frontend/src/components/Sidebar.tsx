import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {

    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
        return null;
    }

    const userData = JSON.parse(storedUserData);
    const username = userData.username;
    return (
        <>
            <div className="hidden md:block w-1/15 h-10 p-6 absolute top-15 left-0 md:w-1/15 md:h-[calc(127vh-4rem)] md:p-6">
                <ul className="space-y-2 md:space-y-0 md:flex md:flex-col">
                    <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                        <Link to="/home">
                            <img src="/Home.svg" className="w-9 h-9 group-hover:opacity-0" />
                            <img src="/Home-after.svg" className="w-9 h-9 absolute top-0 left-3 opacity-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                    
                    <br />
                    <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                        <Link to={`/${username}`}>
                            <img src="/Settings.svg" className="w-9 h-9 group-hover:opacity-0" />
                            <img src="/Settings-After.svg" className="w-9 h-9 absolute top-0 left-3 opacity-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                    <br />
                    <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                        <Link to="/game">
                            <img src="/Message.svg" className="w-13 h-13 group-hover:opacity-0" />
                            <img src="/Message-After.svg" className="w-13 h-13 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                    <br />
                    <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                        <Link to="/subscription">
                            <img src="/Shop.svg" className="w-19 h-19 group-hover:opacity-0" />
                            <img src="/Shop-after.svg" className="w-15 h-15 absolute top-0 left-3.3 opacity-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="block md:hidden w-full p-1 top-[calc(45%+4%)] left-0 h-[calc(55%-2%)] absolute bg-[#2F2118] stroke-[#1e1e1e] stroke-2">
                <ul className="flex justify-around">
                    <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                        <Link to="/home">
                            <img src="/Home.svg" className="w-6 h-6 group-hover:opacity-0" />
                            <img src="/Home-after.svg" className="w-6 h-6 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                    <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                        <Link to="/settings">
                            <img src="/Settings.svg" className="w-6 h-6 group-hover:opacity-0" />
                            <img src="/Settings-After.svg" className="w-6 h-6 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                    <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                        <Link to="/message">
                            <img src="/Message.svg" className="w-8 h-8 group-hover:opacity-0" />
                            <img src="/Message-After.svg" className="w-8 h-8 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                    <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                        <Link to="/subscription">
                            <img src="/Shop.svg" className="w-5 h-5 group-hover:opacity-0" />
                            <img src="/Shop-after.svg" className="w-5 h-5 absolute top-0 left-3.3 opacity-0 group-hover:opacity-100" />
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;