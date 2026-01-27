import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthContext } from '../context/AuthContext'; // Now this import works!

// Mock Supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

// Mock Toastify
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const mockUser = { id: 'user-123', email: 'test@example.com' };
const mockSignOut = vi.fn();

const renderDashboard = () => {
  return render(
    <AuthContext.Provider value={{ 
      user: mockUser, 
      session: { user: mockUser }, 
      userName: 'Test User', 
      signOutUser: mockSignOut,
      loadingSession: false 
    }}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn(); // Fix the "Not implemented" error
  });

  it('renders dashboard header and welcome message', () => {
    renderDashboard();
    expect(screen.getByText(/Dashboard/i)).toBeTruthy();
    expect(screen.getByText(/Test User/i)).toBeTruthy();
  });

  it('opens the listing form when "Post a House" is clicked', async () => {
    renderDashboard();
    fireEvent.click(screen.getByText(/Post a House/i));
    
    // Check for your specific placeholder
    expect(screen.getByPlaceholderText(/Title e.g Bedsitter/i)).toBeTruthy();
  });

  it('shows gender preference ONLY when roommate category is selected', async () => {
    renderDashboard();
    
    // Click Find a Roommate
    fireEvent.click(screen.getByText(/Find a Roommate/i));
    expect(screen.getByText(/Gender Preference/i)).toBeTruthy();
    
    // Go back and check House
    fireEvent.click(screen.getByText(/Back to Menu/i));
    fireEvent.click(screen.getByText(/Post a House/i));
    expect(screen.queryByText(/Gender Preference/i)).toBeNull();
  });

  it('allows typing into the form fields', async () => {
    renderDashboard();
    fireEvent.click(screen.getByText(/Post a House/i));

    const titleInput = screen.getByPlaceholderText(/Title e.g Bedsitter/i);
    fireEvent.change(titleInput, { target: { value: 'Luxury Bedsitter' } });
    expect(titleInput.value).toBe('Luxury Bedsitter');
  });
});