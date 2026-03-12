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
    <div style={{ padding: '1em', border: '1px solid #8b4513', background: '#3d2817', color: '#fff', fontFamily: 'monospace', borderRadius: 6 }}>
      <h3>Animal Pen</h3>
      <div style={{ marginBottom: '1em' }}>
        <select 
          value={selectedAnimal} 
          onChange={(e) => setSelectedAnimal(e.target.value as keyof typeof ANIMAL_CONFIG)}
        >
          <option value="chicken">Chicken (Cost: 25)</option>
          <option value="cow">Cow (Cost: 100)</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <button onClick={handleBuy}>Buy {selectedAnimal}</button>
        <button onClick={() => handleCollect(selectedAnimal)}>
          Collect ({state.animals[selectedAnimal]?.count || 0})
        </button>
      </div>
      <div style={{ marginTop: '1em' }}>
        {Object.entries(state.animals).map(([animal, data]: [string, any]) => (
          <div key={animal}>
            <span style={{ marginRight: 8 }}>{animal.charAt(0).toUpperCase() + animal.slice(1)}: {data.count}, Produce Ready: {data.produceReady ? 'Yes' : 'No'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
