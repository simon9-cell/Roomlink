import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RoomateDetail from './RoomateDetail';
import { supabase } from '../supabaseClient';

// Mock Supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('RoomateDetail Component', () => {
  const mockRoom = {
    id: '123',
    name: 'Obinna',
    location: 'Lagos',
    price: 150000,
    gender_pref: 'Male',
    phone_number: '08012345678',
    image_url: ['img1.jpg', 'img2.jpg'],
    description: 'Looking for a clean roommate.',
    views: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    // Setup Supabase Select Mock
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockRoom, error: null }),
    });

    // Setup RPC Mock
    supabase.rpc.mockResolvedValue({ error: null });
  });

  const renderComponent = (id = '123') => {
    return render(
      <MemoryRouter initialEntries={[`/roommate/${id}`]}>
        <Routes>
          <Route path="/roommate/:id" element={<RoomateDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('fetches and displays roommate details correctly', async () => {
    renderComponent();

    expect(screen.getByText(/Loading details.../i)).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Obinna')).toBeTruthy();
      expect(screen.getByText(/150,000/)).toBeTruthy();
      expect(screen.getByText('Lagos')).toBeTruthy();
    });
  });

  it('increments view counter only once per session', async () => {
    renderComponent();

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith('increment_roommate_views', {
        target_id: '123',
      });
    });

    // Check sessionStorage
    expect(sessionStorage.getItem('viewed_roommate_123')).toBe('true');
  });

  it('formats the WhatsApp link correctly for Nigerian numbers', async () => {
    renderComponent();

    await waitFor(() => {
      const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });
      const url = whatsappLink.getAttribute('href');
      
      // Should convert 080... to 23480...
      expect(url).toContain('phone=2348012345678');
      expect(url).toContain(encodeURIComponent('Obinna'));
    });
  });

  it('switches the main image when a thumbnail is clicked', async () => {
    renderComponent();

    await waitFor(async () => {
      const thumbnails = screen.getAllByAltText('thumb');
      const mainImage = screen.getByAltText('Obinna');

      // Click second thumbnail
      fireEvent.click(thumbnails[1]);
      
      expect(mainImage.getAttribute('src')).toBe('img2.jpg');
    });
  });
});