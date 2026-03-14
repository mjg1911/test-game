import { useState, useEffect } from 'react';
import { useGameStateContext, getRevealedUnlockedAnimals } from '../providers/GameStateProvider';
import Popup from './Popup';

const ANIMAL_CONFIG = {
  cow: { baseCost: 1000, cooldown: 100000, produceValue: 15 },
  chicken: { baseCost: 250, cooldown: 50000, produceValue: 5 },
  sheep: { baseCost: 350, cooldown: 80000, produceValue: 12 },
  pig: { baseCost: 600, cooldown: 120000, produceValue: 20 },
  goat: { baseCost: 400, cooldown: 90000, produceValue: 14 },
  rabbit: { baseCost: 150, cooldown: 60000, produceValue: 8 },
  duck: { baseCost: 200, cooldown: 70000, produceValue: 10 }
};

const getCost = (baseCost: number, count: number) => Math.floor(baseCost * Math.pow(1.3, count));

export default function AnimalPen() {
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

  const handleBuy = (animal: string) => {
    const key = animal as keyof typeof ANIMAL_CONFIG;
    const config = ANIMAL_CONFIG[key];
    const animalState = state.animals[key];
    const currentCost = getCost(config.baseCost, animalState.count);
    if (state.resources.money >= currentCost) {
      dispatch({ type: 'BUY_ANIMAL', animal: key });
    } else {
      setPopup({ message: `Need $${currentCost} to buy!`, type: 'error' });
    }
  };

  const handleCollect = (animal: string) => {
    const key = animal as keyof typeof state.animals;
    const animalData = state.animals[key];
    if (animalData.count === 0) {
      setPopup({ message: 'Buy an animal first!', type: 'info' });
      return;
    }
    const elapsed = animalData.lastHarvest ? Date.now() - animalData.lastHarvest : 0;
    if (elapsed < animalData.cooldown) {
      setPopup({ message: 'Not ready yet!', type: 'info' });
      return;
    }
    dispatch({ type: 'COLLECT_ANIMAL', animal: key });
  };

  return (
    <div>
      <div className="pixel-grid">
        {getRevealedUnlockedAnimals(state).map((animal) => {
          const data = state.animals[animal as keyof typeof state.animals];
          const progress = getProgress(data.lastHarvest, data.cooldown);
          const animalCost = getCost(ANIMAL_CONFIG[animal as keyof typeof ANIMAL_CONFIG].baseCost, data.count);
          const emoji = animal === 'chicken' ? '🐔' : animal === 'cow' ? '🐄' : animal === 'sheep' ? '🐑' : animal === 'pig' ? '🐷' : animal === 'goat' ? '🐐' : animal === 'rabbit' ? '🐰' : '🦆';
          
          return (
            <div key={animal} className="pixel-stat">
              <div className="pixel-stat-label">
                {emoji} {animal.charAt(0).toUpperCase() + animal.slice(1)}
              </div>
              <div className="pixel-stat-value">
                Owned: {data.count} | Cost: ${animalCost}
              </div>
              {data.count > 0 ? (
  <div style={{ marginTop: 4 }}>
    <div className="pixel-progress">
      <div className="pixel-progress-bar" style={{ width: `${progress}%` }} />
    </div>
    <div style={{ fontSize: 7, color: progress === 100 ? '#22c55e' : '#8b5e3c', fontWeight: progress === 100 ? 'bold' : 'normal', marginTop: 4 }}>
      {progress === 100 ? 'READY!' : `${progress}%`}
    </div>
  </div>
) : (
  <div style={{ fontSize: 7, marginTop: 4 }}>Buy your first!</div>
)}
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button 
                  className="pixel-button" 
                  style={{ 
                    fontSize: 14, 
                    padding: '12px 24px',
                    background: state.resources.money < getCost(ANIMAL_CONFIG[animal as keyof typeof ANIMAL_CONFIG].baseCost, data.count) ? '#aaa' : undefined,
                    cursor: state.resources.money < getCost(ANIMAL_CONFIG[animal as keyof typeof ANIMAL_CONFIG].baseCost, data.count) ? 'not-allowed' : 'pointer'
                  }}
                  onClick={() => handleBuy(animal)}
                >
                  Buy
                </button>
                <button 
                  className="pixel-button" 
                  style={{ fontSize: 14, padding: '12px 24px' }}
                  onClick={() => handleCollect(animal)}
                  disabled={data.count === 0}
                >
                  Collect (+{data.count * ANIMAL_CONFIG[animal as keyof typeof ANIMAL_CONFIG].baseCost})
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
}
