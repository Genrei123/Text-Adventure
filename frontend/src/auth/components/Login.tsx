import React, { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ValidatedInput from "./ValidatedInput";
import { ValidationUtils } from "../utils/ValidationUtils";
import { isAxiosError } from "axios";
import { LoginResponse } from "../types/User"; // Adjust the import path based on your folder structure
import { useLoading } from '../../context/LoadingContext';
import LoadingLink from '../../components/LoadingLink';
import LoadingScreen from '../../components/LoadingScreen';

interface LoginProps {
  onLogin: (username: string) => void;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { navigateWithLoading } = useLoading();
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  // Add this function to normalize email input as the user types
  const handleEmailChange = (value: string) => {
    // Convert email to lowercase as the user types
    setEmail(value.toLowerCase());
  };

  // Check if user is already logged in when component mounts
  useEffect(() => {
    // Clear any existing tokens
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userData");

    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance
        .post("/auth/verify-token", { token })
        .then((response) => {
          if (response.data.valid) {
            navigateWithLoading("/home");
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("email");
        });
    }
  }, [navigateWithLoading]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const token = urlParams.get('token');
    
    if (username && token) {
      localStorage.setItem('token', token);
      localStorage.setItem('email', username);
      onLogin(username);
      navigate('/home');
    }
  }, [navigate, onLogin]);

  // Check if user was redirected from logout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'logout') {
      setIsInitialLoading(true);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 500);
      }, 2000);
    }
  }, []);

  if (isInitialLoading) {
    return <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />;
  }

  const validateForm = (): boolean => {
    // Validate email
    const emailValidation = ValidationUtils.email(email);
    if (!emailValidation.isValid) {
      toast.error(emailValidation.message);
      return false;
    }

    // Validate password
    const passwordValidation = ValidationUtils.login_password(password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    toast.info("Logging in...");

    try {
      // Normalize email to lowercase before sending to the server
      const normalizedEmail = email.toLowerCase().trim();
      
      const response = await axiosInstance.post<LoginResponse>("/auth/login", {
        email: normalizedEmail,
        password,
      });

      const { token, user } = response.data;

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("email", normalizedEmail); // Store normalized email

      // Store user data
      localStorage.setItem("userData", JSON.stringify(user));

      onLogin(user.email);
      toast.success("Login successful!");
      navigateWithLoading("/home");
    } catch (error) {
      if (isAxiosError(error)) {
        // Check if the error is due to a banned account
        if (error.response?.status === 403 && error.response.data?.banned) {
          // Redirect to banned page with ban information
          navigate('/banned', { state: { banInfo: error.response.data.banInfo } });
          return;
        }

        const message =
          error.response?.data?.message || "Login failed. Please try again.";
        setErrors({ general: message });
        toast.error(message);
        
      } else {
        setErrors({ general: "An unexpected error occurred" });
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsProcessing(true);
      setErrors({});
      
      // Clear existing tokens before social login
      localStorage.removeItem("token");
      localStorage.removeItem("username");
  
      // Toast notification
      toast.info(`Connecting to ${provider}...`);
  
      // Construct the authentication URL
      const authUrl = `${import.meta.env.VITE_SITE_URL}/oauth/${provider.toLowerCase()}`;
      
      // Create new window
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Error during ${provider} login:`, error);
      toast.error(`Failed to log in with ${provider}.`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in transform 10s">
      <div
        className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-start bg-[#1E1E1E] md:bg-cover md:bg-center fade-in"
        style={{
          backgroundImage: `url(${"/Login.jpg"})`,
          transition: "opacity 1s ease-in-out",
        }}
      >
        <img
          src={"/fadeLogin.png"}
          className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block"
          style={{ transition: "opacity 1s ease-in-out" }}
        />
        {/* Left Side - Logo */}
        <div
          className="hidden md:block md:w-1/2 flex items-center justify-center h-screen"
          style={{ transition: "opacity 1s ease-in-out" }}
        ></div>
        {/* Right Side - Login Form */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center md:justify-end p-4 md:p-0 mt-0 md:mt-0 md:mr-[250px] z-10"
          style={{ transition: "opacity 1s ease-in-out" }}
        >
          <div
            className="w-full max-w-[90%] md:w-[480px] relative"
            style={{ transition: "opacity 1s ease-in-out" }}
          >
            <h2
              className="text-4xl font-cinzel text-white mb-12 text-center md:animate-none"
              style={{ transition: "opacity 1s ease-in-out" }}
            >
              Gates of Realm
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              style={{ transition: "opacity 1s ease-in-out" }}
            >
              <div>
                <label className="block text-sm font-cinzel text-white mb-2 text-left">
                  Email
                </label>
                <ValidatedInput
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
                  placeholder="Your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-cinzel text-white mb-2 text-left">
                  Password
                </label>
                <ValidatedInput
                  type="login_password"
                  value={password}
                  onChange={(value) => setPassword(value)}
                  className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
                  placeholder="Your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded font-cinzel"
                disabled={isProcessing}
              >
                Enter the Realm
              </button>
            </form>

            <div className="mt-8">
              <div className="text-center text-sm text-[#8B7355] mb-4">
                Enter Using
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="p-2 rounded-full bg-[#3D2E22] hover:bg-[#4D3E32] disabled:opacity-50"
                  disabled={isProcessing}
                >
                  <FaGoogle className="text-[#8B7355]" size={30} />
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <LoadingLink
                to="/forgot-password"
                className="text-[#C8A97E] hover:text-[#D8B98E] text-sm"
              >
                Forgot Password?
              </LoadingLink>
            </div>

            <div className="mt-6 text-center">
              <div className="text-[#8B7355] text-sm">
                Mark your Name in the History
              </div>
              <LoadingLink
                to="/register"
                className="text-[#C8A97E] hover:text-[#D8B98E] text-sm"
              >
                Register
              </LoadingLink>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
