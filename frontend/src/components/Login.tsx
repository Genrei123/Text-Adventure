import React, { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from '../axiosConfig/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
  onLogin: (username: string) => void;
}

interface ValidationErrors {
  username?: string;
  password?: string;
  general?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    toast.info('Logging in...');

    try {
      const response = await axios.post('/api/login', { email, password });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        onLogin(data.user.email);
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsProcessing(true);
    toast.info(`Connecting to ${provider}...`);

    try {
      // Redirect to backend's full URL
      window.location.href = `http://localhost:3000/auth/${provider.toLowerCase()}`;
    } catch (error) {
      console.error(`Error during ${provider} login:`, error);
      toast.error(`Failed to log in with ${provider}.`);
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" disabled={isProcessing}>Login</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
