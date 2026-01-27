import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HousePage from './HousePage';
import { supabase } from '../supabaseClient';

// Mock Supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('HousePage Component', () => {
  const mockHouses = [
    { id: 1, name: 'Oleh Villa', location: 'oleh', price: 1000 },
    { id: 2, name: 'Ozoro Flat', location: 'ozoro', price: 2000 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default Supabase mock chain
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ 
        data: mockHouses, 
        count: 2, 
        error: null 
      }),
    }));
  });

  it('fetches and displays houses on mount', async () => {
    render(
      <MemoryRouter>
        <HousePage />
      </MemoryRouter>
    );

    // Verify initial load
    expect(await screen.findByText('Oleh Villa')).toBeTruthy();
    expect(screen.getByText('Ozoro Flat')).toBeTruthy();
  });

  it('applies location filter when a location is selected', async () => {
    const mockIlike = vi.fn().mockReturnThis();
    
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      ilike: mockIlike,
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }),
    }));

    render(
      <MemoryRouter>
        <HousePage />
      </MemoryRouter>
    );

    // Open dropdown and select 'ozoro'
    const locBtn = screen.getByRole('button', { name: /location/i });
    fireEvent.click(locBtn);
    
    const ozoroOption = screen.getByText('ozoro');
    fireEvent.click(ozoroOption);

    await waitFor(() => {
      // Check if ilike was called with 'location' and 'ozoro'
      expect(mockIlike).toHaveBeenCalledWith('location', 'ozoro');
    });
  });

  it('updates the view when the search form is submitted', async () => {
    const mockOr = vi.fn().mockReturnThis();

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      or: mockOr,
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }),
    }));

    render(
      <MemoryRouter>
        <HousePage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search by location/i);
    const searchBtn = screen.getByRole('button', { name: /search/i });

    // Type and search
    fireEvent.change(searchInput, { target: { value: 'Luxury' } });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      // Verify the query used the 'or' filter for name and location
      expect(mockOr).toHaveBeenCalledWith(expect.stringContaining('Luxury'));
    });
  });

  it('handles pagination correctly', async () => {
    const mockRange = vi.fn().mockResolvedValue({ data: [], count: 20, error: null });

    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: mockRange,
    }));

    render(
      <MemoryRouter>
        <HousePage />
      </MemoryRouter>
    );

    // Wait for initial load
    await screen.findByText(/Page/i);

    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      // Page 2 should request range 8 to 15 (0-indexed)
      expect(mockRange).toHaveBeenCalledWith(8, 15);
    });
  });
});