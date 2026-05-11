import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const CYCLE_INTERVAL = 7000;

const OLIVE = '#3F5A4F';
const OLIVE_DEEP = '#2d3f38';
const OLIVE_SOFT = '#4a6356';
const SAND = '#E8DFC9';
const naShineN = 'transition-[text-shadow,filter] duration-300 group-hover/na:[text-shadow:0_0_36px_rgba(232,223,201,0.95),0_0_72px_rgba(175,200,209,0.55)]';
const naShineA = 'transition-[text-shadow,filter] duration-300 group-hover/na:[text-shadow:0_0_36px_rgba(181,82,59,0.95),0_0_64px_rgba(181,82,59,0.5)]';
const SWAP_DURATION = 1.1;

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-[0.34] pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/hero-home-loop.mp4" type="video/mp4" />
      </video>
      {/* Base olive layer over video */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% 18%, rgba(74,99,86,0.78) 0%, rgba(63,90,79,0.86) 48%, rgba(45,63,56,0.96) 100%)
          `,
        }}
      />

      {/* Olive overlays for depth */}
      <div className="absolute inset-0 bg-olive/28 pointer-events-none" />
      <div className="absolute inset-0 bg-[rgba(45,63,56,0.08)] pointer-events-none" />

      {/* Grain léger */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dégradé bas → sable (inchangé) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[min(52vh,480px)] pointer-events-none z-[5]"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(232, 223, 201, 0) 0%,
              rgba(232, 223, 201, 0.12) 22%,
              rgba(232, 223, 201, 0.45) 52%,
              rgba(232, 223, 201, 0.88) 78%,
              ${SAND} 100%
            )
          `,
        }}
      />
    </div>
  );
}

export default function HeroSection({ revealed }) {
  const { t } = useI18n();
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!revealed) return;
    const interval = setInterval(() => setCycle((c) => (c + 1) % 2), CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [revealed]);

  if (!revealed) return null;

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-16 overflow-hidden bg-[#E8DFC9]">
      <HeroBackground />

      <div className="relative z-10 flex flex-1 items-center justify-center w-full px-4 py-12" style={{ minHeight: '36vh' }}>
        <AnimatePresence mode="wait">
          {cycle === 0 ? (
            <motion.div
              key="na-studio"
              className="text-center flex gap-4 md:gap-8 items-baseline"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="font-serif font-light text-sand leading-none group/na cursor-default select-none"
                style={{ fontSize: 'clamp(82px, 15vw, 184px)' }}
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: SWAP_DURATION, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className={`inline ${naShineN}`} style={{ color: '#E8DFC9' }}>
                  N
                </span>
                <span className={`inline ${naShineA}`} style={{ color: '#B5523B' }}>
                  A
                </span>
              </motion.span>
              <motion.span
                className="font-serif font-light text-sand/70 leading-none"
                style={{ fontSize: 'clamp(38px, 6.8vw, 82px)' }}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 80, opacity: 0 }}
                transition={{ duration: SWAP_DURATION, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                STUDIO
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="nathan-azoulay"
              className="text-center flex gap-4 md:gap-8 items-baseline"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="font-serif font-light text-sand leading-none"
                style={{ fontSize: 'clamp(52px, 9.2vw, 118px)' }}
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: SWAP_DURATION, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                NATHAN
              </motion.span>
              <motion.span
                className="font-serif font-light text-olive leading-none"
                style={{ fontSize: 'clamp(52px, 9.2vw, 118px)', color: '#AFC8D1' }}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 80, opacity: 0 }}
                transition={{ duration: SWAP_DURATION, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                AZOULAY
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 max-w-2xl mx-auto px-6 text-center pb-20 mt-auto"
      >
        <p className="font-serif text-[22px] md:text-[26px] font-light text-ink/75 leading-snug mb-4">
          {t('hero_subtitle')}
        </p>
        <p className="font-sans text-[15px] text-ink/50 leading-relaxed mb-10">
          {t('hero_body')}
        </p>
        <div className="flex flex-wrap gap-6 items-center justify-center">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-3 font-sans text-sm font-medium text-tropical border-b border-tropical/50 pb-0.5 hover:border-tropical transition-all duration-300"
          >
            {t('hero_cta1')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            to="/experience"
            className="group inline-flex items-center gap-3 font-sans text-sm font-medium text-ink/45 border-b border-ink/20 pb-0.5 hover:text-olive hover:border-olive/40 transition-all duration-300"
          >
            {t('hero_cta2')}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
