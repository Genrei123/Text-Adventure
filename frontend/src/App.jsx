import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import UserProfile from './screens/UserProfile';
import GameScreen from './screens/GameScreen';
import Homepage from './screens/Homepage';
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
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/" element={<GameScreen />} />
        <Route path="/homepage" element={<Homepage username={username} onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
