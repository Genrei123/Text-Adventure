// filepath: /c:/Users/Ervhyne/Documents/VS PROJECTS/Text-Adventure/frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import EmailConfirmation from './components/EmailConfirmation';
import SuccessConfirmation from './components/SuccessConfirmation';
import UserProfile from './screens/UserProfile';
import GameScreen from './screens/GameScreen';
import Homepage from './screens/Homepage';
import ActivePlayerCount from './components/ActivePlayerCount'; // Import the new component
import { WebSocketProvider } from './context/WebSocketContext'; // Import the WebSocket provider
import VerifyEmail from './components/VerifyEmail';
import ReviewPage from './screens/ReviewPage';
import GameCard from './components/GameCard';
import './theme/LoginTheme.css';
import './App.css';

function App() {
  const [username, setUsername] = useState(null);

  const handleLogin = (user) => {
    setUsername(user);
  };

  const handleRegister = (user, isSocialLogin) => {
    if (isSocialLogin) {
      setUsername(user);
    }
  };

  const handleLogout = () => {
    setUsername(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/success-confirmation" element={<SuccessConfirmation />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage username={username} onLogout={handleLogout} />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/" element={<Homepage username={username} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/success-confirmation" element={<SuccessConfirmation />} />
        <Route path="/profile" element={<WebSocketProvider><UserProfile /></WebSocketProvider>} />
        <Route path="/gamescreen" element={<WebSocketProvider><GameScreen /></WebSocketProvider>} />
        <Route path="/homepage" element={<WebSocketProvider><Homepage username={username} onLogout={handleLogout} /></WebSocketProvider>} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/active-players" element={<WebSocketProvider><ActivePlayerCount /></WebSocketProvider>} />
        <Route path="/gameCard" element={<GameCard />} />
      </Routes>
    </Router>
  );
} 
/* Use the WebSocketProvider "</WebSocketProvider>" component to wrap the components that need websocket 
connections for real-time updates on the frontend*/

export default App;