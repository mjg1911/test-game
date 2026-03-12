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
    <div className="pixel-panel" style={{ marginBottom: 16 }}>
      <h3 className="pixel-panel-title">💰 RESOURCES</h3>
      <div className="pixel-resources">
        <div className="pixel-resource">
          <span className="pixel-resource-icon">💵</span>
          <span className="pixel-resource-label">Money:</span>
          <span className="pixel-resource-value" data-testid="money">{state.resources.money}</span>
        </div>
        <div className="pixel-resource">
          <span className="pixel-resource-icon">🥚</span>
          <span className="pixel-resource-label">Eggs:</span>
          <span className="pixel-resource-value" data-testid="eggs">{state.resources.eggs || 0}</span>
          {state.resources.eggs > 0 && (
            <button className="pixel-button sell" onClick={() => handleSell('eggs')} style={{ marginLeft: 8, padding: '4px 8px' }}>
              Sell
            </button>
          )}
        </div>
        <div className="pixel-resource">
          <span className="pixel-resource-icon">🌾</span>
          <span className="pixel-resource-label">Wheat:</span>
          <span className="pixel-resource-value" data-testid="wheat">{state.resources.wheat || 0}</span>
          {state.resources.wheat > 0 && (
            <button className="pixel-button sell" onClick={() => handleSell('wheat')} style={{ marginLeft: 8, padding: '4px 8px' }}>
              Sell
            </button>
          )}
        </div>
        <div className="pixel-resource">
          <span className="pixel-resource-icon">🌽</span>
          <span className="pixel-resource-label">Corn:</span>
          <span className="pixel-resource-value" data-testid="corn">{state.resources.corn || 0}</span>
          {state.resources.corn > 0 && (
            <button className="pixel-button sell" onClick={() => handleSell('corn')} style={{ marginLeft: 8, padding: '4px 8px' }}>
              Sell
            </button>
          )}
        </div>
        <div className="pixel-resource">
          <span className="pixel-resource-icon">🥛</span>
          <span className="pixel-resource-label">Milk:</span>
          <span className="pixel-resource-value" data-testid="milk">{state.resources.milk || 0}</span>
          {state.resources.milk > 0 && (
            <button className="pixel-button sell" onClick={() => handleSell('milk')} style={{ marginLeft: 8, padding: '4px 8px' }}>
              Sell
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;
