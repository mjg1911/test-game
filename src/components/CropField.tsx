import React, { useState, useEffect } from 'react';
import { useGameStateContext, getFarmerCost } from '../providers/GameStateProvider';
import Popup from './Popup';

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

const CropField: React.FC = () => {
  const { state, dispatch } = useGameStateContext();
  
  const [popup, setPopup] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  

  const getProgress = (lastHarvest: number | null, cooldown: number) => {
    if (!lastHarvest) return 100;
    const elapsed = Date.now() - lastHarvest;
    const progress = Math.min(100, Math.floor((elapsed / cooldown) * 100));
    return progress;
};

  const handleBuy = (crop: keyof typeof CROP_CONFIG) => {
  try {
    const config = CROP_CONFIG[crop];
    const currentCost = getCost(config.baseCost, state.crops[crop]?.count ?? 0);
    if (state.resources.money >= currentCost) {
      dispatch({ type: 'BUY_PLOT', crop });
    } else {
      setPopup({ message: `Need $${currentCost} to buy!`, type: 'error' });
    }
  } catch (err) {
    setPopup({ message: `Error buying crop: ${crop} - ${err}`, type: 'error' });
  }
};

  const handleCollect = (crop: keyof typeof CROP_CONFIG) => {
    const cropData = state.crops[crop];
    if (!cropData || cropData.count === 0) {
      setPopup({ message: 'Buy a plot first!', type: 'info' });
      return;
    }
    const progress = getProgress(cropData.lastHarvest, cropData.cooldown);
    if (progress < 100) {
      setPopup({ message: 'Crop not ready!', type: 'info' });
      return;
    }
    dispatch({ type: 'COLLECT_CROP', crop });
  };

  const handleBuyFarmer = (crop: keyof typeof CROP_CONFIG) => {
    const cropData = state.crops[crop];
    if (!cropData || cropData.count === 0) {
      setPopup({ message: 'Buy a plot first!', type: 'info' });
      return;
    }
    const farmers = cropData.farmers || 0;
    const cost = getFarmerCost(crop, farmers);
    if (state.resources.money >= cost) {
      dispatch({ type: 'BUY_FARMER', crop });
    } else {
      setPopup({ message: `Need $${cost} to buy farmer!`, type: 'error' });
    }
  };

// Remove tick, timer, and getTimeRemaining


  return (
    <div>
      <div className="pixel-grid">
        {(Object.keys(CROP_CONFIG) as (keyof typeof CROP_CONFIG)[]).map(crop => {
  const data = state.crops[crop];
          
          const cropCost = getCost(CROP_CONFIG[crop].baseCost, data?.count ?? 0);
const emoji = crop === 'wheat' ? '🌾' : '🌽';
    return (
      <div key={crop} className="pixel-stat">
        <div className="pixel-stat-label">
          {emoji} {crop.charAt(0).toUpperCase() + crop.slice(1)}
        </div>
        <div className="pixel-stat-value">
          Plots: {data?.count ?? 0} | Cost: ${cropCost}
        </div>
        {data?.count > 0 ? (
          <div>
            <div className="pixel-progress" style={{ marginTop: 4 }}>
              <div className="pixel-progress-bar" style={{ width: `${getProgress(data.lastHarvest, data.cooldown)}%` }} />
            </div>
            <div style={{ fontSize: 7, color: getProgress(data.lastHarvest, data.cooldown) === 100 ? '#22c55e' : '#8b5e3c', marginTop: 4 }}>
              {getProgress(data.lastHarvest, data.cooldown) === 100 ? 'READY!' : `${getProgress(data.lastHarvest, data.cooldown)}%`}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 7, marginTop: 4 }}>Buy your first plot!</div>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button 
            className="pixel-button" 
            style={{ fontSize: 14, padding: '12px 24px' }}
            onClick={() => handleBuy(crop)}
          >
            Buy
          </button>
          <button 
            className="pixel-button" 
            style={{ fontSize: 14, padding: '12px 24px' }}
            onClick={() => handleCollect(crop)}
            disabled={data?.count === 0}
          >
            Collect (+{(data?.count ?? 0) * CROP_CONFIG[crop].sellPrice})
          </button>
        </div>
        {data?.count > 0 && (
          <div style={{ marginTop: 12, padding: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4 }}>
            <div style={{ fontSize: 7, marginBottom: 4 }}>
              Farmers: {data?.farmers ?? 0} | {(data?.farmers ?? 0) > 0 ? 'Auto-sell active' : 'No auto-sell'}
            </div>
            {(data?.farmers ?? 0) > 0 && (
              <div style={{ fontSize: 6, color: '#22c55e', marginBottom: 4 }}>
                Each farmer sells up to 10 crops per timer
              </div>
            )}
            <button 
              className="pixel-button" 
              style={{ fontSize: 12, padding: '8px 16px' }}
              onClick={() => handleBuyFarmer(crop)}
              disabled={state.resources.money < getFarmerCost(crop, data?.farmers ?? 0)}
            >
              Buy Farmer (${getFarmerCost(crop, data?.farmers ?? 0)})
            </button>
          </div>
        )}
      </div>
          );

// Remove unused timer/timeInfo references
        })}
      </div>
      {popup && (
        <Popup 
          message={popup.message} 
          type={popup.type} 
          onClose={() => setPopup(null)} 
        />
      )}
    </div>
  );
};

export default CropField;
