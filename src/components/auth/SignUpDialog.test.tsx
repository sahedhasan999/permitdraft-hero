import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUpDialog from './SignUpDialog'; // Adjust path as necessary
import { useFirebase } from '@/contexts/FirebaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mocks
const mockNavigate = vi.fn();
vi.mock('@/contexts/FirebaseContext');
vi.mock('@/contexts/AuthContext');
vi.mock('@/hooks/use-toast');
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // Import and retain default behavior
    useNavigate: () => mockNavigate, // Ensure useNavigate always returns our mock
  };
});

const mockSignInWithGoogle = vi.fn();
const mockSignInWithApple = vi.fn();
const mockSignUp = vi.fn();
const mockLogin = vi.fn();
const mockToast = vi.fn();
// mockNavigate is defined above the mocks

const mockOnOpenChange = vi.fn();

describe('SignUpDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useFirebase as vi.Mock).mockReturnValue({
      signUp: mockSignUp,
      signInWithGoogle: mockSignInWithGoogle,
      signInWithApple: mockSignInWithApple,
    });

    (useAuth as vi.Mock).mockReturnValue({
      login: mockLogin,
      currentUser: null, // Or a mock user if needed for other tests
    });

    (useToast as vi.Mock).mockReturnValue({
      toast: mockToast,
    });
    // No longer need to re-assign useNavigate here
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      onOpenChange: mockOnOpenChange,
      onSuccess: vi.fn(), // Mock onSuccess if its behavior needs to be tested
      // prefillData can be added if needed for specific tests
    };
    return render(
      <SignUpDialog {...defaultProps} {...props} />
    );
  };

  it('renders the SignUpDialog correctly', () => {
    renderComponent();
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  // Google Sign-In Tests
  it('calls signInWithGoogle when "Continue with Google" is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Continue with Google'));
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('shows success toast and navigates on successful Google sign-in', async () => {
    mockSignInWithGoogle.mockResolvedValueOnce({ user: { uid: 'test-google-uid' } });
    renderComponent();
    fireEvent.click(screen.getByText('Continue with Google'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Successfully signed in with Google!",
      });
    });
    await waitFor(() => expect(mockOnOpenChange).toHaveBeenCalledWith(false));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }));
  });

  it('shows error toast on failed Google sign-in', async () => {
    const errorMessage = 'Google sign-in failed';
    mockSignInWithGoogle.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent();
    fireEvent.click(screen.getByText('Continue with Google'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Google sign-in failed",
        description: errorMessage,
        variant: "destructive",
      });
    });
    expect(mockOnOpenChange).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Apple Sign-In Tests
  it('calls signInWithApple when "Continue with Apple" is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Continue with Apple'));
    expect(mockSignInWithApple).toHaveBeenCalledTimes(1);
  });

  it('shows success toast and navigates on successful Apple sign-in', async () => {
    mockSignInWithApple.mockResolvedValueOnce({ user: { uid: 'test-apple-uid' } });
    renderComponent();
    fireEvent.click(screen.getByText('Continue with Apple'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Successfully signed in with Apple!",
      });
    });
    await waitFor(() => expect(mockOnOpenChange).toHaveBeenCalledWith(false));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }));
  });

  it('shows error toast on failed Apple sign-in', async () => {
    const errorMessage = 'Apple sign-in failed';
    mockSignInWithApple.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent();
    fireEvent.click(screen.getByText('Continue with Apple'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Apple sign-in failed",
        description: errorMessage,
        variant: "destructive",
      });
    });
    expect(mockOnOpenChange).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
