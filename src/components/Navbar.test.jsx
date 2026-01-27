import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// 1. Setup mock control variables
let mockSession = null;
let mockFullName = "";

// 2. Updated Mock to use 'userProfile'
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ 
    session: mockSession, 
    userProfile: { full_name: mockFullName } // Matches your Navbar's destructuring!
  }),
}));

vi.mock('../context/DarkModeContext', () => ({
  useDarkMode: () => ({ 
    darkMode: false, 
    toggleDarkMode: vi.fn() 
  }),
}));

describe('Navbar Component - Final Check', () => {
  
  beforeEach(() => {
    mockSession = null;
    mockFullName = "";
  });

  it('renders logo and Log In button when signed out', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /roomlink/i })).toBeTruthy();
    expect(screen.getByText(/Log In/i)).toBeTruthy();
  });

  it('renders Dashboard and user initial when signed in', () => {
    // Set mock values before rendering
    mockSession = { id: '123' };
    mockFullName = "Jane Doe";

    render(<MemoryRouter><Navbar /></MemoryRouter>);
    
    // Check for the "Dashboard" text
    expect(screen.getByText(/Dashboard/i)).toBeTruthy();

    // Check for the initial 'J' 
    // (Now that userProfile.full_name is mocked, it won't default to 'U')
    expect(screen.getByText('J')).toBeTruthy();
    
    // Check that Log In is hidden
    expect(screen.queryByText(/Log In/i)).toBeNull();
  });
});