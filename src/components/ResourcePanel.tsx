import React from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const sellPrices = {
  wheat: 15,
  corn: 30,
  sunflower: 45,
  peas: 65,
  pumpkin: 85,
  potato: 110,
  tomato: 145
};

const maxPerFarmer = 10;

const ResourcePanel: React.FC = () => {
  const { state } = useGameStateContext();

  // Calculate passive income per second
  let passiveIncomePerSec = 0;
  for (const cropKey of Object.keys(state.crops) as (keyof typeof state.crops)[]) {
    const crop = state.crops[cropKey];
    if (crop && crop.count > 0 && (crop.farmers || 0) > 0) {
      const sellPrice = sellPrices[cropKey as keyof typeof sellPrices] || 15;
      let yieldMultiplier = 1;
      if (state.upgrades && state.upgrades.fertilizer && state.upgrades.fertilizer.level > 0) {
        yieldMultiplier = 1 + 0.5 * state.upgrades.fertilizer.level;
      }
      const farmers = crop.farmers || 0;
      const toSell = Math.min(farmers * maxPerFarmer, crop.count);
      const cooldownSec = (crop.cooldown || 5000) / 1000;
      const perTimer = toSell * sellPrice * yieldMultiplier;
      passiveIncomePerSec += perTimer / cooldownSec;
    }
  }

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
          <span className="pixel-resource-icon">⏳</span>
          <span className="pixel-resource-label">Passive income / sec:</span>
          <span className="pixel-resource-value" data-testid="passive-income">{passiveIncomePerSec.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;
