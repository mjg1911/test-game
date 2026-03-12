import React, { useState } from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const CROP_CONFIG = {
  wheat: { cost: 10, sellPrice: 15, growthTime: 5000 },
  corn: { cost: 20, sellPrice: 30, growthTime: 8000 }
};

const CropField: React.FC = () => {
  const { state, dispatch } = useGameStateContext();
  const [selectedCrop, setSelectedCrop] = useState<keyof typeof CROP_CONFIG>('wheat');

  const handlePlant = () => {
    const config = CROP_CONFIG[selectedCrop];
    if (state.resources.money >= config.cost) {
      dispatch({ 
        type: 'PLANT_CROP', 
        crop: selectedCrop, 
        amount: 1
      });
    } else {
      alert('Not enough money!');
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
      alert('Crops not ready to harvest yet!');
    }
  };

  return (
    <section style={{ padding: '1em', border: '1px solid #b2e673', background: '#304f1b', color: '#fff', fontFamily: 'monospace', borderRadius: 6 }}>
      <h3>Crop Field</h3>
      <div style={{ display: 'flex', gap: '0.5em', marginBottom: '1em' }}>
        <select 
          value={selectedCrop} 
          onChange={(e) => setSelectedCrop(e.target.value as keyof typeof CROP_CONFIG)}
        >
          <option value="wheat">Wheat (Cost: 10)</option>
          <option value="corn">Corn (Cost: 20)</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <button onClick={handlePlant}>Plant {selectedCrop}</button>
        <button onClick={() => handleHarvest(selectedCrop)}>
          Harvest {state.crops[selectedCrop]?.count || 0} {selectedCrop}
        </button>
      </div>
      <div style={{ marginTop: '1em' }}>
        {Object.entries(state.crops).map(([crop, data]: [string, any]) => (
          <div key={crop}>
            <span style={{ marginRight: 8 }}>{crop.charAt(0).toUpperCase() + crop.slice(1)}: {data.count}</span>
            {data.plantedAt ? (
              <span>Growth: {Math.min(100, Math.floor(((Date.now() - data.plantedAt) / data.growthTime) * 100))}%</span>
            ) : (
              <span>Growth: 0%</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CropField;
