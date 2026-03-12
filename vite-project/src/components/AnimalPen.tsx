import React, { useState } from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const ANIMAL_CONFIG = {
  cow: { cost: 100, produce: 'milk', cooldown: 10000 },
  chicken: { cost: 25, produce: 'eggs', cooldown: 5000 }
};

export default function AnimalPen() {
  const { state, dispatch } = useGameStateContext();
  const [selectedAnimal, setSelectedAnimal] = useState<keyof typeof ANIMAL_CONFIG>('chicken');

  const handleBuy = () => {
    const config = ANIMAL_CONFIG[selectedAnimal];
    if (state.resources.money >= config.cost) {
      dispatch({ 
        type: 'BUY_ANIMAL', 
        animal: selectedAnimal, 
        amount: 1,
        cost: config.cost
      });
    } else {
      alert('Not enough money!');
    }
  };

  const handleCollect = (animal: string) => {
    const animalData = state.animals[animal];
    if (animalData && animalData.count > 0 && animalData.produceReady) {
      dispatch({ 
        type: 'COLLECT_PRODUCE', 
        animal 
      });
    } else {
      alert('Produce not ready yet!');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span className="pixel-section-label">Select Animal:</span>
        <div style={{ marginTop: 8 }}>
          <select 
            className="pixel-select"
            value={selectedAnimal} 
            onChange={(e) => setSelectedAnimal(e.target.value as keyof typeof ANIMAL_CONFIG)}
          >
            <option value="chicken">🐔 Chicken ($25)</option>
            <option value="cow">🐄 Cow ($100)</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="pixel-button" onClick={handleBuy}>
          Buy {selectedAnimal === 'chicken' ? '🐔' : '🐄'}
        </button>
        <button className="pixel-button" onClick={() => handleCollect(selectedAnimal)}>
          Collect {selectedAnimal === 'chicken' ? '🥚' : '🥛'} ({state.animals[selectedAnimal]?.count || 0})
        </button>
      </div>
      <div className="pixel-grid">
        {Object.entries(state.animals).map(([animal, data]: [string, any]) => (
          <div key={animal} className="pixel-stat">
            <div className="pixel-stat-label">
              {animal === 'chicken' ? '🐔' : '🐄'} {animal.charAt(0).toUpperCase() + animal.slice(1)}
            </div>
            <div className="pixel-stat-value">Count: {data.count}</div>
            <div style={{ 
              fontSize: 8, 
              marginTop: 4,
              color: data.produceReady ? '#6bcb4d' : '#8b5e3c',
              fontWeight: 'bold'
            }}>
              {data.produceReady ? '✓ PRODUCE READY!' : '⏳ Producing...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
