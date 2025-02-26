import React from 'react';
import Sidebar from './Components/Sidebar';

const AdminPlayerList: React.FC = () => {
    return (
        <div className="bg-[#2F2118] min-h-screen text-white">
        <Sidebar />
            <h1 className="text-2xl font-bold p-4">Admin Banned List</h1>
            {/* Add your player list content here */}
        </div>
    );
};

export default AdminPlayerList;