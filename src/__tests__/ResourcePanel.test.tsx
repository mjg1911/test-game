import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourcePanel from '../components/ResourcePanel';

describe('ResourcePanel', () => {
  it('renders resource labels money and eggs', () => {
    render(<ResourcePanel />);
    expect(screen.getByText(/Money/i)).toBeInTheDocument();
    expect(screen.getByText(/Eggs/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Collect/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sell/i })).toBeInTheDocument();
  });
});
