import { useContext, useEffect } from 'react';
import { GameStateContext } from '../providers/GameStateProvider';

const useCanvasDraw = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { state } = useContext(GameStateContext);
  const canvas = canvasRef.current;

  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (dirt)
    ctx.fillStyle = '#4a3520';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw crops based on state
    const wheatCount = state.crops.wheat?.count || 0;
    const cornCount = state.crops.corn?.count || 0;

    // Draw wheat (yellow)
    ctx.fillStyle = '#ffe66d';
    for (let i = 0; i < wheatCount && i < 8; i++) {
      ctx.fillRect(10 + (i * 15), 20, 8, 16);
    }

    // Draw corn (orange-yellow)
    ctx.fillStyle = '#ffa500';
    for (let i = 0; i < cornCount && i < 8; i++) {
      ctx.fillRect(10 + (i * 15), 50, 10, 20);
    }

    // Draw animals
    const chickenCount = state.animals.chicken?.count || 0;
    const cowCount = state.animals.cow?.count || 0;

    // Draw chickens (white)
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < chickenCount && i < 5; i++) {
      ctx.fillRect(10 + (i * 20), 90, 12, 12);
    }

    // Draw cows (brown/white)
    ctx.fillStyle = '#8b4513';
    for (let i = 0; i < cowCount && i < 3; i++) {
      ctx.fillRect(10 + (i * 40), 105, 25, 15);
    }
  }, [canvas, state]);
};

export default useCanvasDraw;
