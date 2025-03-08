import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

interface LoadingContextType {
  navigateWithLoading: (to: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const navigateWithLoading = useCallback(async (to: string) => {
    // Start fade out of current content
    setFadeOut(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Show loading screen
    setLoading(true);
    setFadeIn(true);
    
    // Reset fade states after a brief delay
    setTimeout(() => {
      setFadeIn(false);
      setFadeOut(false);
    }, 500);

    // Minimum loading time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate
    navigate(to);
    
    // Wait for content to load
    const checkLoaded = () => {
      if (document.readyState === 'complete') {
        setFadeOut(true);
        setTimeout(() => {
          setLoading(false);
          setFadeOut(false);
        }, 500);
      } else {
        requestAnimationFrame(checkLoaded);
      }
    };
    
    requestAnimationFrame(checkLoaded);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <LoadingContext.Provider value={{ navigateWithLoading }}>
        {loading && (
          <LoadingScreen 
            fadeIn={fadeIn} 
            fadeOut={fadeOut} 
          />
        )}
        <div 
          className={`min-h-screen bg-[#1E1E1E] transition-all duration-300 ease-in-out
            ${loading ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}
          style={{ 
            backgroundColor: '#1E1E1E',
            position: 'relative',
            zIndex: loading ? 0 : 1 
          }}
        >
          {children}
        </div>
      </LoadingContext.Provider>
    </div>
  );
};

export default LoadingProvider; 