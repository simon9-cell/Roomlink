import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ForgotPassword from './ForgotPassword';

// Mock the Auth Context
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ForgotPassword Component', () => {
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });
  });

  it('shows success message on successful reset request', async () => {
    mockResetPassword.mockResolvedValue({});

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Submit the form
    fireEvent.submit(emailInput.closest('form'));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText(/Check your email for the reset link!/i)).toBeTruthy();
    });
  });

  it('shows error message when the API fails', async () => {
    mockResetPassword.mockRejectedValue(new Error('User not found'));

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.submit(emailInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/User not found/i)).toBeTruthy();
    });
  });

  it('handles the loading state correctly', async () => {
    // Keep the promise pending
    mockResetPassword.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(emailInput.closest('form'));

    // Check for loading text
    const button = screen.getByRole('button');
    expect(button.innerHTML).toContain('Sending...');
    // Check disabled status via standard DOM property
    expect(button.disabled).toBe(true);
  });
});