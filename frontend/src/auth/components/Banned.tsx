import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import LoadingBook from '../../components/LoadingBook';

const Banned: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { navigateWithLoading } = useLoading();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract ban information from location state
  const banInfo = location.state?.banInfo || {
    reason: 'Violation of community guidelines',
    banType: 'temporary',
    endDate: null
  };

  // Log the ban info for debugging
  useEffect(() => {
    console.log('Ban Info received:', banInfo);
  }, [banInfo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate days remaining for temporary bans
  const calculateTimeRemaining = () => {
    if (banInfo.banType !== 'temporary' || !banInfo.endDate) {
      return null;
    }

    const endDate = new Date(banInfo.endDate);
    const now = new Date();
    
    if (endDate <= now) {
      return 'Your ban has expired. Please try logging in again.';
    }

    const diffTime = Math.abs(endDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return diffDays > 0 
      ? `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining` 
      : `${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
  };

  const handleAppeal = () => {
    // Placeholder for appeal functionality
    alert('Appeal functionality will be available soon.');
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-[#1E1E1E] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-64 h-64 relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            >
              <source src="/loading-book.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="mt-4 text-[#C8A97E] font-cinzel text-xl animate-pulse text-center">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#2A2A2A] rounded-lg p-8 shadow-lg">
        <h1 className="text-5xl font-cinzel text-[#C8A97E] mb-6 text-center">Account Suspended</h1>
        
        <div className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4">
            <svg className="w-full h-full text-[#C8A97E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <p className="text-[#8B7355] text-xl font-playfair mb-2">
            Your account has been {banInfo.banType === 'permanent' ? 'permanently banned' : 'temporarily suspended'}.
          </p>
          
          {banInfo.banType === 'temporary' && banInfo.endDate && (
            <p className="text-[#C8A97E] text-lg font-bold mb-4">
              {calculateTimeRemaining()}
            </p>
          )}
        </div>
        
        <div className="bg-[#3D2E22] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-cinzel text-[#C8A97E] mb-2">Reason for {banInfo.banType === 'permanent' ? 'Ban' : 'Suspension'}:</h2>
          <p className="text-white font-playfair">{banInfo.reason || 'Violation of community guidelines'}</p>
        </div>
        
        <div className="text-center space-y-4">
          {banInfo.banType === 'temporary' && (
            <button
              onClick={handleAppeal}
              className="px-6 py-3 bg-[#6A4E32] text-[#C8A97E] rounded-lg hover:bg-[#7A5E42] transition-colors font-cinzel text-lg"
            >
              Appeal This Decision
            </button>
          )}
          
          <div>
            <button
              onClick={() => navigateWithLoading('/')}
              className="px-6 py-2 text-[#8B7355] hover:text-[#C8A97E] transition-colors font-cinzel"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banned; 