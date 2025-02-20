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
import GameCreation  from './GameCreation/GameCreation';
import AdventureEditor from './GameCreation/Editing Page/Editor';
import ReviewPage from './review/ReviewPage';



function App() {
  // Add proper typing for username
  const [username, setUsername] = useState<string | null>(null);

  // Add proper typing for user parameter
  const handleLogin = (user: string) => {
    setUsername(user);
  };

  // Add proper typing for user parameter and isSocialLogin
  const handleRegister = (user: string, isSocialLogin: boolean) => {
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
        <Route path="/" element={<LandingPage />} />
        <Route path ="/login" element={<LoginScreen onLogin={handleLogin} />} />
        <Route path ="/register" element={<Register onRegister={handleRegister} />} />
        <Route path ="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path ="/home" element ={<Homepage onLogout={handleLogout} />} />
        <Route path ="/profile" element ={<UserProfile />} />
        <Route path ="/game" element ={<GameScreen />} />
        <Route path ="/subscription" element ={<Subscription />} />
        <Route path ="/editingpage" element ={< AdventureEditor/>} />
        <Route path ="/gamecreation" element={<GameCreation onBack={() => {}} onNext={() => {}} onSkip={() => {}} />} />
        <Route path ="/review" element ={< ReviewPage title={''} subtitle={''} reads={0} saves={0} comments={0} image={''}/>} />
      </Routes>
    </Router>
  );
}

export default App;