import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function NaRoomsMenu({ open, onClose }) {
  const { t } = useI18n();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const onPointer = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open, onClose]);

  const entries = [
    {
      to: '/websites',
      title: t('rooms_websites_title'),
      desc: t('rooms_websites_desc'),
      status: t('rooms_status_building'),
      statusClass: 'text-terracotta/80',
    },
    {
      to: '/classroom',
      title: t('rooms_classroom_title'),
      desc: t('rooms_classroom_desc'),
      status: t('rooms_status_active'),
      statusClass: 'text-olive',
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(100vw-2rem,280px)] bg-quartz border border-olive/15 shadow-sm py-2 z-[100]"
          role="menu"
        >
          {entries.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              role="menuitem"
              className="block px-4 py-3 hover:bg-sand/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-serif text-sm text-ink group-hover:text-tropical transition-colors">
                  {item.title}
                </span>
                <span className={`font-sans text-[9px] tracking-widest uppercase shrink-0 ${item.statusClass}`}>
                  {item.status}
                </span>
              </div>
              <p className="font-sans text-xs text-ink/45 mt-0.5 leading-snug">{item.desc}</p>
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
