import React, { useState, useEffect } from 'react';
import { useGameStateContext, getIncomeMultiplier, cropConfig, SELL_PRICES } from '../providers/GameStateProvider';

const CROP_KEYS = ['wheat', 'corn', 'potatoes', 'sugarcane', 'cotton', 'coffeeBeans', 'cocoaPods', 'goldenApples', 'starfruit', 'moonMelons', 'etherealLotus', 'chronoVines', 'voidBerries'] as const;

type CropKey = typeof CROP_KEYS[number];

const CROP_EMOJI: Record<CropKey, string> = {
  wheat: '🌾',
  corn: '🌽',
  potatoes: '🥔',
  sugarcane: '🎋',
  cotton: '☁️',
  coffeeBeans: '☕',
  cocoaPods: '🍫',
  goldenApples: '🍎',
  starfruit: '⭐',
  moonMelons: '🌙',
  etherealLotus: '🪷',
  chronoVines: '⏳',
  voidBerries: '🫐'
};

const formatMoney = (n: number) => {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Q';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
};

const getCost = (baseCost: number, count: number, crop: string) => Math.floor(baseCost * Math.pow(getIncomeMultiplier(crop), count));

const getUpgradeCost = (level: number) => Math.floor(100 * Math.pow(2, level));

const formatCropName = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const CropField: React.FC = () => {
  const { state, dispatch } = useGameStateContext();
  
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  const handleBuyFarm = (crop: CropKey) => {
    const config = cropConfig[crop];
    const currentCost = getCost(config.baseCost, state.crops[crop]?.count ?? 0, crop);
    if (state.resources.money >= currentCost) {
      dispatch({ type: 'BUY_PLOT', crop });
    }
  };

  const handleUpgrade = (crop: CropKey, upgradeType: 'fertilizer' | 'irrigation') => {
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

  const revealedCrops = (state.revealedCrops || []) as CropKey[];
  const unlockedCrops = state.unlockedCrops || [];

  return (
    <div>
      <div className="pixel-grid">
        {revealedCrops.map(crop => {
          const isUnlocked = unlockedCrops.includes(crop);
          const config = cropConfig[crop];
          const data = state.crops[crop];
          const cropCost = getCost(config.baseCost, data?.count ?? 0, crop);
          const emoji = CROP_EMOJI[crop];
          
          const sellPrice = SELL_PRICES[crop] || 1;
          const baseIncome = (data?.count ?? 0) * sellPrice;
          const fertilizerMultiplier = 1 + ((data?.fertilizerLevel || 0) * 0.25);
          const irrigationMultiplier = 1 + ((data?.irrigationLevel || 0) * 0.1);
          const incomePerSecond = (baseIncome * fertilizerMultiplier * irrigationMultiplier) / (config.cooldown / 1000);
          
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
          
          const hasFarms = (data?.count ?? 0) > 0;
          
          if (!isUnlocked) {
            return (
              <div key={crop} className="pixel-stat" style={{ 
                padding: 12, 
                background: '#ddd', 
                borderRadius: 8, 
                border: '2px dashed #999',
                opacity: 0.7
              }}>
                <div className="pixel-stat-label" style={{ fontSize: 14, marginBottom: 4, color: '#888' }}>
                  🔒 {formatCropName(crop)}
                </div>
                <div style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 20 }}>
                  Unlock in Upgrade Shop
                </div>
              </div>
            );
          }
          
          return (
            <div key={crop} className="pixel-stat" style={{ 
              padding: 12, 
              background: hasFarms ? '#e8ede3' : '#f5f5f5', 
              borderRadius: 8, 
              border: hasFarms ? '2px solid #5a7c43' : '1px solid #ddd',
              boxShadow: hasFarms ? '0 2px 6px rgba(0,0,0,0.15)' : 'none'
            }}>
              <div className="pixel-stat-label" style={{ fontSize: 14, marginBottom: 4 }}>
                {emoji} {formatCropName(crop)}
                {hasFarms && (
                  <span style={{ fontSize: 11, color: '#3d5a2a', marginLeft: 8, fontWeight: 'bold', background: '#c9d9b0', padding: '2px 6px', borderRadius: 4 }}>
                    +{incomePerSecond.toFixed(0)}/s
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#555', fontWeight: 'bold' }}>FARMS</div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#222' }}>{data?.count ?? 0}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#555', fontWeight: 'bold' }}>COST</div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#222' }}>${formatMoney(cropCost)}</div>
                </div>
                <button 
                  className="pixel-button" 
                  style={{ 
                    fontSize: 11, 
                    padding: '8px 16px',
                    background: state.resources.money < cropCost ? '#aaa' : undefined,
                    cursor: state.resources.money < cropCost ? 'not-allowed' : 'pointer'
                  }}
                  onClick={() => handleBuyFarm(crop)}
                  disabled={state.resources.money < cropCost}
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
