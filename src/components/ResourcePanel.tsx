import React from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const ResourcePanel: React.FC = () => {
  const { state } = useGameStateContext();

  return (
    <div className="pixel-panel" style={{ marginBottom: 16 }}>
      <h3 className="pixel-panel-title">💰 RESOURCES</h3>
      <div className="pixel-resources">
        <div className="pixel-resource">
          <span className="pixel-resource-icon">💵</span>
          <span className="pixel-resource-label">Money:</span>
          <span className="pixel-resource-value" data-testid="money">{state.resources.money}</span>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;
