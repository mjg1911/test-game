import { useEffect } from 'react';

const useCanvasDraw = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw simple pixel grid (dummy crop)
    ctx.fillStyle = '#497d36';
    ctx.fillRect(40, 80, 48, 32);
    ctx.fillStyle = '#ffe66d';
    ctx.fillRect(56, 96, 16, 8);
    // You could later load an image asset here
  }, [canvasRef]);
};

export default useCanvasDraw;
