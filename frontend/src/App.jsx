import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import Homepage from './screens/Homepage';
import Register from './components/Register';
import GameScreen from './screens/GameScreen';
import './theme/LoginTheme.css'
import "./App.css"; 

function App() {
  const [username, setUsername] = useState(null);
  
  const handleLogin = (user) => {
    setUsername(user);
  };

  /**
   * Handles user registration
   * For social logins: Sets username immediately
   * For form registration: Waits for login
   * 
   * @param {string} user - Username
   * @param {boolean} isSocialLogin - Whether this is a social login
   */
  const handleRegister = (user, isSocialLogin) => {
    if (isSocialLogin) {
      // For social logins, set username immediately
      setUsername(user);
    }
    // For regular registration, don't set username - wait for login
  };

  const handleLogout = () => {
    setUsername(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Homepage username={username} onLogout={handleLogout} />}
        />
        <Route 
          path="/login" 
          element={
            username ? 
              <Navigate to="/" /> : 
              <LoginScreen onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            username ? 
              <Navigate to="/" /> : 
              <Register onRegister={handleRegister} />
          } 
        />
      <Route 
        path =   "/homepage"
        element = {<Homepage username={username} onLogout={handleLogout} />}
      />
      <Route 
        path = "/GameScreen"
        element = {<GameScreen/>}
      />
      </Routes>
    </Router>
  );
}

export default App;
