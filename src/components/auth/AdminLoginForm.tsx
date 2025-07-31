import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { LogIn, Lock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authRateLimit, isValidEmail, sanitizeText } from '@/utils/security';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessError, setAccessError] = useState(false);
  
  const { login, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to admin dashboard
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
    const sanitizedEmail = sanitizeText(email);
    if (!isValidEmail(sanitizedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Rate limiting check
    if (authRateLimit.isRateLimited(`admin-login-${sanitizedEmail}`, 3, 300000)) {
      toast({
        title: "Too many attempts",
        description: "Too many failed admin login attempts. Please wait 5 minutes",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setAccessError(false);
    
    try {
      await login(sanitizedEmail, password);
      
      // Wait a bit for isAdmin to be set
      setTimeout(() => {
        // Check if the logged in user is an admin
        if (!isAdmin) {
          setAccessError(true);
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
        } else {
          // Reset rate limit on successful admin login
          authRateLimit.reset(`admin-login-${sanitizedEmail}`);
          toast({
            title: "Login successful",
            description: "Welcome to the Admin Dashboard",
          });
          navigate(from, { replace: true });
        }
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
      <div className="flex justify-center mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <Lock className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
      
      {accessError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            This account does not have admin privileges.
          </AlertDescription>
        </Alert>
      )}
      
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
          iconLeft={<LogIn className="h-4 w-4" />}
          className="mt-6"
        >
          Sign In
        </AnimatedButton>
      </form>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Use the following credentials for demo:</p>
        <p className="font-medium">Email: admin@permitdraftpro.com</p>
        <p className="font-medium">Password: admin123</p>
      </div>
    </div>
  );
};

export default AdminLoginForm;
