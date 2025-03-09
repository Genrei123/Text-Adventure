import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Paper } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: number;
  percentChange?: number;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, percentChange }) => (
  <Paper className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-gray-50 to-white">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
        {icon}
      </div>
    </div>
    {percentChange && (
      <div className="mt-2 flex items-center text-sm">
        <span className={`${percentChange > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {percentChange > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          {Math.abs(percentChange)}%
        </span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    )}
  </Paper>
);

export default MetricCard;