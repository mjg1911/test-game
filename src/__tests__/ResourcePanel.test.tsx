import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourcePanel from '../components/ResourcePanel';

import { GameStateContext } from '../providers/GameStateProvider';

describe('ResourcePanel', () => {
  it('renders resource values from context', () => {
    const mockContext = {
      state: {
        resources: {
          money: 50,
          eggs: 3,
          wheat: 0,
          corn: 0,
          milk: 0
        }
      },
      dispatch: () => {}
    };
    render(
      <GameStateContext.Provider value={mockContext}>
        <ResourcePanel />
      </GameStateContext.Provider>
    );
    expect(screen.getByText(/Money:/i)).toBeInTheDocument();
    expect(screen.getByText(/Eggs:/i)).toBeInTheDocument();
    expect(screen.getByText(/Wheat:/i)).toBeInTheDocument();
    expect(screen.getByText(/Corn:/i)).toBeInTheDocument();
    expect(screen.getByText(/Milk:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sell Eggs/i })).toBeInTheDocument();
  });
});
