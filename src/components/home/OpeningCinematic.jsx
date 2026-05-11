import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Base sequence: hold -> vertical line + flash -> split opening from center.
const HOLD_MS = 400;
const LINE_GROW_MS = 920;
const FLASH_MS = 120;
const OPEN_DURATION_S = 1.2;

export default function OpeningCinematic({ onComplete, slowMode = false }) {
  const [phase, setPhase] = useState('hold'); // hold → line → flash → open → done
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  // From the second visit onward, cinematic should be 2x faster.
  const speedFactor = slowMode ? 0.5 : 1;
  const holdMs = Math.round(HOLD_MS * speedFactor);
  const lineGrowMs = Math.round(LINE_GROW_MS * speedFactor);
  const flashMs = Math.round(FLASH_MS * speedFactor);
  const openDurationS = OPEN_DURATION_S * speedFactor;
  const doneAfterOpenMs = Math.ceil(openDurationS * 1000) + 120;
  const totalMs = holdMs + lineGrowMs + flashMs + doneAfterOpenMs;

  useEffect(() => {
    const tLine = setTimeout(() => setPhase('line'), holdMs);
    const tFlash = setTimeout(() => setPhase('flash'), holdMs + lineGrowMs);
    const tOpen = setTimeout(() => setPhase('open'), holdMs + lineGrowMs + flashMs);
    const tDone = setTimeout(() => {
      setPhase('done');
      onCompleteRef.current?.();
    }, totalMs);
    // Hard fail-safe.
    const tFailsafe = setTimeout(() => {
      setPhase('done');
      onCompleteRef.current?.();
    }, slowMode ? 3000 : 6000);
    return () => {
      clearTimeout(tLine);
      clearTimeout(tFlash);
      clearTimeout(tOpen);
      clearTimeout(tDone);
      clearTimeout(tFailsafe);
    };
  }, [holdMs, lineGrowMs, flashMs, totalMs, slowMode]);

  if (phase === 'done') return null;

  const showLine = phase === 'line' || phase === 'flash' || phase === 'open';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ backgroundColor: '#1F3D33' }}
    >
      {/* Portes — derrière le monogramme */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 z-10"
        style={{ backgroundColor: '#1F3D33' }}
        initial={{ x: 0 }}
        animate={phase === 'open' ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: openDurationS, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 z-10"
        style={{ backgroundColor: '#1F3D33' }}
        initial={{ x: 0 }}
        animate={phase === 'open' ? { x: '100%' } : { x: 0 }}
        transition={{ duration: openDurationS, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Ligne de lumière verticale qui grandit avant l'ouverture */}
      <motion.div
        className="absolute top-1/2 left-1/2 z-30 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ height: '8%', opacity: 0 }}
        animate={
          phase === 'line'
            ? { height: '112%', opacity: 1 }
            : phase === 'flash'
              ? { height: '112%', opacity: 1 }
            : phase === 'open'
              ? { height: '112%', opacity: 0 }
              : { height: '8%', opacity: 0 }
        }
        transition={{
          duration: phase === 'line' ? lineGrowMs / 1000 : 0.18,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          background: 'linear-gradient(180deg, rgba(232,223,201,0.05) 0%, rgba(246,243,237,1) 52%, rgba(232,223,201,0.05) 100%)',
          boxShadow: '0 0 28px rgba(246,243,237,0.95), 0 0 92px rgba(232,223,201,0.6)',
        }}
      />
      <motion.div
        className="absolute inset-0 z-[35] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={phase === 'flash' ? { opacity: [0, 0.95, 0] } : { opacity: 0 }}
        transition={{ duration: flashMs / 1000, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(246,243,237,0.92) 0%, rgba(246,243,237,0.65) 34%, rgba(232,223,201,0) 72%)',
        }}
      />
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={showLine ? { opacity: 0.16 } : { opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(246,243,237,0.26) 0%, rgba(246,243,237,0.08) 34%, rgba(31,61,51,0) 72%)',
        }}
      />

      {/* Monogramme + trait vertical entre N et A */}
      <motion.div
        className="relative z-40 text-center select-none px-4"
        initial={{ opacity: 1 }}
        animate={phase === 'open' ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1
          className="font-serif leading-none flex items-center justify-center"
          style={{
            fontSize: 'clamp(140px, 22vw, 260px)',
            fontWeight: 300,
            letterSpacing: '-0.04em',
            textShadow: '0 6px 60px rgba(0,0,0,0.6), 0 0 120px rgba(175,200,209,0.1)',
          }}
        >
          <span style={{ color: '#E8DFC9' }}>N</span>
          <span style={{ width: '0.05em', flexShrink: 0 }} aria-hidden />
          <motion.span
            className="inline-block self-stretch mx-[0.02em] w-[3px] max-h-[0.55em] rounded-full shrink-0"
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={
              showLine
                ? { opacity: 1, scaleY: 1 }
                : { opacity: 0, scaleY: 0.3 }
            }
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              background:
                'linear-gradient(180deg, rgba(246,243,237,0.15) 0%, rgba(232,223,201,0.95) 45%, rgba(175,200,209,0.5) 100%)',
              boxShadow: showLine
                ? '0 0 24px rgba(246,243,237,0.55), 0 0 48px rgba(232,223,201,0.25)'
                : 'none',
            }}
          />
          <span style={{ width: '0.05em', flexShrink: 0 }} aria-hidden />
          <span style={{ color: '#B5523B' }}>A</span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-sans text-sand/35 text-xs tracking-[0.35em] uppercase mt-2"
        >
          Studio
        </motion.p>
      </motion.div>
    </div>
  );
}
