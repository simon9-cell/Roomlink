import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PrivateRoutes Gatekeeper', () => {
  
  it('renders LoadingSpinner while loading the session', () => {
    useAuth.mockReturnValue({ user: null, loadingSession: true });

    render(
      <MemoryRouter>
        <PrivateRoutes>
          <div data-testid="protected-content">Secret Dashboard</div>
        </PrivateRoutes>
      </MemoryRouter>
    );

    // Verify spinner text is present and content is hidden
    expect(screen.getByText(/Securing Session/i)).toBeTruthy();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('redirects unauthorized users to the sign-in page', () => {
    useAuth.mockReturnValue({ user: null, loadingSession: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Page</div>} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoutes>
                <div>Secret Dashboard</div>
              </PrivateRoutes>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Secret Dashboard')).toBeNull();
    expect(screen.getByText('Sign In Page')).toBeTruthy();
  });

  it('allows authorized users to see protected content', () => {
    useAuth.mockReturnValue({ 
      user: { id: '123', email: 'user@test.com' }, 
      loadingSession: false 
    });

    render(
      <MemoryRouter>
        <PrivateRoutes>
          <div data-testid="protected-content">Secret Dashboard</div>
        </PrivateRoutes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeTruthy();
    expect(screen.getByText('Secret Dashboard')).toBeTruthy();
  });
});