import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './landing/LandingPage';
import LoginScreen from './auth/LoginScreen';
import Register from './auth/components/Register';
import ForgotPassword from './auth/components/ForgotPassword';
import ResetPassword from './auth/components/ResetPassword';
import VerifyEmail from './auth/components/VerifyEmail';
import Homepage from './home/Homepage';
import UserProfile from './profile/UserProfile';
import GameScreen from './game/GameScreen';
import Subscription from './subscription/Subscription';
import EmailConfirmation from './auth/components/EmailConfirmation';
import Forbidden from './auth/components/Forbidden';
import ServerError from './auth/components/ServerError';
import Unauthorized from './auth/components/Unauthorized';
import NotFound from './auth/components/NotFound';
import { WebSocketProvider } from './websocket/context/WebSocketContext';
import ActivePlayerCount from './websocket/components/ActivePlayerCount';




function App() {
  const [username, setUsername] = useState<string | null>(null);

  const handleLogin = (user: string): void => {
    setUsername(user);
  };

  const handleRegister = (user: string, isSocialLogin: boolean): void => {
    if (isSocialLogin) {
      setUsername(user);
    }
  };

  const handleLogout = (): void => {
    setUsername(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/home" element={<WebSocketProvider><Homepage onLogout={handleLogout} /></WebSocketProvider>} />
        <Route path="/profile" element={<WebSocketProvider><UserProfile /></WebSocketProvider>} />
        <Route path="/game" element={<WebSocketProvider><GameScreen /></WebSocketProvider>} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;