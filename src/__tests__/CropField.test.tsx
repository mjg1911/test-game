import React from 'react';
import { render, screen } from '@testing-library/react';
import CropField from '../components/CropField';

describe('CropField', () => {
  it('renders crop grid with Buy and Collect buttons', () => {
    render(<CropField />);
expect(screen.getByText(/Wheat/)).toBeInTheDocument();
expect(screen.getByText(/Corn/)).toBeInTheDocument();
expect(screen.getByText(/Sunflower/)).toBeInTheDocument();
expect(screen.getByText(/Peas/)).toBeInTheDocument();
expect(screen.getByText(/Pumpkin/)).toBeInTheDocument();
expect(screen.getByText(/Potato/)).toBeInTheDocument();
expect(screen.getByText(/Tomato/)).toBeInTheDocument();
expect(screen.getAllByRole('button', { name: /Buy/i })).toHaveLength(7);
expect(screen.getAllByRole('button', { name: /Collect/i })).toHaveLength(7);
  });
});
