import React from 'react';
import Sidebar from './Components/Sidebar';

const AdminDashboard: React.FC = () => {
    return (
        <>
        <div className="bg-[#2F2118] min-h-screen flex items-center justify-center">
            <Sidebar/>
            <h1 className="text-white text-2xl absolute top-[15%] left-1/2 transform -translate-x-1/2 font-cinzel">
                Sage Dashboard
            </h1>








            <div className="bg-[#634630] rounded-lg shadow-lg p-1 h-[25vh] w-[40vw] shadow-black absolute top-[22%] left-[43%] transform -translate-x-1/2 hidden md:block">
                <div className="flex justify-end items-center h-full mr-4">
                    <div className="flex flex-col items-start justify-center h-full ml-4"></div>
                    <img src="/Total.svg" alt="Photo Icon" className="h-32 w-32 object-cover rounded-full" />
                </div></div>    
            </div>



            <div className="bg-[#503E31] rounded-lg shadow-lg p-1 h-[20vh] w-[20vw] shadow-black absolute top-[22%] left-[75%] transform -translate-x-1/2 hidden md:block">
            
            <div className="flex justify-end items-center h-full mr-4">
                    <img src="/Active.svg" alt="Photo Icon" className="h-10 w-10 object-cover rounded-full" />
                </div>
            </div>
            



            <div className="bg-[#724829] rounded-lg shadow-lg p-1 h-[20vh] w-[20vw] shadow-black absolute top-[50%] left-[33%] transform -translate-x-1/2 hidden md:block">
            <div className="flex justify-end items-center h-full mr-4">
                    <img src="/TotalP.svg" alt="Photo Icon" className="h-10 w-10 object-cover rounded-full" />
                </div></div>
            


            
            <div className="bg-[#482F1C] rounded-lg shadow-lg p-1 h-[20vh] w-[20vw] shadow-black absolute top-[50%] left-[55%] transform -translate-x-1/2 hidden md:block">
               <div className="flex justify-end items-center h-full mr-4">
                    <img src="/Stories.svg" alt="Photo Icon" className="h-10 w-10 object-cover rounded-full" />
                </div></div>
            
        
        </>

    );
};

export default AdminDashboard;
