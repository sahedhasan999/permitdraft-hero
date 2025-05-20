
import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import LoginForm from '@/components/auth/LoginForm';
import SignUpDialog from '@/components/auth/SignUpDialog';

interface LocationState {
  from?: {
    pathname: string;
  };
  redirectTo?: string;
  prefillData?: {
    name?: string;
    email?: string;
    projectType?: string;
  };
  showSignUp?: boolean;
}

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const locationState = location.state as LocationState || {};
  
  // Get the redirect URL from location state
  const redirectTo = locationState.from?.pathname || 
                    locationState.redirectTo ||
                    (isAdmin ? '/admin/dashboard' : '/client/dashboard');
  
  // Get prefill data if any
  const prefillData = locationState.prefillData || {};
  
  // Check if we should show signup dialog automatically
  useEffect(() => {
    if (locationState.showSignUp) {
      setShowSignUp(true);
    }
  }, [locationState.showSignUp]);
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Listen for custom event to open signup dialog
  useEffect(() => {
    const handleOpenSignUp = () => setShowSignUp(true);
    window.addEventListener('open-signup', handleOpenSignUp);
    
    return () => {
      window.removeEventListener('open-signup', handleOpenSignUp);
    };
  }, []);
  
  const handleSignupSuccess = (email: string, password: string) => {
    // Auto-fill the login form with the signup credentials
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="flex flex-col justify-center items-center p-4">
          <LoginForm 
            redirectTo={redirectTo}
            initialEmail={email}
            initialPassword={password}
          />
          
          {/* Admin login link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              <Link to="/admin/login" className="text-primary hover:underline focus:outline-none">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SignUpDialog 
        open={showSignUp} 
        onOpenChange={setShowSignUp}
        onSuccess={handleSignupSuccess}
        redirectTo={redirectTo}
        prefillData={prefillData}
      />
    </div>
  );
};

export default Login;
