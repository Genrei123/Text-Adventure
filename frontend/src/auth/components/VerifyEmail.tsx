import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../config/axiosConfig";

const VerifyEmail = () => {
  const { token } = useParams()
  const [message, setMessage] = useState("Verifying your email...")
  const [status, setStatus] = useState("loading") // 'loading', 'success', 'error'

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify-email/${token}`);
        setMessage(response.data.message);
        setStatus("success");
      } catch (error) {
        setMessage("Failed to verify email. Please try again.");
        alert("Failed to verify email. Please try again.");
        console.log("Failed to verify email:", error);
        setStatus("error");
      }
    }

    verifyEmail()
  }, [token])

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Email Verification</h1>
        {status === "loading" && (
          <div className="animate-pulse">
            <p className="text-lg mb-4">{message}</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <p className="text-lg mb-4">{message}</p>
            <p className="mb-6">Your email has been successfully verified. You can now log in.</p>
            <a
              href="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Go to Login
            </a>
          </div>
        )}
        {status === "error" && (
          <div>
            <p className="text-lg mb-4">{message}</p>
            <p className="text-red-400">There was an error verifying your email. Please try again later.</p>
          
          <a
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"

          >
            Go to Login
          </a>
          </div>


        )}
      </div>
    </div>
    </>
  )
}

export default VerifyEmail;

