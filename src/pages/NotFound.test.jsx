import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

describe('NotFound Component', () => {
  it('renders the 404 error message correctly', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    // Check for the giant 404 background text
    expect(screen.getByText('404')).toBeTruthy();
    
    // Check for the catchy headline
    expect(screen.getByText(/Lost in the/i)).toBeTruthy();
    expect(screen.getByText(/Link?/i)).toBeTruthy();
  });

  it('contains a link that points back to home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /back to home/i });
    // Verify it actually leads to the root path
    expect(homeLink.getAttribute('href')).toBe('/');
  });
});