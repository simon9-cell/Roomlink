import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import SignIn from './SignIn';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { from: { pathname: '/dashboard' } },
    }),
  };
});

describe('SignIn Component', () => {
  const mockSignInUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      signInUser: mockSignInUser,
      session: null,
    });
  });

  it('updates error message on invalid credentials', async () => {
    mockSignInUser.mockRejectedValue({ message: 'invalid login credentials' });
    render(<MemoryRouter><SignIn /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('name@email.com'), { target: { value: 'test@me.com' } });
    fireEvent.submit(screen.getByPlaceholderText('name@email.com').closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Incorrect email or password./i)).toBeTruthy();
    });
  });

  it('shows loading state during submission', async () => {
    mockSignInUser.mockReturnValue(new Promise(() => {}));
    render(<MemoryRouter><SignIn /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('name@email.com'), { target: { value: 'test@me.com' } });
    fireEvent.submit(screen.getByPlaceholderText('name@email.com').closest('form'));

    // findByText waits for the state change
    await screen.findByText(/Logging in.../i);
    
    // Explicitly select the submit button by its name
    const submitButton = screen.getByRole('button', { name: /Logging in.../i });
    
    // FIX: Use standard DOM property instead of jest-dom matcher
    expect(submitButton.disabled).toBe(true);
  });

  it('calls signInUser and shows toast on success', async () => {
    mockSignInUser.mockResolvedValue({ user: { email: 'test@me.com' } });
    render(<MemoryRouter><SignIn /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('name@email.com'), { target: { value: 'test@me.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByPlaceholderText('name@email.com').closest('form'));

    await waitFor(() => {
      expect(mockSignInUser).toHaveBeenCalledWith('test@me.com', 'password123');
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
    });
  });

  it('redirects to dashboard if session already exists', () => {
    useAuth.mockReturnValue({ signInUser: mockSignInUser, session: { user: { id: '1' } } });
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalled();
  });
});