import React from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const UPGRADE_CONFIG = {
  fertilizer: { baseCost: 100, description: 'Increases crop yield by 50%', maxLevel: 5 },
  autoHarvester: { baseCost: 500, description: 'Auto-harvests crops when ready', maxLevel: 3 }
};

export default function UpgradeShop() {
  const { state, dispatch } = useGameStateContext();

  const handleBuy = (upgrade: string) => {
    const config = UPGRADE_CONFIG[upgrade];
    const currentLevel = state.upgrades[upgrade]?.level || 0;
    const cost = config.baseCost * Math.pow(2, currentLevel);

    if (currentLevel >= config.maxLevel) {
      alert('Max level reached!');
      return;
    }

    if (state.resources.money >= cost) {
      dispatch({ 
        type: 'APPLY_UPGRADE', 
        upgrade, 
        cost
      });
    } else {
      alert('Not enough money!');
    }
  };

  return (
    <div style={{ padding: '1em', border: '1px solid #9932cc', background: '#2d1a3d', color: '#fff', fontFamily: 'monospace', borderRadius: 6 }}>
      <h3>Upgrade Shop</h3>
      {Object.entries(UPGRADE_CONFIG).map(([key, config]) => {
        const currentLevel = state.upgrades[key]?.level || 0;
        const cost = config.baseCost * Math.pow(2, currentLevel);
        const isMaxed = currentLevel >= config.maxLevel;
        return (
          <div key={key} style={{ marginBottom: '1em' }}>
            <div><strong>{key}</strong> (Level {currentLevel}/{config.maxLevel})</div>
            <div style={{ fontSize: '0.8em', color: '#aaa' }}>{config.description}</div>
            <button 
              onClick={() => handleBuy(key)}
              disabled={isMaxed || state.resources.money < cost}
            >
              {isMaxed ? 'MAXED' : `Buy ($${cost})`}
            </button>
          </div>
        );
      })}
    </div>
  );
}
