import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSandRain } from '@/lib/SandRainContext';

/** Le sable monte d'un niveau par minute et atteint le plafond au dernier palier. */
const MINUTE_MS = 60_000;
const MAX_LEVEL = 6;
const FULL_ACCUM_MS = MAX_LEVEL * MINUTE_MS;

const PageSandContext = createContext({
  elapsedMs: 0,
  level: 0,
  /** 0–1 sur la plage 1–3 min (sable visible) */
  accum01: 0,
});

export function PageSandProvider({ children }) {
  const { pathname } = useLocation();
  const { enabled: sandRainEnabled } = useSandRain();
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!sandRainEnabled) {
      setElapsedMs(0);
      return undefined;
    }
    const t0 = Date.now();
    setElapsedMs(0);
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - t0);
    }, 250);
    return () => window.clearInterval(id);
  }, [pathname, sandRainEnabled]);

  const value = useMemo(() => {
    const level = Math.min(MAX_LEVEL, Math.floor(elapsedMs / MINUTE_MS));
    const accum01 = Math.min(1, elapsedMs / FULL_ACCUM_MS);
    return { elapsedMs, level, accum01 };
  }, [elapsedMs]);

  return <PageSandContext.Provider value={value}>{children}</PageSandContext.Provider>;
}

export function usePageSand() {
  return useContext(PageSandContext);
}
