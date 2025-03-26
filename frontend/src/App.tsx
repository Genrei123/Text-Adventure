import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingProvider from './context/LoadingContext';

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
import Subscription from './subscription/Subscription';

// Work in Progress Components [EXPERIMENTAL - Do not include in main app!]
import ImageGeneratorScreen from './game/separate-imgGen/chatImgGeneration';

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
          
          {/* Utility Routes */}
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/active-players" element={<ActivePlayerCount />} />
          <Route path="/ban-test" element={<BanTestPage />} />
          
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
        </Routes>
      </LoadingProvider>
    </Router>
  );
}

export default App;