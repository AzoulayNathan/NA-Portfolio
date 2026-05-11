import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function ContactButton({ label, href, isSubmit = false }) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <>
      {/* Draining fill */}
      <motion.div
        className="absolute inset-0 rounded-full bg-tropical origin-bottom"
        animate={hovered ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'bottom' }}
      />
      {/* NA default */}
      <AnimatePresence>
        {!hovered && (
          <motion.span
            key="na"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-serif text-sand text-2xl font-light tracking-tight z-10 select-none"
          >
            NA
          </motion.span>
        )}
      </AnimatePresence>
      {/* Label on hover — 2s progressive reveal */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute font-sans text-[13px] font-bold tracking-wider uppercase text-tropical z-10 text-center px-2 leading-tight select-none"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const sharedClass = "relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden";

  if (isSubmit) {
    return (
      <button
        type="submit"
        className={sharedClass}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      to={href || '/contact'}
      className={sharedClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </Link>
  );
}