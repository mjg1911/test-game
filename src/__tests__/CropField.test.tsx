import React from 'react';
import { render, screen } from '@testing-library/react';
import CropField from '../components/CropField';

describe('CropField', () => {
  it('renders label/title and Plant/Harvest buttons', () => {
    render(<CropField />);
    expect(screen.getByText(/Crop Field/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plant/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Harvest/i })).toBeInTheDocument();
  });
});
