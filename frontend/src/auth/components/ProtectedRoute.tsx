import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import axios from '../../../config/axiosConfig';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiresUsername?: boolean;
}

const ProtectedRoute = ({ children, requiresUsername = false }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const { username } = useParams<{ username?: string }>();
    const [isValidUsername, setIsValidUsername] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(requiresUsername);

    useEffect(() => {
        const verifyUsername = async () => {
            if (requiresUsername && username) {
                try {
                    const response = await axios.get(`/users/verify/${username}`);
                    setIsValidUsername(response.data.exists);
                } catch (error) {
                    console.error('Error verifying username:', error);
                    setIsValidUsername(false);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        verifyUsername();
    }, [username, requiresUsername]);

    // First check: Authentication
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Second check: Username validation (if required)
    if (requiresUsername) {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-[#B39C7D] text-xl">Loading...</div>
                </div>
            );
        }

        if (!isValidUsername) {
            return <Navigate to="/404" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;