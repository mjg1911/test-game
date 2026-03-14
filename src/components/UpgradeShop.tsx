import React from 'react';
import { useGameStateContext, getRevealedLockedCrops, getRevealedLockedAnimals, getCropUnlockCost, getAnimalUnlockCost } from '../providers/GameStateProvider';

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
      {(() => {
        const lockedCrops = getRevealedLockedCrops(state);
        const lockedAnimals = getRevealedLockedAnimals(state);

        return (
          <>
            {lockedCrops.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #444' }}>
                <h4>🔓 Unlock Crops</h4>
                {lockedCrops.map(crop => {
                  const cost = getCropUnlockCost(crop);
                  const emoji = crop === 'sunflower' ? '🌻' : crop === 'peas' ? '🫛' : crop === 'pumpkin' ? '🎃' : crop === 'potato' ? '🥔' : '🍅';
                  return (
                    <div key={crop} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{emoji} {crop.charAt(0).toUpperCase() + crop.slice(1)}</span>
                      <button 
                        onClick={() => dispatch({ type: 'UNLOCK_CROP', crop })}
                        disabled={state.resources.money < cost}
                        style={{ marginLeft: 8 }}
                      >
                        Unlock (${cost})
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {lockedAnimals.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #444' }}>
                <h4>🔓 Unlock Animals</h4>
                {lockedAnimals.map(animal => {
                  const cost = getAnimalUnlockCost(animal);
                  const emoji = animal === 'chicken' ? '🐔' : animal === 'cow' ? '🐄' : animal === 'sheep' ? '🐑' : animal === 'pig' ? '🐷' : animal === 'goat' ? '🐐' : animal === 'rabbit' ? '🐰' : '🦆';
                  return (
                    <div key={animal} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{emoji} {animal.charAt(0).toUpperCase() + animal.slice(1)}</span>
                      <button 
                        onClick={() => dispatch({ type: 'UNLOCK_ANIMAL', animal })}
                        disabled={state.resources.money < cost}
                        style={{ marginLeft: 8 }}
                      >
                        Unlock (${cost})
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
