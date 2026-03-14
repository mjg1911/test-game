import React, { useState, useEffect } from 'react';
import { useGameStateContext } from '../providers/GameStateProvider';

const AutomationControls: React.FC = () => {
  const { state, dispatch } = useGameStateContext();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      // Auto-harvest ready crops
      Object.entries(state.crops).forEach(([crop, data]: [string, any]) => {
        if (data.count > 0 && data.plantedAt) {
          const growthTime = data.growthTime;
          if (Date.now() - data.plantedAt >= growthTime) {
            dispatch({ 
              type: 'HARVEST_CROP', 
              crop, 
              amount: data.count,
              profit: 15 * data.count
            });
          }
        }
      });
      // Auto-collect ready animal produce
      Object.entries(state.animals).forEach(([animal, data]: [string, any]) => {
        if (data.count > 0 && data.produceReady) {
          dispatch({ type: 'COLLECT_PRODUCE', animal });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [enabled, state, dispatch]);

  return (
    <section className="glass-panel">
      <h3 className="heading-section">Automation Controls</h3>
      <button
        type="button"
        className={enabled ? 'btn btn-primary' : 'btn btn-secondary'}
        onClick={() => setEnabled((prev) => !prev)}
        aria-label={enabled ? 'Disable Automation' : 'Enable Automation'}
      >
        {enabled ? 'Disable Automation' : 'Enable Automation'}
      </button>
      {enabled && <span style={{ marginLeft: 'var(--space-md)' }}>Running...</span>}
    </section>
  );
};

export default AutomationControls;
