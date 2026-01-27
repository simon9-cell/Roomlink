import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import UpdatePassword from './UpdatePassword';

// Mock Supabase client
vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(),
    },
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('UpdatePassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default window.alert mock to prevent test environment errors
    window.alert = vi.fn();
  });

  it('shows error if password is too short', async () => {
    render(<MemoryRouter><UpdatePassword /></MemoryRouter>);

    const input = screen.getByPlaceholderText(/Enter new password/i);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.submit(screen.getByRole('button'));

    expect(screen.getByText(/at least 8 characters/i)).toBeTruthy();
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it('navigates to signin on successful update', async () => {
    supabase.auth.updateUser.mockResolvedValue({ error: null });

    render(<MemoryRouter><UpdatePassword /></MemoryRouter>);

    const input = screen.getByPlaceholderText(/Enter new password/i);
    fireEvent.change(input, { target: { value: 'new-secure-password' } });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'new-secure-password' });
      expect(window.alert).toHaveBeenCalledWith("Password updated successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });
  });

  it('handles API errors correctly', async () => {
    supabase.auth.updateUser.mockResolvedValue({ 
      error: { message: 'Token expired or invalid' } 
    });

    render(<MemoryRouter><UpdatePassword /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/Enter new password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/Token expired or invalid/i)).toBeTruthy();
    });
  });
});