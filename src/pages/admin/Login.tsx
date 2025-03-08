
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/contexts/FirebaseContext';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Lock, UserPlus, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  const { signIn, signUp } = useFirebase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to admin dashboard
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to the Dashboard",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    
    try {
      await signUp(signUpEmail, signUpPassword, displayName);
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
      });
      setShowSignUp(false);
      // Auto-fill the login form with the signup credentials
      setEmail(signUpEmail);
      setPassword(signUpPassword);
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: (error as Error).message || "Unable to create account",
        variant: "destructive",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Client Login</h1>
        
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
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setShowSignUp(true)}
              className="text-primary hover:underline focus:outline-none"
            >
              Sign up
            </button>
          </p>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Use the following credentials for demo:</p>
          <p className="font-medium">Email: admin@permitdraftpro.com</p>
          <p className="font-medium">Password: admin123</p>
        </div>
      </div>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create an Account</DialogTitle>
            <DialogDescription>
              Fill out the form below to create your client account.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSignUp} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signUpEmail">Email Address</Label>
              <Input
                id="signUpEmail"
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signUpPassword">Password</Label>
              <Input
                id="signUpPassword"
                type="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters
              </p>
            </div>
            
            <div className="pt-4">
              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSigningUp}
                iconLeft={<UserPlus className="h-4 w-4" />}
              >
                Create Account
              </AnimatedButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLogin;
