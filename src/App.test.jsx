import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import AuthProvider from './context/AuthContext';
import DarkModeProvider from './context/DarkModeContext';

// Mock scrollTo globally for the test environment
window.scrollTo = vi.fn();

describe('App Integration', () => {
  it('renders the landing page correctly', () => {
    render(
      <AuthProvider>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </AuthProvider>
    );
    
    // 1. Target the Hero Heading specifically
    // We look for an H1 that contains "Find Your Next House"
    const heroHeading = screen.getByRole('heading', { 
      level: 1, 
      name: /find your next house or roommate/i 
    });
    expect(heroHeading).toBeTruthy();

    // 2. Check for the "Log In" link in the navigation
    // Using getAllByRole because you have both Mobile and Desktop navs
    const loginLinks = screen.getAllByRole('link', { name: /log in/i });
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);

    // 3. Verify the "How RoomLink Works" section exists
    expect(screen.getByText(/How RoomLink Works/i)).toBeTruthy();
  });
});