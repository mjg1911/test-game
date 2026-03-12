import React, { useState, useEffect } from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';
import Popup from './Popup';

const CROP_CONFIG = {
  wheat: { cost: 10, sellPrice: 15, growthTime: 5000 },
  corn: { cost: 20, sellPrice: 30, growthTime: 8000 }
};

const CropField: React.FC = () => {
  const { state, dispatch } = useGameStateContext();
  const [selectedCrop, setSelectedCrop] = useState<keyof typeof CROP_CONFIG>('wheat');
  const [tick, setTick] = useState(0);
  const [popup, setPopup] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('[CropField] State updated - crops:', state.crops, 'money:', state.resources.money);
  }, [state.crops, state.resources.money]);

  const getTimeRemaining = (plantedAt: number | null, growthTime: number) => {
    if (!plantedAt) return null;
    const elapsed = Date.now() - plantedAt;
    const remaining = Math.max(0, growthTime - elapsed);
    if (remaining === 0) return { ready: true, text: '⏰ READY!' };
    const seconds = Math.ceil(remaining / 1000);
    return { ready: false, text: `⏳ ${seconds}s` };
  };

  const handlePlant = () => {
    console.log('[CropField] handlePlant called, selectedCrop:', selectedCrop);
    console.log('[CropField] current money:', state.resources.money);
    const config = CROP_CONFIG[selectedCrop];
    console.log('[CropField] crop config:', config);
    if (state.resources.money >= config.cost) {
      console.log('[CropField] Dispatching PLANT_CROP action');
      dispatch({ 
        type: 'PLANT_CROP', 
        crop: selectedCrop, 
        amount: 1
      });
      console.log('[CropField] After dispatch, crops state:', state.crops[selectedCrop]);
    } else {
      setPopup({ message: 'Not enough money!', type: 'error' });
    }
  };

  const handleHarvest = (crop: string) => {
    const cropData = state.crops[crop];
    const isReady = cropData && cropData.count > 0 && cropData.plantedAt && (Date.now() - cropData.plantedAt >= cropData.growthTime);
    if (isReady) {
      dispatch({
        type: 'HARVEST_CROP',
        crop,
        amount: cropData.count,
        profit: CROP_CONFIG[crop].sellPrice * cropData.count
      });
    } else {
      setPopup({ message: 'Crops not ready to harvest yet!', type: 'info' });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span className="pixel-section-label">Select Crop:</span>
        <div style={{ marginTop: 8 }}>
          <select 
            className="pixel-select"
            value={selectedCrop} 
            onChange={(e) => setSelectedCrop(e.target.value as keyof typeof CROP_CONFIG)}
          >
            <option value="wheat">🌾 Wheat ($10)</option>
            <option value="corn">🌽 Corn ($20)</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="pixel-button" onClick={handlePlant}>
          Plant {selectedCrop === 'wheat' ? '🌾' : '🌽'}
        </button>
        <button className="pixel-button" onClick={() => handleHarvest(selectedCrop)}>
          Harvest {selectedCrop === 'wheat' ? '🌾' : '🌽'} ({state.crops[selectedCrop]?.count || 0})
        </button>
      </div>
      <div className="pixel-grid">
        {Object.entries(state.crops).map(([crop, data]: [string, any]) => {
          const progress = data.plantedAt 
            ? Math.min(100, Math.floor(((Date.now() - data.plantedAt) / data.growthTime) * 100))
            : 0;
          const timeInfo = getTimeRemaining(data.plantedAt, data.growthTime);
          return (
            <div key={crop} className="pixel-stat">
              <div className="pixel-stat-label">
                {crop === 'wheat' ? '🌾' : '🌽'} {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </div>
              <div className="pixel-stat-value">Count: {data.count}</div>
              <div className="pixel-progress">
                <div 
                  className="pixel-progress-bar" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div style={{ 
                fontSize: 7, 
                color: timeInfo?.ready ? '#22c55e' : '#8b5e3c', 
                marginTop: 4,
                fontWeight: timeInfo?.ready ? 'bold' : 'normal'
              }}>
                {timeInfo?.ready ? (
                  <span style={{ animation: 'pulse 1s infinite', display: 'inline-block' }}>
                    {timeInfo.text}
                  </span>
                ) : timeInfo?.text || '—'}
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
