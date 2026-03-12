import React from 'react';

const CropField: React.FC = () => {
  return (
    <section style={{ padding: '1em', border: '1px solid #b2e673', background: '#304f1b', color: '#fff', fontFamily: 'monospace', borderRadius: 6 }}>
      <h3>Crop Field</h3>
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <button>Plant</button>
        <button>Harvest</button>
      </div>
    </section>
  );
};

export default CropField;
