import React from 'react';

const PromptConfigSection: React.FC = () => {
  return (
    <div className="p-6 bg-[#2F2118] text-white">
      <h2 className="text-2xl font-bold mb-6">Prompt Configuration</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-cinzel text-white mb-2">Prompt Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
          />
        </div>

        <div>
          <label className="block text-sm font-cinzel text-white mb-2">Prompt Text</label>
          <textarea
            className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
          />
        </div>

        <div>
          <label className="block text-sm font-cinzel text-white mb-2">Model</label>
          <select className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white">
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PromptConfigSection;