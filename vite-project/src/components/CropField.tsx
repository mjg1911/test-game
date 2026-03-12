import React, { useState } from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';
import FloatingFeedback from './FloatingFeedback';

const CROP_CONFIG = {
  wheat: { cost: 10, sellPrice: 15, growthTime: 5000 },
  corn: { cost: 20, sellPrice: 30, growthTime: 8000 },
};

interface FeedbackEntry {
  id: number;
  amount: number;
}

const CropField: React.FC = () => {
  const { state, dispatch } = useGameStateContext();
  const [selectedCrop, setSelectedCrop] = useState<keyof typeof CROP_CONFIG>('wheat');
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);

  const handlePlant = () => {
    const config = CROP_CONFIG[selectedCrop];
    if (state.resources.money >= config.cost) {
      dispatch({ type: 'PLANT_CROP', crop: selectedCrop, amount: 1 });
    } else {
      alert('Not enough money!');
    }
  };

  const handleHarvest = (crop: string) => {
    const cropData = state.crops[crop];
    const isReady = cropData && cropData.count > 0 && cropData.plantedAt !== null && (Date.now() - cropData.plantedAt >= cropData.growthTime);
    if (isReady) {
      const profit = CROP_CONFIG[crop].sellPrice * cropData.count;
      dispatch({ type: 'HARVEST_CROP', crop, amount: cropData.count, profit });
      setFeedbacks(prev => [...prev, { id: Date.now(), amount: profit }]);
    } else {
      alert('Crops not ready to harvest yet!');
    }
  };

  // Remove feedback after timer (handled in FloatingFeedback)
  const handleFeedbackFinish = (id: number) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <span className="pixel-section-label">Select Crop:</span>
        <div style={{ marginTop: 8 }}>
          <select className="pixel-select" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value as keyof typeof CROP_CONFIG)}>
            <option value="wheat">🌾 Wheat ($10)</option>
            <option value="corn">🌽 Corn ($20)</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, position: 'relative', height: 40 }}>
        <button className="pixel-button" onClick={handlePlant}>
          Plant {selectedCrop === 'wheat' ? '🌾' : '🌽'}
        </button>
        <button className="pixel-button" onClick={() => handleHarvest(selectedCrop)}>
          Harvest {selectedCrop === 'wheat' ? '🌾' : '🌽'} ({state.crops[selectedCrop]?.count || 0})
        </button>
        {/* Render floating feedback popups */}
        {feedbacks.length > 0 && (
          <div style={{ position: 'absolute', top: -20, left: '50%' }}>
            {feedbacks.map(feedback => (
              <FloatingFeedback
                key={feedback.id}
                amount={feedback.amount}
                duration={1500}
                onFinish={() => handleFeedbackFinish(feedback.id)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="pixel-grid">
        {Object.entries(state.crops).map(([crop, data]: [string, any]) => {
          const progress = data.plantedAt !== null
            ? Math.min(100, Math.floor(((Date.now() - data.plantedAt) / data.growthTime) * 100))
            : 0;
          return (
            <div key={crop} className="pixel-stat">
              <div className="pixel-stat-label">
                {crop === 'wheat' ? '🌾' : '🌽'} {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </div>
              <div className="pixel-stat-value">Count: {data.count}</div>
              <div className="pixel-progress">
                <div className="pixel-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <div style={{ fontSize: 7, color: '#8b5e3c', marginTop: 4 }}>
                {progress === 100 ? 'READY!' : `${progress}%`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CropField;
