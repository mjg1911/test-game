import React from 'react';

interface PopupProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, type, onClose }) => {
  const colors = {
    error: { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5' },
    success: { bg: '#14532d', border: '#22c55e', text: '#86efac' },
    info: { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' }
  };
  const style = colors[type];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.8); } to { transform: scale(1); } }
      `}</style>
      <div
        style={{
          backgroundColor: style.bg,
          border: `3px solid ${style.border}`,
          padding: '20px 32px',
          borderRadius: 4,
          fontFamily: 'monospace',
          fontSize: 12,
          color: style.text,
          textAlign: 'center',
          animation: 'popIn 0.2s ease-out',
          boxShadow: `0 0 20px ${style.border}40`
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ marginBottom: 16 }}>{type === 'error' && '⚠️ '}{message}</div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: style.border,
            border: '2px solid #fff',
            borderRadius: 4,
            padding: '8px 24px',
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
