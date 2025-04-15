import React from 'react';
import Modal from 'react-modal';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onLogout }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Logout Confirmation"
      className="bg-[#2A1F17] border-2 border-[#C8A97E] rounded-lg p-6 w-[500px] mx-auto mt-[15%] shadow-lg outline-none  "
      overlayClassName="fixed top-[-200px] inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
    >
      <h2 className="font-cinzel text-xl text-[#E5D4B3] mb-4 text-center">Leave the Realm?</h2>
      <p className="text-[#C8A97E] mb-6 text-center">
        Are you sure you wish to depart from these mystical lands? Your journey will be paused until your return.
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#E5D4B3] rounded border border-[#C8A97E]"
        >
          Stay
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-[#8B4513] hover:bg-[#723A10] text-[#E5D4B3] rounded border border-[#C8A97E]"
        >
          Leave
        </button>
      </div>
    </Modal>
  );
};

export default LogoutModal;
