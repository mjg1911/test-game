import React, { useState, useEffect } from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';
import Popup from './Popup';

const CROP_CONFIG = {
  wheat: { baseCost: 10, cooldown: 5000 },
  corn: { baseCost: 20, cooldown: 8000 }
};

const getCost = (baseCost: number, count: number) => Math.floor(baseCost * Math.pow(1.15, count));

const CropField: React.FC = () => {
  const { state, dispatch } = useGameStateContext();
  const [tick, setTick] = useState(0);
  const [popup, setPopup] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (lastHarvest: number | null, cooldown: number) => {
    if (!lastHarvest) return { ready: true, text: 'READY' };
    const elapsed = Date.now() - lastHarvest;
    const remaining = Math.max(0, cooldown - elapsed);
    if (remaining === 0) return { ready: true, text: '⏰ READY!' };
    const seconds = Math.ceil(remaining / 1000);
    return { ready: false, text: `⏳ ${seconds}s` };
  };

  const handleBuy = (crop: string) => {
    const config = CROP_CONFIG[crop as keyof typeof CROP_CONFIG];
    const currentCost = getCost(config.baseCost, state.crops[crop].count);
    if (state.resources.money >= currentCost) {
      dispatch({ type: 'BUY_PLOT', crop });
    } else {
      setPopup({ message: `Need $${currentCost} to buy!`, type: 'error' });
    }
  };

  const handleCollect = (crop: string) => {
    const cropData = state.crops[crop];
    if (cropData.count === 0) {
      setPopup({ message: 'Buy a plot first!', type: 'info' });
      return;
    }
    const elapsed = cropData.lastHarvest ? Date.now() - cropData.lastHarvest : 0;
    if (elapsed < cropData.cooldown) {
      setPopup({ message: 'Not ready yet!', type: 'info' });
      return;
    }
    dispatch({ type: 'COLLECT_CROP', crop });
  };

  return (
    <div>
      <div className="pixel-grid">
        {Object.entries(state.crops).map(([crop, data]: [string, any]) => {
          const timeInfo = getTimeRemaining(data.lastHarvest, data.cooldown);
          const cropCost = getCost(CROP_CONFIG[crop as keyof typeof CROP_CONFIG].baseCost, data.count);
          const emoji = crop === 'wheat' ? '🌾' : '🌽';
          return (
            <div key={crop} className="pixel-stat">
              <div className="pixel-stat-label">
                {emoji} {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </div>
              <div className="pixel-stat-value">
                Plots: {data.count} | Cost: ${cropCost}
              </div>
              <div style={{ 
                fontSize: 7, 
                color: timeInfo?.ready ? '#22c55e' : '#8b5e3c', 
                marginTop: 4,
                fontWeight: timeInfo?.ready ? 'bold' : 'normal'
              }}>
                {data.count > 0 ? (
                  timeInfo?.ready ? (
                    <span style={{ animation: 'pulse 1s infinite', display: 'inline-block' }}>
                      {timeInfo.text}
                    </span>
                  ) : timeInfo?.text || '—'
                ) : 'Buy your first plot!'}
              </div>
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
                  disabled={data.count === 0}
                >
                  Collect ({state.resources[crop] || 0})
                </button>
              </div>
            </div>
          );
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
