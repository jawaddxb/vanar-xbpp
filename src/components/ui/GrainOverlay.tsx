import { useEffect, useRef } from 'react';

export function GrainOverlay() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const d = ctx.createImageData(c.width, c.height);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255;
      d.data[i] = v;
      d.data[i + 1] = v;
      d.data[i + 2] = v;
      d.data[i + 3] = 255;
    }
    ctx.putImageData(d, 0, 0);
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.045,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
