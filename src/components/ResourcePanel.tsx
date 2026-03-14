import React from 'react';
import { useGameStateContext, getIncomeMultiplier, SELL_PRICES, cropConfig } from '../providers/GameStateProvider';

const ResourcePanel: React.FC = () => {
  const { state } = useGameStateContext();

  // Calculate passive income per second using new farm system
  let passiveIncomePerSec = 0;
  for (const cropKey of Object.keys(state.crops) as (keyof typeof state.crops)[]) {
    const crop = state.crops[cropKey];
    if (crop && crop.count > 0) {
      const sellPrice = SELL_PRICES[cropKey] || 1;
      const config = cropConfig[cropKey];
      const cooldown = config?.cooldown || 1000;
      const baseIncomePerFarm = sellPrice / (cooldown / 1000);
      const upgradeLevel = (crop.fertilizerLevel || 0) + (crop.irrigationLevel || 0);
      const multiplier = Math.pow(getIncomeMultiplier(cropKey), upgradeLevel);
      passiveIncomePerSec += baseIncomePerFarm * crop.count * multiplier;
    }
  }

  const displayMoney = Math.floor(state.resources.money);

  const formatMoney = (n: number) => {
    if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Q';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toString();
  };

  // New semantic resource header row container
  return (
    <div className="glass-panel" style={{ marginBottom: 'var(--space-md)' }}>
      <h3 className="heading-section">💰 Resources</h3>
      <div className="resource-header-container" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div className="resource" style={{ flex: 1 }}>
          <span className="resource-icon">💵</span>
          <span className="stat-label">Money:</span>
          <span className="resource-value" data-testid="money" aria-label="Money value">{`$${formatMoney(displayMoney)}`}</span>
        </div>
        <div className="resource right" style={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }}>
          <span className="resource-icon">⏳</span>
          <span className="stat-label">Passive income:</span>
          <span className="resource-value" data-testid="passive-income" aria-label="Passive income">+${formatMoney(Math.floor(passiveIncomePerSec))}/s</span>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;
