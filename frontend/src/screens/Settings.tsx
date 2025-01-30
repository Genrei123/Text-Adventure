import React from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import './Settings.css'; // Import CSS file for styling

const Settings: React.FC = () => {
    return (
        <div className="settings-container">
            <Sidebar />
            <div className="settings-content">
                <h1>Settings Page</h1>
                <p>This is a mock settings page.</p>
            </div>
        </div>
    );
};

export default Settings;
    