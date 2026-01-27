import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HouseDetail from './HouseDetail';
import { supabase } from '../supabaseClient';

// Mock Supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('HouseDetail Component', () => {
  const mockHouse = {
    id: '123',
    name: 'Modern Mansion',
    location: 'Oleh',
    price: 500000,
    phone_number: '08012345678',
    image_url: ['https://test.com/img1.jpg', 'https://test.com/img2.jpg'],
    description: 'Beautiful home',
    views: 10
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for supabase.from('houses').select().eq().single()
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockHouse, error: null }),
    }));
    
    supabase.rpc.mockResolvedValue({ error: null });
    
    // Clear sessionStorage for clean view counter tests
    sessionStorage.clear();
  });

  const renderComponent = (id = '123') => {
    render(
      <MemoryRouter initialEntries={[`/house/${id}`]}>
        <Routes>
          <Route path="/house/:id" element={<HouseDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders house details correctly after fetching', async () => {
    renderComponent();

    expect(await screen.findByText('Modern Mansion')).toBeTruthy();
    expect(screen.getByText('₦500,000/year')).toBeTruthy();
    expect(screen.getByText('Oleh')).toBeTruthy();
  });

  it('increments view count via RPC only once per session', async () => {
    renderComponent('123');

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith('increment_house_views', {
        target_id: '123',
      });
    });

    // Verify sessionStorage flag was set
    expect(sessionStorage.getItem('viewed_house_123')).toBe('true');
  });

  it('generates the correct WhatsApp link with Nigerian country code', async () => {
    renderComponent();
    
    const whatsappBtn = await screen.findByRole('link', { name: /whatsapp/i });
    const href = whatsappBtn.getAttribute('href');

    // Should convert 08012345678 to 2348012345678
    expect(href).toContain('phone=2348012345678');
    // Should include the property name in the message
    expect(href).toContain(encodeURIComponent('Modern Mansion'));
  });

  it('shows "House not found" if Supabase returns no data', async () => {
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    }));

    renderComponent('999');

    expect(await screen.findByText(/House not found/i)).toBeTruthy();
  });
});