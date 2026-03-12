import React from 'react';
import { render, screen } from '@testing-library/react';
import CropField from '../components/CropField';

describe('CropField', () => {
  it('renders crop grid with Buy and Collect buttons', () => {
    render(<CropField />);
    expect(screen.getByText(/Wheat/)).toBeInTheDocument();
    expect(screen.getByText(/Corn/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Buy/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Collect/i })).toHaveLength(2);
  });
});
