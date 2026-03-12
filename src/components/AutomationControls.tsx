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
    <section style={{ padding: '1em', border: '1px solid #667', background: '#222', color: '#7bdfff', fontFamily: 'monospace', borderRadius: 6, marginBottom: '1em' }}>
      <h3>Automation Controls</h3>
      <button
        type="button"
        onClick={() => setEnabled((prev) => !prev)}
        aria-label={enabled ? 'Disable Automation' : 'Enable Automation'}
        style={{ background: enabled ? '#4a4' : '#666' }}
      >
        {enabled ? 'Disable Automation' : 'Enable Automation'}
      </button>
      {enabled && <span style={{ marginLeft: '1em' }}>Running...</span>}
    </section>
  );
};

export default AutomationControls;
