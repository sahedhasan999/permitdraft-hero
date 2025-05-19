import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/contexts/FirebaseContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();
  
  // Check if this is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Debug log authentication state
  useEffect(() => {
    console.log('Auth state:', { 
      user: user?.email, 
      isAdmin, 
      path: location.pathname,
      isAdminRoute 
    });
  }, [user, isAdmin, location.pathname, isAdminRoute]);

  if (isLoading) {
    // Show loading spinner while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated at all
  if (!user) {
    // Redirect to appropriate login page based on route
    return isAdminRoute 
      ? <Navigate to="/admin/login" state={{ from: location }} replace />
      : <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is logged in but not an admin when accessing admin routes
  if (user && isAdminRoute && !isAdmin) {
    // Redirect non-admin users to the client dashboard with an error message
    return <Navigate to="/client/dashboard" state={{ 
      accessDenied: true,
      message: "You don't have permission to access the admin area."
    }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
