// frontend/src/components/VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig/axiosConfig';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      axios.post('/api/verify-email', { token })
        .then(response => {
          setMessage('Email verified successfully!');
          setTimeout(() => navigate('/login'), 3000);
        })
        .catch(error => {
          if (error.response?.data?.message === 'Invalid or expired verification code') {
            setMessage('Invalid or expired verification code.');
          } else {
            setMessage('Email verification failed. Please try again.');
          }
        });
    } else {
      setMessage('Invalid verification link.');
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;