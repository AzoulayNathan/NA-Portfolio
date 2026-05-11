import { useEffect, useRef } from 'react';

const SAND = { r: 232, g: 223, b: 201 };
const OLIVE = { r: 63, g: 90, b: 79 };

/** Aucun grain avant ce délai ; ensuite ils tombent depuis le haut de l’écran. */
const FALL_DELAY_MS = 2000;

export default function SandRain() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = document.documentElement.scrollHeight || window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const GRAIN_COUNT = 350;
    let grains = null;
    const t0 = performance.now();

    function initGrainsFromTop() {
      grains = Array.from({ length: GRAIN_COUNT }, (_, i) => ({
        x: Math.random() * W,
        y: -Math.random() * (H * 0.4) - 8,
        r: Math.random() * 2.5 + 0.8,
        speed: Math.random() * 1.2 + 0.4,
        opacity: Math.random() * 0.45 + 0.15,
        drift: (Math.random() - 0.5) * 0.5,
        olive: i % 2 === 1,
      }));
    }

    function frame(now) {
      rafRef.current = requestAnimationFrame(frame);
      const elapsed = now - t0;

      if (elapsed < FALL_DELAY_MS) {
        ctx.clearRect(0, 0, W, H);
        return;
      }

      if (!grains) initGrainsFromTop();

      ctx.clearRect(0, 0, W, H);
      for (const g of grains) {
        g.y += g.speed;
        g.x += g.drift;
        if (g.y > H) {
          g.y = -Math.random() * 40 - 4;
          g.x = Math.random() * W;
        }
        if (g.x > W) g.x = 0;
        if (g.x < 0) g.x = W;
        const c = g.olive ? OLIVE : SAND;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${g.opacity})`;
        ctx.fill();
      }
    }

    rafRef.current = requestAnimationFrame(frame);

    const onResize = () => {
      W = window.innerWidth;
      H = document.documentElement.scrollHeight || window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      if (grains) {
        for (const g of grains) {
          if (g.x > W) g.x = W * 0.5;
        }
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
