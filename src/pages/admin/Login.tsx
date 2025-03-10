
import React from 'react';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminLogin = () => {
  const { user, isLoading } = useAuth();

  // If already authenticated, redirect to admin dashboard
  if (user && !isLoading) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <AdminLoginForm />
    </div>
  );
};

export default AdminLogin;
