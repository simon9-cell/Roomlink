import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Accordions from './Accordions'; // Changed from Accordion to Accordions

describe('Accordions Component', () => {
  const title = "What is RoomLink?";
  const content = "A platform to find rooms and roommates.";

  it('renders the title but keeps content hidden initially', () => {
    const { container } = render(
      <Accordions title={title}>{content}</Accordions>
    );

    expect(screen.getByText(title)).toBeTruthy();
    
    // Check for the "closed" grid class logic
    const contentWrapper = container.querySelector('.grid');
    expect(contentWrapper.className).toContain('grid-rows-[0fr]');
  });

  it('toggles content visibility when clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordions title={title}>{content}</Accordions>
    );

    const button = screen.getByRole('button');
    const contentWrapper = container.querySelector('.grid');

    // Click to open
    await user.click(button);
    expect(contentWrapper.className).toContain('grid-rows-[1fr]');
    expect(contentWrapper.className).toContain('opacity-100');

    // Click to close
    await user.click(button);
    expect(contentWrapper.className).toContain('grid-rows-[0fr]');
  });

  it('rotates the arrow icon on click', async () => {
    const user = userEvent.setup();
    render(<Accordions title={title}>{content}</Accordions>);

    const button = screen.getByRole('button');
    const arrow = screen.getByText('▼');

    expect(arrow.className).toContain('rotate-0');

    await user.click(button);
    expect(arrow.className).toContain('rotate-180');
  });
});