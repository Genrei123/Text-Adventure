import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../../../config/axiosConfig';

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await axios.get('/user/user');
        //const data = await response.json();
        setIsAuthenticated(!!data.data.username);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default AuthRoute;