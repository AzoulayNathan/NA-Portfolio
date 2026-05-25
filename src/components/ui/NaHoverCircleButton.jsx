import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SIZES = {
  md: 'w-36 h-36',
  lg: 'w-40 h-40',
};

const VARIANTS = {
  olive: {
    base: 'bg-olive',
    fill: 'bg-tropical',
    naText: 'text-quartz',
    labelText: 'text-tropical',
  },
  tropical: {
    base: 'bg-tropical',
    fill: 'bg-tropical',
    naText: 'text-sand',
    labelText: 'text-tropical',
  },
};

export default function NaHoverCircleButton({
  label,
  to,
  onClick,
  size = 'md',
  variant = 'olive',
  className = '',
}) {
  const [hovered, setHovered] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.olive;
  const sizeClass = SIZES[size] || SIZES.md;

  const inner = (
    <>
      <motion.div
        className={`absolute inset-0 rounded-full ${v.fill} origin-bottom`}
        animate={hovered ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'bottom' }}
      />
      <AnimatePresence>
        {!hovered && (
          <motion.span
            key="na"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`font-serif ${v.naText} text-2xl font-light tracking-tight z-10 select-none`}
          >
            NA
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`absolute font-sans text-[11px] sm:text-[12px] font-bold tracking-wider uppercase ${v.labelText} z-10 text-center px-3 leading-tight select-none`}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const sharedClass = `relative ${sizeClass} rounded-full flex items-center justify-center overflow-hidden shrink-0 ${v.base} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={sharedClass}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ boxShadow: '0 4px 20px rgba(63,90,79,0.25), inset 0 1px 0 rgba(255,255,255,0.12)' }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={sharedClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ boxShadow: '0 4px 20px rgba(63,90,79,0.25), inset 0 1px 0 rgba(255,255,255,0.12)' }}
    >
      {inner}
    </button>
  );
}
