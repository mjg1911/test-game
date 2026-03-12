import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AutomationControls from '../components/AutomationControls';

describe('AutomationControls', () => {
  it('renders the Automation Controls title and toggle button', () => {
    render(<AutomationControls />);
    expect(screen.getByText(/Automation Controls/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enable Automation/i })).toBeInTheDocument();
  });

  it('toggle button changes state when clicked', () => {
    render(<AutomationControls />);
    const button = screen.getByRole('button', { name: /Enable Automation/i });
    fireEvent.click(button);
    expect(button).toHaveTextContent(/Disable Automation/i);
    fireEvent.click(button);
    expect(button).toHaveTextContent(/Enable Automation/i);
  });
});
