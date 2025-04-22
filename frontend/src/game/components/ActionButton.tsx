import React from 'react';

interface ActionButtonProps {
    action: string;
    isSelected: boolean;
    disabled?: boolean;
    onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, isSelected, onClick }) => {
    return (
        <button
            className={`px-4 py-2 rounded-lg font-playfair text-lg transition-colors ${
                isSelected
                    ? 'bg-[#634630] text-[#E5D4B3]'
                    : 'bg-[#311F17] text-white hover:bg-[#4A2E22]'
            }`}
            onClick={onClick}
        >
            {action}
        </button>
    );
};

export default ActionButton;