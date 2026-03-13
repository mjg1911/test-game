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
          const emoji = crop === 'wheat' ? '🌾' : '🌽';
          
          const baseIncome = (data?.count ?? 0) * CROP_CONFIG[crop].sellPrice;
          const fertilizerMultiplier = 1 + ((data?.fertilizerLevel || 0) * 0.25);
          const irrigationMultiplier = 1 + ((data?.irrigationLevel || 0) * 0.1);
          const incomePerSecond = (baseIncome * fertilizerMultiplier * irrigationMultiplier) / (CROP_CONFIG[crop].cooldown / 1000);
          
          const fertilizerLevel = data?.fertilizerLevel || 0;
          const irrigationLevel = data?.irrigationLevel || 0;
          const fertilizerCost = getUpgradeCost(fertilizerLevel);
          const irrigationCost = getUpgradeCost(irrigationLevel);
          
          return (
            <div key={crop} className="pixel-stat">
              <div className="pixel-stat-label">
                {emoji} {crop.charAt(0).toUpperCase() + crop.slice(1)}
                {data?.count > 0 && (
                  <span style={{fontSize:8, color:'#888', marginLeft:6}}>
                    +${incomePerSecond.toFixed(2)} $/s
                  </span>
                )}
              </div>
              <div className="pixel-stat-value">
                Farms: {data?.count ?? 0} | Cost: ${cropCost}
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button 
                  className="pixel-button" 
                  style={{ fontSize: 14, padding: '12px 24px' }}
                  onClick={() => handleBuyFarm(crop)}
                >
                  Buy Farm
                </button>
              </div>
              
              {data?.count > 0 && (
                <div style={{ marginTop: 12, padding: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4 }}>
                  <div style={{ fontSize: 7, marginBottom: 4 }}>
                    Fertilizer Lv.{fertilizerLevel} | Irrigation Lv.{irrigationLevel}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      className="pixel-button" 
                      style={{ fontSize: 12, padding: '8px 16px' }}
                      onClick={() => handleUpgrade(crop, 'fertilizer')}
                      disabled={state.resources.money < fertilizerCost}
                    >
                      Fertilizer (${fertilizerCost})
                    </button>
                    <button 
                      className="pixel-button" 
                      style={{ fontSize: 12, padding: '8px 16px' }}
                      onClick={() => handleUpgrade(crop, 'irrigation')}
                      disabled={state.resources.money < irrigationCost}
                    >
                      Irrigation (${irrigationCost})
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
