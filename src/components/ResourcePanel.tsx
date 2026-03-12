import React from 'react';

const ResourcePanel: React.FC = () => {
  return (
    <section style={{ padding: '1em', border: '1px solid #ccc', background: '#222', color: '#ffd67e', fontFamily: 'monospace', borderRadius: 6 }}>
      <h3>Resources</h3>
      <div style={{ display: 'flex', gap: '1em', marginBottom: '0.5em' }}>
        <span>Money: <strong data-testid="money">0</strong></span>
        <span>Eggs: <strong data-testid="eggs">0</strong></span>
      </div>
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <button>Collect</button>
        <button>Sell</button>
      </div>
    </section>
  );
};

export default ResourcePanel;
