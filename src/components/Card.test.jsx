import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Card from './Card';

describe('Card Component', () => {
  const mockRoom = {
    name: 'Luxury Suite',
    location: 'Lagos',
    price: 500000,
    gender_pref: 'Mixed',
    image_url: ['img1.jpg', 'img2.jpg', 'img3.jpg']
  };

  const renderCard = (room = mockRoom) => {
    return render(
      <MemoryRouter>
        <Card room={room} linkpath="/details/1" />
      </MemoryRouter>
    );
  };

  it('renders room details correctly (Price, Location, Title)', () => {
    renderCard();

    expect(screen.getByText('Luxury Suite')).toBeTruthy();
    expect(screen.getByText('Lagos')).toBeTruthy();
    // Check for formatted price
    expect(screen.getByText(/500,000/)).toBeTruthy();
    expect(screen.getByText('Mixed')).toBeTruthy();
  });

  it('navigates to the next image when the next button is clicked', async () => {
    const user = userEvent.setup();
    renderCard();

    // The slider container is the parent of the images
    const images = screen.getAllByRole('img');
    const slider = images[0].parentElement;

    // Verify initial position
    expect(slider.style.transform).toBe('translateX(-0%)');

    // Find and click the next button (Requires aria-label="Next slide" in Card.jsx)
    const nextButton = screen.getByRole('button', { name: /next slide/i });
    await user.click(nextButton);

    // Verify it moved to the second image
    expect(slider.style.transform).toBe('translateX(-100%)');
    
    // Click next again to see if it moves to the third
    await user.click(nextButton);
    expect(slider.style.transform).toBe('translateX(-200%)');
  });

  it('loops back to the first image when clicking next on the last image', async () => {
    const user = userEvent.setup();
    renderCard();

    const nextButton = screen.getByRole('button', { name: /next slide/i });

    // Click through to the end (3 images total)
    await user.click(nextButton); // to idx 1
    await user.click(nextButton); // to idx 2
    await user.click(nextButton); // should loop to idx 0

    const images = screen.getAllByRole('img');
    const slider = images[0].parentElement;
    expect(slider.style.transform).toBe('translateX(-0%)');
  });

  it('hides slider controls when only one image is provided', () => {
    const singleImageRoom = {
      ...mockRoom,
      image_url: ['only-one.jpg']
    };

    render(
      <MemoryRouter>
        <Card room={singleImageRoom} linkpath="/details/1" />
      </MemoryRouter>
    );

    // The buttons should not be in the DOM
    expect(screen.queryByRole('button', { name: /next slide/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /previous slide/i })).toBeNull();
  });

  it('contains a link to the correct details page', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /view details/i });
    expect(link.getAttribute('href')).toBe('/details/1');
  });
});