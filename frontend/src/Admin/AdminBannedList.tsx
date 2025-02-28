import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Users, 
  UserPlus, 
  BookOpen, 
  BarChart3, 
  Ban 
} from 'lucide-react';
import Sidebar from './Components/Sidebar';
import MetricCard from './MetricCard';
import SidebarItem from './SidebarItem';

const AdminBannedList: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const dashboardData = {
    registeredUsers: 234324,
    registeredUsersChange: 2.6,
    activeUsers: 18765,
    activeUsersChange: 2.6,
    totalPlayers: 4876,
    totalPlayersChange: 0.2,
    storiesCreated: 678,
    storiesCreatedChange: -0.1,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!sidebarCollapsed && <h2 className="text-xl font-bold truncate">Admin Panel</h2>}
          <button 
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-2 space-y-1">
          <SidebarItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeSection === 'dashboard'} 
            onClick={() => setActiveSection('dashboard')}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem 
            icon={<Ban className="w-5 h-5" />} 
            label="Banned Players" 
            active={activeSection === 'banned'} 
            onClick={() => setActiveSection('banned')}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem 
            icon={<Users className="w-5 h-5" />} 
            label="Player List" 
            active={activeSection === 'players'} 
            onClick={() => setActiveSection('players')}
            collapsed={sidebarCollapsed}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
        
        {activeSection === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="Total Registered Users" 
              value={dashboardData.registeredUsers} 
              percentChange={dashboardData.registeredUsersChange} 
              icon={<UserPlus className="w-6 h-6" />}
            />
            <MetricCard 
              title="Total Active Users" 
              value={dashboardData.activeUsers} 
              percentChange={dashboardData.activeUsersChange} 
              icon={<Users className="w-6 h-6" />}
            />
            <MetricCard 
              title="Total Players" 
              value={dashboardData.totalPlayers} 
              percentChange={dashboardData.totalPlayersChange} 
              icon={<Users className="w-6 h-6" />}
            />
            <MetricCard 
              title="Stories Created" 
              value={dashboardData.storiesCreated} 
              percentChange={dashboardData.storiesCreatedChange} 
              icon={<BookOpen className="w-6 h-6" />}
            />
          </div>
        )}

        {activeSection !== 'dashboard' && (
          <div className="p-6 bg-white rounded-xl shadow-sm">
            {activeSection === 'banned' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Banned Players</h2>
                {/* Add banned players table here */}
              </div>
            )}
            {activeSection === 'players' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Player List</h2>
                {/* Add players table here */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBannedList;
