import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders the brand logo and tagline', () => {
    render(<Footer />);
    
    // 1. Use getAllByText since "Room" and "Link" appear multiple times
    const roomElements = screen.getAllByText(/Room/i);
    const linkElements = screen.getAllByText(/Link/i);
    
    expect(roomElements.length).toBeGreaterThanOrEqual(2);
    expect(linkElements.length).toBeGreaterThanOrEqual(2);
    
    // 2. Check for the specific tagline
    expect(screen.getByText(/Connecting rooms & people/i)).toBeTruthy();
    expect(screen.getByText(/One click away from your new home/i)).toBeTruthy();
  });

  it('displays the current year dynamically', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    
    // Using a regex to find the year even if it's next to other text
    expect(screen.getByText(new RegExp(currentYear))).toBeTruthy();
  });

  it('has the correct responsive utility classes', () => {
    const { container } = render(<Footer />);
    const footerElement = container.querySelector('footer');
    
    // Verifying your Tailwind responsive logic
    expect(footerElement.className).toContain('hidden');
    expect(footerElement.className).toContain('md:block');
  });
});