import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const STORAGE_KEY = 'porto-sand-rain';

const SandRainContext = createContext({
  enabled: true,
  setEnabled: () => {},
});

export function SandRainProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '0';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [enabled]);

  const value = useMemo(() => ({ enabled, setEnabled }), [enabled]);

  return <SandRainContext.Provider value={value}>{children}</SandRainContext.Provider>;
}

export function useSandRain() {
  return useContext(SandRainContext);
}
