import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import LoadingProvider from './context/LoadingContext';
import { NavbarProvider } from './context/NavbarContext';

// Auth Components
import LoginScreen from './auth/LoginScreen';
import Register from './auth/components/Register';
import ForgotPassword from './auth/components/ForgotPassword';
import ResetPassword from './auth/components/ResetPassword';
import VerifyEmail from './auth/components/VerifyEmail';
import EmailConfirmation from './auth/components/EmailConfirmation';
import Forbidden from './auth/components/Forbidden';
import ServerError from './auth/components/ServerError';
import Unauthorized from './auth/components/Unauthorized';
import NotFound from './auth/components/NotFound';
import ProtectedRoute from './auth/components/ProtectedRoute';
import Banned from './auth/components/Banned';

// Main Components
import LandingPage from './landing/LandingPage';
import Homepage from './home/Homepage';
import UserProfile from './profile/UserProfile';
import GameScreen from './game/GameScreen';
import GameDetails from './game-details/GameDetails';

import AdminPage from './Admin/AdminPage';
import Subscription from './shop/Subscription';
import Shop from './shop/Shop';

// Work in Progress Components [EXPERIMENTAL - Do not include in main app!]
import ImageGeneratorScreen from './game/separate-imgGen/chatImgGeneration';
import ButtonExample from './components/ButtonExample';
import Footer from './components/Footer';
import AboutPage from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import FAQ from './components/FAQ';

// Game Creation Components
import GameCreation from './game-creation/GameCreation';
import AdventureEditor from './game-creation/Editing Page/Editor';
import { WebSocketProvider } from './websocket/context/WebSocketContext';
import ActivePlayerCount from './websocket/components/ActivePlayerCount';
import NihGameScreen from './game/NihGameScreen';
import BanTestPage from './pages/BanTestPage';

// Session Components
import SessionTracker from './sessions/components/SessionTracker';
import { clearSession } from './sessions/api-calls/visitedPagesSession';
import AdminLogin from './Admin/AdminLogin';

// Admin Components
import AdminRoute from './Admin/components/AdminRoute';
import GamesList from './Admin/Games/GamesList';
import GameDetail from './Admin/Games/GameDetail';
import GameForm from './Admin/Games/GameForm';

//Modal
import Modal from 'react-modal';

Modal.setAppElement('#root');

// ScrollToTop component to handle scrolling to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitedPages, setVisitedPages] = useState<string[]>([]);

  

  // Auth handlers
  const handleLogin = (user: string): void => setUsername(user);
  const handleLogout = async (): Promise<void> => {
    if (sessionId) {
      try {
        await clearSession(sessionId, visitedPages);
        console.log('Session cleared');
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
    setUsername(null);
    setSessionId(null);
    setVisitedPages([]);
  };
  const handleRegister = (user: string, isSocialLogin: boolean): void => {
    if (isSocialLogin) setUsername(user);
  };

  // Add event listener for beforeunload to handle browser close or refresh
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (sessionId) {
        try {
          await clearSession(sessionId, visitedPages);
        } catch (error) {
          console.error('Error handling beforeunload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId, visitedPages]);

  // WebSocket wrapper component
  const WebSocketRoutes = ({ children }: { children: React.ReactNode }) => (
    <WebSocketProvider>{children}</WebSocketProvider>
  );

  return (
    <Router>
      <LoadingProvider>
        <NavbarProvider onLogout={handleLogout}>
          <ScrollToTop />
          {username && (
            <SessionTracker
              email={username}
              setSessionId={setSessionId}
              visitedPages={visitedPages}
              setVisitedPages={setVisitedPages}
            />
          )}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="/game/nih/:id" element={<NihGameScreen />} />
            
            {/* Auth Related Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            
            {/* Protected Routes with WebSocket */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <WebSocketProvider>
                      <Homepage onLogout={handleLogout} />
                  </WebSocketProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/:username" 
              element={
                <ProtectedRoute>
                  <WebSocketProvider>
                    <UserProfile />
                  </WebSocketProvider>
                </ProtectedRoute>
              } 
            />
            
            {/* Game Related Routes */}
            <Route 
              path="/game/:id" 
              element={
                <ProtectedRoute>
                  <WebSocketProvider>
                    <GameScreen />
                  </WebSocketProvider>
                </ProtectedRoute>
              } 
            />
            <Route path="/editing-page" element={<AdventureEditor />} />
            <Route 
              path="/game-creation" 
              element={
                <GameCreation 
                  onBack={() => {}} 
                  onNext={() => {}} 
                />
              } 
            />
            <Route 
              path="/game-details/:id" 
              element={
                <ProtectedRoute>
                  <WebSocketRoutes>
                    <GameDetails />
                  </WebSocketRoutes>
                </ProtectedRoute>
              } 
            />

            {/* Work in Progress Routes */}
            <Route path="/image-generator" element={<ImageGeneratorScreen />} />
            <Route path="/button" element={<ButtonExample />} />
            <Route path="/footer" element={<Footer />} />
            
            {/* Utility Routes */}
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/active-players" element={<ActivePlayerCount />} />
            <Route path="/ban-test" element={<BanTestPage />} />
            <Route path="/shop" element={<Shop />} />
            
            {/* Support Pages */}
            <Route path="/AboutUs" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Error Routes */}
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/banned" element={<Banned />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/game-details" element={<GameDetails />} />
            
            {/* Admin Routes */}
            <Route path="/Admin/Login" element={<AdminLogin />} />
            <Route 
              path="/Admin/Page" 
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/games" 
              element={
                <AdminRoute>
                  <GamesList />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/games/new" 
              element={
                <AdminRoute>
                  <GameForm />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/games/:id" 
              element={
                <AdminRoute>
                  <GameDetail />
                </AdminRoute>
              } 
            />
          </Routes>
        </NavbarProvider>
      </LoadingProvider>
    </Router>
  );
}

export default App;