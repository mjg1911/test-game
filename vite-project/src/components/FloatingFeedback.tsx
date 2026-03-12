import React, { useEffect } from 'react';

interface FloatingFeedbackProps {
  amount: number;
  onFinish?: () => void;
  duration?: number;
}

const floatUpStyles = `
  @keyframes floatUp {
    0% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
  }
`;

const FloatingFeedback: React.FC<FloatingFeedbackProps> = ({ amount, onFinish, duration = 1500 }) => {
  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(onFinish, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onFinish]);

  return (
    <>
      <style>{floatUpStyles}</style>
      <div
        className="floating-feedback"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#22c55e',
          fontWeight: 'bold',
          fontSize: 14,
          fontFamily: 'monospace',
          animation: `floatUp ${duration / 1000}s ease-out forwards`,
          pointerEvents: 'none',
        }}
      >
        {`+$${amount}`}
      </div>
    </>
  );
};

export default FloatingFeedback;
