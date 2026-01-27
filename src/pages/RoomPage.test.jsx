import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RoomPage from './RoomPage';
import { supabase } from '../supabaseClient';

vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

window.scrollTo = vi.fn();

describe('RoomPage Component', () => {
  const mockRooms = [
    { id: 1, name: 'John Doe', location: 'Oleh', gender_pref: 'Male', price: 100000 },
  ];

  // Helper to create a consistent mock chain
  const createMockQuery = (returnData = mockRooms, count = 1) => {
    const query = {
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: returnData, error: null, count }),
    };
    return query;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('filters by gender when a gender option is selected', async () => {
    const mockQuery = createMockQuery();
    supabase.from.mockReturnValue(mockQuery);

    render(
      <MemoryRouter>
        <RoomPage />
      </MemoryRouter>
    );
    
    // Open dropdown and select Female
    fireEvent.click(screen.getByText(/Gender/i));
    const femaleOption = await screen.findByText('Female');
    fireEvent.click(femaleOption);

    await waitFor(() => {
      expect(mockQuery.eq).toHaveBeenCalledWith('gender_pref', 'Female');
    });
  });

  it('triggers search only when the search button is clicked', async () => {
    const mockQuery = createMockQuery();
    supabase.from.mockReturnValue(mockQuery);

    render(
      <MemoryRouter>
        <RoomPage />
      </MemoryRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/Search by name or location/i);
    fireEvent.change(searchInput, { target: { value: 'Abraka' } });
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      // Use stringContaining to match the Supabase 'or' syntax
      expect(mockQuery.or).toHaveBeenCalledWith(
        expect.stringContaining('name.ilike.%Abraka%,location.ilike.%Abraka%')
      );
    });
  });

  it('resets all filters when "Clear all filters" is clicked', async () => {
    // Start with empty data to show the reset button
    const mockQuery = createMockQuery([], 0);
    supabase.from.mockReturnValue(mockQuery);

    render(
      <MemoryRouter>
        <RoomPage />
      </MemoryRouter>
    );

    const clearButton = await screen.findByText(/Clear all filters/i);
    fireEvent.click(clearButton);

    await waitFor(() => {
      // Check if location was reset in the UI
      expect(screen.getByText('all')).toBeTruthy();
    });
  });
});