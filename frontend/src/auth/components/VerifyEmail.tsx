import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../../config/axiosConfig";
import "../../App.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/oauth/verify-email/${token}`);
        setMessage(response.data.message);
        setStatus("success");
      } catch (error) {
        setMessage("Failed to verify email. Please try again.");
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/fadeLogin.png')` }}
    >
      <div className="w-full max-w-md px-6 py-8">
        <div className="bg-[#3D2E22] rounded-xl shadow-2xl border border-[#8B7355]/50 p-8 text-center">
          <h1 className="text-3xl font-cinzel text-white mb-6">Email Verification</h1>
          
          {status === "loading" && (
            <div className="py-8 animate-pulse">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-t-[#C8A97E] border-[#8B7355]/30 animate-spin"></div>
              <p className="text-lg text-[#C8A97E] mb-4">{message}</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="py-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#3D2E22] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg text-[#C8A97E] mb-4">{message}</p>
              <p className="mb-6 text-[#8B7355]">Your email has been successfully verified. You can now log in to begin your adventure.</p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 font-cinzel bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded transition duration-300"
              >
                Enter the Realm
              </Link>
            </div>
          )}
          
          {status === "error" && (
            <div className="py-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#3D2E22] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-lg text-[#C8A97E] mb-4">{message}</p>
              <p className="mb-6 text-red-400">There was an error verifying your email. Please try again or contact support.</p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 font-cinzel bg-[#2A2A2A] hover:bg-[#3D3D3D] text-white rounded transition duration-300"
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

