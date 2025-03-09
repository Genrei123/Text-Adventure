import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  active, 
  collapsed,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-600' 
          : 'hover:bg-gray-800 hover:text-white'
      }`}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      {!collapsed && (
        <span className="ml-3 font-medium">{label}</span>
      )}
    </div>
  );
};

export default SidebarItem;