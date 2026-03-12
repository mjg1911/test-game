import React, { useRef } from 'react';
import useCanvasDraw from '../hooks/useCanvasDraw';

const PixelArtCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasDraw(canvasRef); // This now draws from game state

  return (
    <canvas
      ref={canvasRef}
      width={128}
      height={128}
      style={{ border: '1px solid #555', imageRendering: 'pixelated' }}
    />
  );
};

export default PixelArtCanvas;
