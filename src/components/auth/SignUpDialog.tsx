
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { UserPlus, Apple, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (email: string, password: string) => void;
  redirectTo?: string;
  prefillData?: {
    name?: string;
    email?: string;
  };
}

const SignUpDialog: React.FC<SignUpDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess,
  redirectTo,
  prefillData = {}
}) => {
  const [signUpEmail, setSignUpEmail] = useState(prefillData.email || '');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [displayName, setDisplayName] = useState(prefillData.name || '');
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  const { signUp } = useFirebase();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    
    try {
      // Step 1: Create account
      await signUp(signUpEmail, signUpPassword, displayName);
      
      // Step 2: Auto login
      await login(signUpEmail, signUpPassword);
      
      toast({
        title: "Success",
        description: "Account created and logged in successfully!",
      });
      
      onOpenChange(false);
      
      // No need to call onSuccess as we're already logged in
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

  const handleGoogleSignUp = () => {
    toast({
      title: "Google sign-up",
      description: "Google authentication is not implemented yet",
    });
  };

  const handleAppleSignUp = () => {
    toast({
      title: "Apple sign-up",
      description: "Apple authentication is not implemented yet",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription>
            Fill out the form below to create your account or sign up with a provider.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 py-4">
          <AnimatedButton
            type="button"
            variant="outline"
            size="lg"
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </AnimatedButton>
          
          <AnimatedButton
            type="button"
            variant="outline"
            size="lg"
            onClick={handleAppleSignUp}
            className="flex items-center justify-center"
          >
            <Apple className="h-5 w-5 mr-2" />
            Continue with Apple
          </AnimatedButton>
          
          <div className="relative my-3">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-4">
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
              iconLeft={<Mail className="h-4 w-4" />}
            >
              Sign up with Email
            </AnimatedButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
