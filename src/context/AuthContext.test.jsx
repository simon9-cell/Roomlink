import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

// 1. Setup the Chainable Supabase Mock
vi.mock('../supabaseClient', () => {
  const mockChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
  };

  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } },
        })),
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => mockChain),
    },
  };
});

// Helper component to extract context values
const TestComponent = () => {
  const { user, userName, loadingSession } = useAuth();
  if (loadingSession) return <div>Loading...</div>;
  return (
    <div>
      <span data-testid="user-email">{user?.email || 'No User'}</span>
      <span data-testid="user-name">{userName}</span>
    </div>
  );
};

describe('AuthContext - Complete Logic Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides a guest state when no session exists', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name').textContent).toBe('User');
    });
  });

  it('restores session and fetches profile name on mount', async () => {
    const mockUser = { id: '123', email: 'test@test.com' };
    
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    // Mock found profile
    supabase.from().maybeSingle.mockResolvedValue({
      data: { full_name: 'John Doe' },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name').textContent).toBe('John Doe');
    });
  });

  it('creates a profile via upsert if one does not exist', async () => {
    const mockUser = { 
      id: 'new_uuid', 
      email: 'new@user.com',
      user_metadata: { full_name: 'New Explorer' } 
    };

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    // 1. Simulate "No profile found" in DB
    supabase.from().maybeSingle.mockResolvedValue({ data: null, error: null });
    
    // 2. Capture the upsert call
    const upsertSpy = supabase.from().upsert;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      // Should fall back to name from metadata
      expect(screen.getByTestId('user-name').textContent).toBe('New Explorer');
      // Verify DB was updated
      expect(upsertSpy).toHaveBeenCalledWith(expect.objectContaining({
        full_name: 'New Explorer',
        email: 'new@user.com'
      }));
    });
  });

  it('handles profile fetch errors gracefully by defaulting to "User"', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'error_id' } } },
    });

    // Simulate a DB error
    supabase.from().maybeSingle.mockRejectedValue(new Error('DB Timeout'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name').textContent).toBe('User');
    });
  });
});