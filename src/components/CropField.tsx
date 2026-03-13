import React, { useState, useEffect } from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const CROP_CONFIG = {
  wheat: { baseCost: 10, cooldown: 5000, sellPrice: 15 },
  corn: { baseCost: 20, cooldown: 8000, sellPrice: 30 },
  sunflower: { baseCost: 30, cooldown: 10000, sellPrice: 45 },
  peas: { baseCost: 40, cooldown: 12000, sellPrice: 65 },
  pumpkin: { baseCost: 50, cooldown: 14000, sellPrice: 85 },
  potato: { baseCost: 70, cooldown: 17000, sellPrice: 110 },
  tomato: { baseCost: 100, cooldown: 21000, sellPrice: 145 }
};

const getCost = (baseCost: number, count: number) => Math.floor(baseCost * Math.pow(1.15, count));

const getUpgradeCost = (level: number) => Math.floor(100 * Math.pow(2, level));

const CropField: React.FC = () => {
  const { state, dispatch } = useGameStateContext();
  
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  const handleBuyFarm = (crop: keyof typeof CROP_CONFIG) => {
    const config = CROP_CONFIG[crop];
    const currentCost = getCost(config.baseCost, state.crops[crop]?.count ?? 0);
    if (state.resources.money >= currentCost) {
      dispatch({ type: 'BUY_PLOT', crop });
    }
  };

  const handleUpgrade = (crop: keyof typeof CROP_CONFIG, upgradeType: 'fertilizer' | 'irrigation') => {
    const cropData = state.crops[crop];
    if (!cropData || cropData.count === 0) return;
    
    const level = upgradeType === 'fertilizer' 
      ? (cropData.fertilizerLevel || 0) 
      : (cropData.irrigationLevel || 0);
    const cost = getUpgradeCost(level);
    
    if (state.resources.money >= cost) {
      dispatch({ type: 'UPGRADE_FARM', crop, upgradeType });
    }
  };

  return (
    <div>
      <div className="pixel-grid">
        {(Object.keys(CROP_CONFIG) as (keyof typeof CROP_CONFIG)[]).map(crop => {
          const data = state.crops[crop];
          const cropCost = getCost(CROP_CONFIG[crop].baseCost, data?.count ?? 0);
          const emoji = crop === 'wheat' ? '🌾' : crop === 'corn' ? '🌽' : '🌻';
          
          const baseIncome = (data?.count ?? 0) * CROP_CONFIG[crop].sellPrice;
          const fertilizerMultiplier = 1 + ((data?.fertilizerLevel || 0) * 0.25);
          const irrigationMultiplier = 1 + ((data?.irrigationLevel || 0) * 0.1);
          const incomePerSecond = Math.floor((baseIncome * fertilizerMultiplier * irrigationMultiplier) / (CROP_CONFIG[crop].cooldown / 1000));
          
          const fertilizerLevel = data?.fertilizerLevel || 0;
          const irrigationLevel = data?.irrigationLevel || 0;
          
          const getNextUpgrade = () => {
            if (fertilizerLevel <= irrigationLevel) {
              return { type: 'fertilizer' as const, level: fertilizerLevel, name: 'Fertilizer' };
            }
            return { type: 'irrigation' as const, level: irrigationLevel, name: 'Irrigation' };
          };
          
          const nextUpgrade = getNextUpgrade();
          const upgradeCost = getUpgradeCost(nextUpgrade.level);
          
          const formatMoney = (n: number) => {
            if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
            return n.toString();
          };
          
          const hasFarms = (data?.count ?? 0) > 0;
          
          return (
            <div key={crop} className="pixel-stat" style={{ padding: 12, background: hasFarms ? 'rgba(0,100,0,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 8, border: hasFarms ? '1px solid rgba(0,150,0,0.3)' : '1px solid rgba(0,0,0,0.1)' }}>
              <div className="pixel-stat-label" style={{ fontSize: 14, marginBottom: 4 }}>
                {emoji} {crop.charAt(0).toUpperCase() + crop.slice(1)}
                {hasFarms && (
                  <span style={{ fontSize: 11, color: '#22c55e', marginLeft: 8, fontWeight: 'bold' }}>
                    +${formatMoney(incomePerSecond)}/s
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#666' }}>Farms</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>{data?.count ?? 0}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#666' }}>Cost</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>${formatMoney(cropCost)}</div>
                </div>
                <button 
                  className="pixel-button" 
                  style={{ fontSize: 11, padding: '8px 16px' }}
                  onClick={() => handleBuyFarm(crop)}
                >
                  Buy
                </button>
              </div>
              
              {hasFarms && (
                <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px dashed rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 9, color: '#888' }}>
                      ↑ Fertilizer {fertilizerLevel} | Irrigation {irrigationLevel}
                    </div>
                    <button 
                      className="pixel-button" 
                      style={{ fontSize: 10, padding: '6px 12px' }}
                      onClick={() => handleUpgrade(crop, nextUpgrade.type)}
                      disabled={state.resources.money < upgradeCost}
                    >
                      {nextUpgrade.name} (${formatMoney(upgradeCost)})
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CropField;
