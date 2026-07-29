import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
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
      id: 'websites',
      title: t('rooms_websites_title'),
      desc: t('rooms_websites_desc'),
      status: t('rooms_status_unavailable'),
      statusClass: 'text-ink/35',
      disabled: true,
    },
    {
      id: 'business-systems',
      title: t('rooms_business_systems_title'),
      desc: t('rooms_business_systems_desc'),
      status: t('rooms_status_unavailable'),
      statusClass: 'text-ink/35',
      disabled: true,
    },
    {
      id: 'classroom',
      to: '/classroom',
      title: t('rooms_classroom_title'),
      desc: t('rooms_classroom_desc'),
      status: t('rooms_status_active'),
      statusClass: 'text-olive',
      disabled: false,
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
          {entries.map((item) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`font-serif text-sm transition-colors ${
                      item.disabled ? 'text-ink/40' : 'text-ink group-hover:text-tropical'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`font-sans text-[9px] tracking-widest uppercase shrink-0 inline-flex items-center gap-1 ${item.statusClass}`}
                  >
                    {item.disabled && <Lock size={10} strokeWidth={2} aria-hidden="true" />}
                    {item.status}
                  </span>
                </div>
                <p className={`font-sans text-xs mt-0.5 leading-snug ${item.disabled ? 'text-ink/30' : 'text-ink/45'}`}>
                  {item.desc}
                </p>
              </>
            );

            if (item.disabled) {
              return (
                <div
                  key={item.id}
                  role="menuitem"
                  aria-disabled="true"
                  title={t('rooms_status_unavailable')}
                  className="block px-4 py-3 cursor-not-allowed select-none opacity-80"
                >
                  {inner}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={onClose}
                role="menuitem"
                className="block px-4 py-3 hover:bg-sand/50 transition-colors group"
              >
                {inner}
              </Link>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
