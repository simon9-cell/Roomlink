import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DarkModeProvider, { useDarkMode } from './DarkModeContext';

// Helper component
const TestThemeComponent = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  return (
    <div>
      <span data-testid="mode">{darkMode ? 'Dark' : 'Light'}</span>
      <button onClick={toggleDarkMode}>Toggle</button>
    </div>
  );
};

describe('DarkModeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.clearAllMocks();
  });

  it('toggles dark mode and updates localStorage and DOM', () => {
    render(
      <DarkModeProvider>
        <TestThemeComponent />
      </DarkModeProvider>
    );

    const button = screen.getByText('Toggle');
    const modeText = screen.getByTestId('mode');

    // Initial state (Light)
    expect(modeText.textContent).toBe('Light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to Dark
    fireEvent.click(button);
    expect(modeText.textContent).toBe('Dark');
    expect(localStorage.getItem('darkMode')).toBe('true');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle back to Light
    fireEvent.click(button);
    expect(modeText.textContent).toBe('Light');
    expect(localStorage.getItem('darkMode')).toBe('false');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('loads saved preference from localStorage on mount', () => {
    localStorage.setItem('darkMode', 'true');

    render(
      <DarkModeProvider>
        <TestThemeComponent />
      </DarkModeProvider>
    );

    expect(screen.getByTestId('mode').textContent).toBe('Dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});