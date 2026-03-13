import React from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const SELL_PRICES: Record<string, number> = {
  wheat: 1.5,
  corn: 3,
  sunflower: 4.5,
  peas: 6.5,
  pumpkin: 8.5,
  potato: 11,
  tomato: 14.5
};

const BASE_COOLDOWNS: Record<string, number> = {
  wheat: 5000,
  corn: 8000,
  sunflower: 10000,
  peas: 12000,
  pumpkin: 14000,
  potato: 17000,
  tomato: 21000
};

const INCOME_MULTIPLIER = 1.3;

const ResourcePanel: React.FC = () => {
  const { state } = useGameStateContext();

  // Calculate passive income per second using new farm system
  let passiveIncomePerSec = 0;
  for (const cropKey of Object.keys(state.crops) as (keyof typeof state.crops)[]) {
    const crop = state.crops[cropKey];
    if (crop && crop.count > 0) {
      const sellPrice = SELL_PRICES[cropKey] || 15;
      const cooldown = BASE_COOLDOWNS[cropKey] || 5000;
      const baseIncomePerFarm = sellPrice / (cooldown / 1000);
      const upgradeLevel = (crop.fertilizerLevel || 0) + (crop.irrigationLevel || 0);
      const multiplier = Math.pow(INCOME_MULTIPLIER, upgradeLevel);
      passiveIncomePerSec += baseIncomePerFarm * crop.count * multiplier;
    }
  }

  const displayMoney = Math.floor(state.resources.money);
  const displayPassiveIncome = Math.floor(passiveIncomePerSec);
  
  const formatMoney = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  return (
    <div className="pixel-panel" style={{ marginBottom: 16 }}>
      <h3 className="pixel-panel-title">💰 RESOURCES</h3>
      <div className="pixel-resources">
        <div className="pixel-resource">
          <span className="pixel-resource-icon">💵</span>
          <span className="pixel-resource-label">Money:</span>
          <span className="pixel-resource-value" data-testid="money">${formatMoney(displayMoney)}</span>
        </div>
        <div className="pixel-resource">
          <span className="pixel-resource-icon">⏳</span>
          <span className="pixel-resource-label">Passive income:</span>
          <span className="pixel-resource-value" data-testid="passive-income">+${formatMoney(displayPassiveIncome)}/s</span>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;
