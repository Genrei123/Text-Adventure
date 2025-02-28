import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  percentChange: number;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  percentChange, 
  icon 
}) => {
  const isPositive = percentChange >= 0;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value.toLocaleString()}
          </p>
        </div>
        {icon && (
          <div className="bg-blue-100 p-3 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center">
        <span className={`inline-flex items-center text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '▲' : '▼'}
          <span className="ml-1">
            {Math.abs(percentChange)}%
          </span>
        </span>
        <span className="text-gray-500 text-sm ml-2">
          last 7 days
        </span>
      </div>
    </div>
  );
};

export default MetricCard;