import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignUp from './SignUp';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignUp Component', () => {
  const mockSignUpNewUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      signUpNewUser: mockSignUpNewUser,
    });
  });

  // Helper to find input by label text since they aren't linked via ID
  const getField = (labelRegex) => {
    const label = screen.getByText(labelRegex);
    return label.closest('div').querySelector('input');
  };

  it('shows error if password is less than 8 characters', async () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>);

    fireEvent.change(getField(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(getField(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(getField(/Password/i), { target: { value: '12345' } });

    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

    expect(screen.getByText(/Password must be at least 8 characters/i)).toBeTruthy();
    expect(mockSignUpNewUser).not.toHaveBeenCalled();
  });

  it('displays success screen when email confirmation is required', async () => {
    mockSignUpNewUser.mockResolvedValue({
      data: { user: { email: 'john@example.com' }, session: null },
      error: null
    });

    render(<MemoryRouter><SignUp /></MemoryRouter>);

    fireEvent.change(getField(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(getField(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(getField(/Password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

    const successMsg = await screen.findByText(/We've sent a verification link to/i);
    expect(successMsg).toBeTruthy();
  });

  it('shows loading state during API call', async () => {
    mockSignUpNewUser.mockReturnValue(new Promise(() => {})); 

    render(<MemoryRouter><SignUp /></MemoryRouter>);

    fireEvent.change(getField(/Password/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

    const loadingBtn = await screen.findByText(/Creating Account.../i);
    expect(loadingBtn).toBeTruthy();
    expect(loadingBtn.disabled).toBe(true);
  });

  it('navigates to dashboard if user is signed in immediately', async () => {
    mockSignUpNewUser.mockResolvedValue({
      data: { user: { id: '123' }, session: { access_token: 'abc' } },
      error: null
    });

    render(<MemoryRouter><SignUp /></MemoryRouter>);

    fireEvent.change(getField(/Password/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });
});