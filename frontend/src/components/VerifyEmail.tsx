import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/verify-email/${token}`);
        setMessage(response.data.message);
        setStatus('success');
      } catch (error) {
        setMessage('Failed to verify email. Please try again.');
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
      {status === 'success' && (
        <div>
          <p>Your email has been successfully verified. You can now log in.</p>
          <a href="/login">Go to Login</a>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p>There was an error verifying your email. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;