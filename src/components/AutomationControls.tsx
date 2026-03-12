import React, { useState } from 'react';

const AutomationControls: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <section style={{ padding: '1em', border: '1px solid #667', background: '#222', color: '#7bdfff', fontFamily: 'monospace', borderRadius: 6, marginBottom: '1em' }}>
      <h3>Automation Controls</h3>
      <button
        type="button"
        onClick={() => setEnabled((prev) => !prev)}
        aria-label={enabled ? 'Disable Automation' : 'Enable Automation'}
      >
        {enabled ? 'Disable Automation' : 'Enable Automation'}
      </button>
    </section>
  );
};

export default AutomationControls;
