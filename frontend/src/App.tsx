import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

// Main Components
import LandingPage from './landing/LandingPage';
import Homepage from './home/Homepage';
import UserProfile from './profile/UserProfile';
import GameScreen from './game/GameScreen';
import GameDetails from './game-details/GameDetails';
import Subscription from './subscription/Subscription';
// Game Creation Components
import GameCreation from './game-creation/GameCreation';
import AdventureEditor from './game-creation/Editing Page/Editor';
import { WebSocketProvider } from './websocket/context/WebSocketContext';
import ActivePlayerCount from './websocket/components/ActivePlayerCount';
import NihGameScreen from './game/NihGameScreen';

function App() {
  const [username, setUsername] = useState<string | null>(null);

  // Auth handlers
  const handleLogin = (user: string): void => setUsername(user);
  const handleLogout = (): void => setUsername(null);
  const handleRegister = (user: string, isSocialLogin: boolean): void => {
    if (isSocialLogin) setUsername(user);
  };

  // WebSocket wrapper component
  const WebSocketRoutes = ({ children }: { children: React.ReactNode }) => (
    <WebSocketProvider>{children}</WebSocketProvider>
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
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
            <WebSocketProvider>
              <GameScreen />
            </WebSocketProvider>
          } 
        />
        <Route path="/editing-page" element={<AdventureEditor />} />
        <Route 
          path="/game-creation" 
          element={
            <GameCreation 
              onBack={() => {}} 
              onNext={() => {}} 
              onSkip={() => {}} 
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
        
        {/* Utility Routes */}
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/active-players" element={<ActivePlayerCount />} />
        
        {/* Error Routes */}
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;