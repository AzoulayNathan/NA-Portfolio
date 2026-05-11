import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePageSand } from '@/lib/PageSandContext';

const MAX_BOTTOM_PX = 120;
const MAX_NAV_PX = 34;

function easeSmooth(t) {
  return t * t * (3 - 2 * t);
}

export function SandPileBottom() {
  const { accum01 } = usePageSand();
  const h = easeSmooth(accum01) * MAX_BOTTOM_PX;
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );
  const [erasedSpots, setErasedSpots] = useState([]);
  const pileRef = useRef(null);
  const lastPointRef = useRef(null);
  const maskId = useMemo(
    () => `sand-mask-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (h < 1) return undefined;

    const onPointerMove = (event) => {
      const pileEl = pileRef.current;
      if (!pileEl) return;
      const rect = pileEl.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) return;
      if (event.clientX < rect.left || event.clientX > rect.right) return;

      const x = Math.max(0, Math.min(viewportWidth, event.clientX - rect.left));
      const y = Math.max(0, Math.min(h, event.clientY - rect.top));
      const prev = lastPointRef.current;
      if (prev && Math.hypot(prev.x - x, prev.y - y) < 8) return;
      lastPointRef.current = { x, y };

      setErasedSpots((current) => [
        ...current.slice(-2200),
        { x, y, r: 16 + Math.random() * 6 },
      ]);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [h, viewportWidth]);

  useEffect(() => {
    if (h < 2) {
      setErasedSpots([]);
      lastPointRef.current = null;
    }
  }, [h]);

  const maskStyle = {
    mask: `url(#${maskId})`,
    WebkitMask: `url(#${maskId})`,
  };

  return (
    <motion.div
      ref={pileRef}
      className="absolute bottom-0 left-0 right-0 z-[25] pointer-events-none overflow-hidden"
      initial={false}
      animate={{ height: `${h}px` }}
      transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 0.8 }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={viewportWidth} height={Math.max(1, h)}>
            <rect x="0" y="0" width={viewportWidth} height={Math.max(1, h)} fill="white" />
            {erasedSpots.map((spot, idx) => (
              <circle key={`spot-${idx}`} cx={spot.x} cy={spot.y} r={spot.r} fill="black" />
            ))}
          </mask>
        </defs>
      </svg>
      <div
        className="absolute inset-0 w-full"
        style={{
          background: `linear-gradient(to top, rgba(232,223,201,0.98) 0%, rgba(220,206,178,0.76) 34%, rgba(191,177,150,0.5) 63%, rgba(63,90,79,0.18) 100%)`,
          boxShadow: '0 -8px 36px rgba(31,61,51,0.14)',
          ...maskStyle,
        }}
      />
      {/* Texture : grains + sillons en bas du tas */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(circle at 16% 86%, rgba(63,90,79,0.22) 0%, transparent 42%),
            radial-gradient(circle at 79% 84%, rgba(31,61,51,0.14) 0%, transparent 36%),
            repeating-linear-gradient(92deg, transparent 0px, transparent 3px, rgba(63,90,79,0.12) 3px, rgba(63,90,79,0.12) 4px),
            repeating-radial-gradient(circle at 25% 65%, rgba(232,223,201,0.42) 0 1.2px, rgba(63,90,79,0.35) 1.2px 2.4px, transparent 2.4px 4px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 8px 100%, 10px 10px',
          ...maskStyle,
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-4 opacity-55"
        style={{
          background: `
            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(63,90,79,0.06) 1px, rgba(63,90,79,0.06) 2px),
            linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)
          `,
          ...maskStyle,
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-6 opacity-[0.62]"
        style={{
          background: `
            radial-gradient(14px 6px at 8% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 75%),
            radial-gradient(18px 7px at 21% 0%, rgba(63,90,79,0.2) 0%, rgba(63,90,79,0) 78%),
            radial-gradient(16px 6px at 35% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 75%),
            radial-gradient(20px 8px at 52% 0%, rgba(63,90,79,0.16) 0%, rgba(63,90,79,0) 78%),
            radial-gradient(15px 6px at 67% 0%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 75%),
            radial-gradient(19px 7px at 83% 0%, rgba(63,90,79,0.18) 0%, rgba(63,90,79,0) 78%),
            radial-gradient(13px 5px at 95% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 75%)
          `,
          ...maskStyle,
        }}
      />
    </motion.div>
  );
}

export function SandPileNav() {
  const { accum01 } = usePageSand();
  const h = easeSmooth(accum01) * MAX_NAV_PX;

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-0"
      initial={false}
      animate={{ height: `${h}px` }}
      transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 0.8 }}
    >
      <div
        className="absolute inset-0 w-full"
        style={{
          background: `linear-gradient(to top, rgba(232,223,201,0.82) 0%, rgba(232,223,201,0.4) 55%, transparent 100%)`,
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-2 opacity-40"
        style={{
          background: `
            repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(63,90,79,0.1) 2px, rgba(63,90,79,0.1) 3px),
            repeating-radial-gradient(circle at 30% 50%, rgba(232,223,201,0.25) 0 1px, rgba(63,90,79,0.2) 1px 2px, transparent 2px 4px)
          `,
        }}
      />
    </motion.div>
  );
}
