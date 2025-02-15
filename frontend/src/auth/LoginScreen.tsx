import React from 'react';
import Login from './components/Login';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    return <Login onLogin={onLogin} />;
};

export default LoginScreen;