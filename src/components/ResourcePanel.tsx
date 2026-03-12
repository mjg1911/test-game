import React from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const ResourcePanel: React.FC = () => {
  const { state, dispatch } = useGameStateContext();

  const handleSell = (resource: string) => {
    const amount = state.resources[resource] || 0;
    if (amount > 0) {
      dispatch({ type: 'SELL_RESOURCES', resource, amount });
    }
  };

  return (
    <section style={{ padding: '1em', border: '1px solid #ccc', background: '#222', color: '#ffd67e', fontFamily: 'monospace', borderRadius: 6 }}>
      <h3>Resources</h3>
      <div style={{ display: 'flex', gap: '1em', marginBottom: '0.5em' }}>
        <span>Money: <strong data-testid="money">{state.resources.money}</strong></span>
        <span>Eggs: <strong data-testid="eggs">{state.resources.eggs || 0}</strong></span>
        {state.resources.eggs > 0 && (
          <button onClick={() => handleSell('eggs')}>Sell Eggs</button>
        )}
        <span>Wheat: <strong data-testid="wheat">{state.resources.wheat || 0}</strong></span>
        {state.resources.wheat > 0 && (
          <button onClick={() => handleSell('wheat')}>Sell Wheat</button>
        )}
        <span>Corn: <strong data-testid="corn">{state.resources.corn || 0}</strong></span>
        {state.resources.corn > 0 && (
          <button onClick={() => handleSell('corn')}>Sell Corn</button>
        )}
        <span>Milk: <strong data-testid="milk">{state.resources.milk || 0}</strong></span>
        {state.resources.milk > 0 && (
          <button onClick={() => handleSell('milk')}>Sell Milk</button>
        )}
      </div>
    </section>
  );
};

export default ResourcePanel;
