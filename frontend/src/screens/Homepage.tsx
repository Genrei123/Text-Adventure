import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Interface for Homepage component props
 * @property {string} username - Optional username of the logged-in user
 * @property {function} onLogout - Callback function to handle user logout
 */
interface HomepageProps {
  username?: string;
  onLogout: () => void;
}

/**
 * Homepage Component
 * Displays the main landing page with conditional rendering based on authentication status
 * 
 * Features:
 * - Navigation bar with login/logout functionality
 * - Welcome message
 * - Conditional rendering of login/register buttons
 * 
 * @param {HomepageProps} props - Component props
 */
const Homepage: React.FC<HomepageProps> = ({ username, onLogout }) => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles user logout
   * Calls the onLogout callback and redirects to homepage
   */
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  /**
   * Handles navigation to login page
   * Used by the "Enter Realm" button when user is not logged in
   */
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
      {/* Navigation Bar Section */}
      <nav className="bg-[#3D2E22] py-2 px-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="text-xl font-cinzel text-[#C8A97E]">Sage.AI</div>
          
          {/* Auth Status & Actions */}
          <div className="flex items-center space-x-2">
            {username ? (
              // Logged-in user view
              <>
                <span className="font-playfair text-[#E5D4B3]">Welcome, {username}</span>
                <button 
                  className="bg-[#8B4513] hover:bg-[#723A10] px-3 py-1 rounded text-sm font-medium text-[#E5D4B3] border border-[#C8A97E]"
                  onClick={handleLogout}
                >
                  Leave Realm
                </button>
              </>
            ) : (
              // Non-logged-in user view
              <>
                <span className="font-playfair text-[#E5D4B3]">Not logged in</span>
                <button
                  className="bg-[#C8A97E] hover:bg-[#B39671] px-3 py-1 rounded text-sm font-medium text-[#1E1E1E] border border-[#E5D4B3]"
                  onClick={handleLogin}
                >
                  Enter Realm
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Welcome Header */}
        <h1 className="text-4xl font-bold font-cinzel text-[#C8A97E] mb-4">
          Welcome to the Sage.AI
        </h1>

        {/* Content Box */}
        <div className="bg-[#3D2E22] w-full max-w-3xl p-6 border-t border-b border-[#C8A97E]">
          {/* Welcome Message */}
          <p className="text-xl font-playfair text-[#E5D4B3] text-center mb-4">
            Your adventure awaits in this mystical world...
          </p>

          {/* Conditional Auth Actions */}
          {!username && (
            <div className="text-center">
              <p className="text-[#C8A97E] font-playfair mb-4">
                Please login or register to begin your journey
              </p>
              {/* Auth Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#C8A97E] hover:bg-[#B39671] px-6 py-2 rounded text-sm font-medium text-[#1E1E1E] border border-[#E5D4B3]"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-[#8B4513] hover:bg-[#723A10] px-6 py-2 rounded text-sm font-medium text-[#E5D4B3] border border-[#C8A97E]"
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage; 