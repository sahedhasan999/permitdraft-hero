
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';
import SignUpDialog from '@/components/auth/SignUpDialog';

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
          <LoginForm />
        </div>
      </main>
      <Footer />

      <SignUpDialog 
        open={showSignUp} 
        onOpenChange={setShowSignUp}
        onSuccess={handleSignupSuccess}
      />
    </div>
  );
};

export default Login;
