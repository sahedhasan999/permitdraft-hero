import React, { useEffect } from 'react';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

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
      navigate('/client/dashboard', { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate, toast]);

  // If already authenticated and is admin, redirect to admin dashboard
  if (user && isAdmin && !isLoading) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <AdminLoginForm />
      
      <div className="mt-6">
        <Link 
          to="/" 
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to Main Site
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
