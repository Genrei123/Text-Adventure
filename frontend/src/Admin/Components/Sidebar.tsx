import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Activity, Users, UserPlus, LineChart } from 'lucide-react';

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void, collapsed: boolean }> = ({ icon, label, active, onClick, collapsed }) => (
  <button
    className={`flex items-center w-full p-2 text-left ${active ? 'bg-gray-700' : 'hover:bg-gray-700'} ${collapsed ? 'justify-center' : 'justify-start'}`}
    onClick={onClick}
  >
    {icon}
    {!collapsed && <span className="ml-2">{label}</span>}
  </button>
);

const Sidebar: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      <div className="flex items-center justify-between p-4 bg-gray-900">
        {!sidebarCollapsed && <h2 className="text-xl font-bold tracking-tight">Admin Console</h2>}
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
          <ArrowLeftRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-1">
        <SidebarItem
          icon={<Activity className="w-5 h-5" />}
          label="Dashboard"
          active={activeSection === 'dashboard'}
          onClick={() => setActiveSection('dashboard')}
          collapsed={sidebarCollapsed}
        />
        <SidebarItem
          icon={<Users className="w-5 h-5" />}
          label="Player Directory"
          active={activeSection === 'players'}
          onClick={() => setActiveSection('players')}
          collapsed={sidebarCollapsed}
        />
        <SidebarItem
          icon={<UserPlus className="w-5 h-5" />}
          label="User Management"
          active={activeSection === 'users'}
          onClick={() => setActiveSection('users')}
          collapsed={sidebarCollapsed}
        />
        <div className="px-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Analytics</p>
          <SidebarItem
            icon={<LineChart className="w-5 h-5" />}
            label="Reports"
            active={activeSection === 'reports'}
            onClick={() => setActiveSection('reports')}
            collapsed={sidebarCollapsed}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
