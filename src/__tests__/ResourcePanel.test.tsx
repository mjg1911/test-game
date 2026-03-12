import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourcePanel from '../components/ResourcePanel';

import { GameStateContext } from '../providers/GameStateProvider';

describe('ResourcePanel', () => {
  it('renders money from context', () => {
    const mockContext = {
      state: {
        resources: {
          money: 50
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
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});
