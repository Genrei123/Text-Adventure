import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axiosConfig';
import LoadingScreen from '../components/LoadingScreen';

interface NavbarContextType {
  showLogoutModal: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  handleLogout: () => Promise<void>;
  username: string | null;
  setUsername: (username: string | null) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

interface NavbarProviderProps {
  children: React.ReactNode;
  onLogout?: () => Promise<void>;
}

export const NavbarProvider: React.FC<NavbarProviderProps> = ({ children, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [username, setUsername] = useState<string | null>(localStorage.getItem('email'));
  const [showLoading, setShowLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [logoutTransition, setLogoutTransition] = useState(false);
  const navigate = useNavigate();

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = async () => {
    try {
      // Start the logout transition
      setLogoutTransition(true);
      
      // Close the modal with a slight delay
      setTimeout(() => {
        closeLogoutModal();
        
        // After the modal is closed, show the loading screen
        setTimeout(() => {
          setLogoutTransition(false);
          setShowLoading(true);
          setFadeIn(false);
          
          // Perform logout operations
          axiosInstance.post('/auth/logout', {
            email: localStorage.getItem('email'),
          }).then(() => {
            localStorage.removeItem('userData');
            localStorage.removeItem('email');
            localStorage.removeItem('token');
            
            setUsername(null);
            
            if (onLogout) {
              onLogout();
            }
            
            // Fade out loading screen after a delay
            setTimeout(() => {
              setFadeOut(true);
              
              // Navigate after fade out animation completes
              setTimeout(() => {
                navigate('/login');
                
                // Reset loading states after navigation
                setTimeout(() => {
                  setShowLoading(false);
                  setFadeOut(false);
                }, 100);
              }, 500);
            }, 1500);
          }).catch(error => {
            console.error('Error during logout:', error);
            setShowLoading(false);
          });
        }, 300);
      }, 200);
    } catch (error) {
      console.error('Error during logout:', error);
      setLogoutTransition(false);
      setShowLoading(false);
    }
  };

  return (
    <NavbarContext.Provider
      value={{
        showLogoutModal,
        openLogoutModal,
        closeLogoutModal,
        handleLogout,
        username,
        setUsername
      }}
    >
      {/* Logout Transition Overlay */}
      {logoutTransition && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}
      
      {children}
      
      {/* Loading Screen */}
      {showLoading && (
        <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />
      )}
    </NavbarContext.Provider>
  );
};

export default NavbarContext;
