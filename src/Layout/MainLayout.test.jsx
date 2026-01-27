import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import MainLayout from './MainLayout';

vi.mock('../components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));
vi.mock('../components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

describe('MainLayout Component', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    vi.clearAllMocks();
  });

  it('renders Navbar, Footer, and child content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<div>Home Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('navbar')).toBeTruthy();
    expect(screen.getByText('Home Content')).toBeTruthy();
  });

  it('calls window.scrollTo(0, 0) when navigating between pages', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Link to="/about">Go to About</Link>} />
            <Route path="about" element={<div>About Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Initial call on mount
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    // Perform actual navigation
    const link = screen.getByText(/Go to About/i);
    await user.click(link);

    // Verify the second call happened due to path change
    expect(screen.getByText('About Page')).toBeTruthy();
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });
});