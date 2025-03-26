import React from 'react';

const GameStats: React.FC = () => {
  return (
    <div className="p-6 bg-[#2F2118] text-white">
      <h2 className="text-2xl font-bold mb-6">Game Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#3D2E22] p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-cinzel mb-2">Total Games</h3>
          <p className="text-2xl font-bold">123</p>
        </div>

        <div className="bg-[#3D2E22] p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-cinzel mb-2">Active Games</h3>
          <p className="text-2xl font-bold">45</p>
        </div>

        <div className="bg-[#3D2E22] p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-cinzel mb-2">Most Popular Game</h3>
          <p className="text-2xl font-bold">Game Title</p>
        </div>
      </div>
    </div>
  );
};

export default GameStats;