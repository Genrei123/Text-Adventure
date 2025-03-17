import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const adminUserStr = localStorage.getItem('adminUser');
      
      if (!adminToken || !adminUserStr) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const adminUser = JSON.parse(adminUserStr);
        if (adminUser && adminUser.admin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          toast.error('You do not have admin privileges to access this page.');
        }
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        setIsAdmin(false);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        toast.error('Authentication error. Please log in again.');
      }
    };

    checkAdminAuth();
  }, [navigate]);

  if (isAdmin === null) {
    // Still checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/Admin/Login" replace />
  );
};

export default AdminRoute; 