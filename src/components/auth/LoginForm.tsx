
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Button } from '@/components/ui/button'; // Added for social login buttons
import { LogIn, Lock, ChromeIcon, AppleIcon } from 'lucide-react'; // ChromeIcon for Google, AppleIcon for Apple
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  redirectTo?: string;
  initialEmail?: string;
  initialPassword?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  redirectTo,
  initialEmail = '',
  initialPassword = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  
  const { login, isAdmin, loginWithGoogle, loginWithApple } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Update the email/password if they change (for example from parent component)
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
    if (initialPassword) {
      setPassword(initialPassword);
    }
  }, [initialEmail, initialPassword]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First attempt to login
      await login(email, password);
      
      // Wait a bit for isAdmin to be set
      setTimeout(() => {
        if (isAdmin) {
          toast({
            title: "Admin login successful",
            description: "Welcome to the Admin Dashboard",
          });
          navigate('/admin/dashboard', { replace: true });
        } else {
          toast({
            title: "Login successful",
            description: "Welcome to your dashboard",
          });
          if (redirectTo) {
            navigate(redirectTo, { replace: true });
          } else {
            navigate('/client/dashboard', { replace: true });
          }
        }
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message || "Please check your credentials",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Navigation is expected to be handled by AuthContext updating user state
      // and triggering effects in this component or higher up.
      toast({
        title: "Signed in with Google!",
        description: "Welcome! Redirecting you now...",
      });
      // The existing useEffect watching `isAdmin` or `user` should handle navigation
      // No explicit navigation here to avoid conflicts if AuthContext/user state change handles it
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsAppleLoading(true);
    try {
      await loginWithApple();
      toast({
        title: "Signed in with Apple!",
        description: "Welcome! Redirecting you now...",
      });
      // Similar to Google login, navigation should be handled by user state changes.
    } catch (error: any) {
      toast({
        title: "Apple Sign-In Failed",
        description: error.message || "Could not sign in with Apple. This may not be supported on all browsers/devices. Please try again or use another method.",
        variant: "destructive",
      });
    } finally {
      setIsAppleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
      <div className="flex justify-center mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <Lock className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        
        <AnimatedButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
            disabled={isGoogleLoading || isAppleLoading}
          iconLeft={<LogIn className="h-4 w-4" />}
          className="mt-6"
        >
          Sign In
        </AnimatedButton>
      </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-muted"></div>
          <span className="mx-4 flex-shrink text-sm text-muted-foreground">Or continue with</span>
          <div className="flex-grow border-t border-muted"></div>
        </div>

        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin} 
            disabled={isSubmitting || isGoogleLoading || isAppleLoading}
          >
            {isGoogleLoading ? (
              'Signing in...'
            ) : (
              <>
                <ChromeIcon className="mr-2 h-4 w-4" /> Sign in with Google
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleAppleLogin} 
            disabled={isSubmitting || isGoogleLoading || isAppleLoading}
          >
            {isAppleLoading ? (
              'Signing in...'
            ) : (
              <>
                <AppleIcon className="mr-2 h-4 w-4" /> Sign in with Apple
              </>
            )}
          </Button>
        </div>
      
        <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-signup'))}
            className="text-primary hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
