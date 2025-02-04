import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import EmailConfirmation from './components/EmailConfirmation';
import SuccessConfirmation from './components/SuccessConfirmation';
import UserProfile from './screens/UserProfile';
import './theme/LoginTheme.css'
import "./App.css"; 
import ReviewPage from './screens/ReviewPage';
import GameScreen from './screens/GameScreen';
import Homepage from './screens/Homepage';
import ActivePlayerCount from './components/ActivePlayerCount'; // Import the new component

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
        <Route path="/" element={<Homepage username={username} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/success-confirmation" element={<SuccessConfirmation />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/GameScreen" element={<GameScreen />} />
        <Route path="/homepage" element={<Homepage username={username} onLogout={handleLogout} />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/active-players" element={<ActivePlayerCount />} />
      </Routes>
    </Router>
  );
}

export default App;