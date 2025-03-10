
import React, { useEffect } from 'react';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get the redirect path from location state, or default to admin dashboard
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    // If user is logged in but not an admin, show access denied message
    if (user && !isAdmin && !isLoading) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area.",
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate, toast]);

  // If already authenticated and is admin, redirect to admin dashboard
  if (user && isAdmin && !isLoading) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <AdminLoginForm />
    </div>
  );
};

export default AdminLogin;
