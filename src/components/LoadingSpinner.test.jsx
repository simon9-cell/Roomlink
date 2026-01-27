import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders the branding text "Securing Session"', () => {
    render(<LoadingSpinner />);
    
    const textElement = screen.getByText(/Securing Session/i);
    expect(textElement).toBeTruthy();
    // Verify the uppercase styling via class check
    expect(textElement.className).toContain('uppercase');
  });

  it('has the correct layout for a full-screen mobile overlay', () => {
    const { container } = render(<LoadingSpinner />);
    const overlay = container.firstChild;

    // These classes are critical for the 'phone glass' lock you mentioned
    expect(overlay.className).toContain('fixed');
    expect(overlay.className).toContain('inset-0');
    expect(overlay.className).toContain('h-[100dvh]');
    expect(overlay.className).toContain('z-[9999]');
  });

  it('contains an animated spinner element', () => {
    const { container } = render(<LoadingSpinner />);
    // Look for the div with the animate-spin class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
    expect(spinner.className).toContain('rounded-full');
  });
});