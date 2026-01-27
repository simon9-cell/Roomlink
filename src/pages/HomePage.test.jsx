import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import userEvent
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Homepage from './Homepage';

// Mock sub-components
vi.mock('../components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('../components/Accordions', () => ({
  default: ({ children, title }) => (
    <div>
      <button>{title}</button>
      <div>{children}</div>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Homepage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates to /house when "Browse Houses" is clicked', async () => {
    const user = userEvent.setup(); // Initialize user-event
    render(<MemoryRouter><Homepage /></MemoryRouter>);
    
    const browseBtn = screen.getByRole('button', { name: /Browse Houses/i });
    await user.click(browseBtn); // Async interaction
    
    expect(mockNavigate).toHaveBeenCalledWith('/house');
  });

  it('navigates to /rooms when "Find Roommates" is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Homepage /></MemoryRouter>);
    
    // We target the specific CTA button using a regex match for exact text
    const findRoommatesBtn = screen.getByRole('button', { name: /^Find Roommates$/i });
    await user.click(findRoommatesBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith('/rooms');
  });

  it('navigates to /signup when "Create Free Account" is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Homepage /></MemoryRouter>);
    
    const signupBtn = screen.getByRole('button', { name: /Create Free Account/i });
    await user.click(signupBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });
});