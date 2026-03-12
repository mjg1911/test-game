import React, { useState, useEffect } from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';
import Popup from './Popup';

const ANIMAL_CONFIG = {
  cow: { baseCost: 100, cooldown: 10000 },
  chicken: { baseCost: 25, cooldown: 5000 }
};

const getCost = (baseCost: number, count: number) => Math.floor(baseCost * Math.pow(1.15, count));

const PRODUCE_KEYS: Record<string, string> = {
  cow: 'milk',
  chicken: 'eggs'
};

export default function AnimalPen() {
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

  const handleBuy = (animal: string) => {
    const config = ANIMAL_CONFIG[animal as keyof typeof ANIMAL_CONFIG];
    const currentCost = getCost(config.baseCost, state.animals[animal].count);
    if (state.resources.money >= currentCost) {
      dispatch({ type: 'BUY_ANIMAL', animal });
    } else {
      setPopup({ message: `Need $${currentCost} to buy!`, type: 'error' });
    }
  };

  const handleCollect = (animal: string) => {
    const animalData = state.animals[animal];
    if (animalData.count === 0) {
      setPopup({ message: 'Buy an animal first!', type: 'info' });
      return;
    }
    const elapsed = animalData.lastHarvest ? Date.now() - animalData.lastHarvest : 0;
    if (elapsed < animalData.cooldown) {
      setPopup({ message: 'Not ready yet!', type: 'info' });
      return;
    }
    dispatch({ type: 'COLLECT_ANIMAL', animal });
  };

  return (
    <div>
      <div className="pixel-grid">
        {Object.entries(state.animals).map(([animal, data]: [string, any]) => {
          const timeInfo = getTimeRemaining(data.lastHarvest, data.cooldown);
          const animalCost = getCost(ANIMAL_CONFIG[animal as keyof typeof ANIMAL_CONFIG].baseCost, data.count);
          const emoji = animal === 'chicken' ? '🐔' : '🐄';
          const produceEmoji = animal === 'chicken' ? '🥚' : '🥛';
          const produceKey = PRODUCE_KEYS[animal];
          return (
            <div key={animal} className="pixel-stat">
              <div className="pixel-stat-label">
                {emoji} {animal.charAt(0).toUpperCase() + animal.slice(1)}
              </div>
              <div className="pixel-stat-value">
                Owned: {data.count} | Cost: ${animalCost}
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
                ) : 'Buy your first!'}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button 
                  className="pixel-button" 
                  style={{ fontSize: 14, padding: '12px 24px' }}
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
                  Collect ({state.resources[produceKey] || 0})
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
