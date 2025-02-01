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
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      toast.info('Logging in...');

      try {
        const response = await axios.post('/api/login', { email, password });
        const data = response.data;
        if (data.token) {
          localStorage.setItem('token', data.token);
          onLogin(data.user.email);
          toast.success('Login successful!');
          navigate('/');
        } else {
          setErrors({ general: data.message });
          toast.error(data.message);
        }
      } catch (error) {
        setErrors({ general: 'Login failed. Please try again.' });
        toast.error('Login failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-start bg-[#1E1E1E] md:bg-cover md:bg-center fade-in" style={{ backgroundImage: `url(${('/Login.jpg')})` }}>
      <img src={('/fadeLogin.png')} className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block" />
      {/* Left Side - Logo */}
      <div className="hidden md:block md:w-1/2 flex items-center justify-center h-screen"></div>
      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end p-4 md:p-0 mt-0 md:mt-0 md:mr-[250px] z-10">
        <div className="w-full max-w-[90%] md:w-[480px] relative">
          <h2 className="text-4xl font-cinzel text-white mb-12 text-center md:animate-none">Gates of Realm</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
                placeholder="Your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
                placeholder="Your password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>
            <button type="submit" className="w-full py-2 bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded font-cinzel" disabled={isProcessing}>
              Enter the Realm
            </button>
          </form>

          <div className="mt-8">
            <div className="text-center text-sm text-[#8B7355] mb-4">Enter Using</div>
            <div className="flex justify-center space-x-4">
              <button onClick={() => handleSocialLogin('Google')} className="p-2 rounded-full bg-[#3D2E22] hover:bg-[#4D3E32] disabled:opacity-50" disabled={isProcessing}>
                <FaGoogle className="text-[#8B7355]" size={20} />
              </button>
              <button onClick={() => handleSocialLogin('Facebook')} className="p-2 rounded-full bg-[#3D2E22] hover:bg-[#4D3E32] disabled:opacity-50" disabled={isProcessing}>
                <FaFacebook className="text-[#8B7355]" size={20} />
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-[#C8A97E] hover:text-[#D8B98E] text-sm">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <div className="text-[#8B7355] text-sm">Mark your Name in the History</div>
            <Link to="/register" className="text-[#C8A97E] hover:text-[#D8B98E] text-sm">
              Register
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
