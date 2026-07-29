import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { NA_WEBSITES_URL, NA_RESEARCH_URL } from '@/lib/externalLinks';

export default function ClassroomEcosystemMenu({ open, onClose, scrolled = false }) {
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
      id: 'studio',
      to: '/',
      title: t('rooms_studio_title'),
      desc: t('rooms_studio_desc'),
      status: t('rooms_status_active'),
      current: false,
    },
    {
      id: 'websites',
      href: NA_WEBSITES_URL,
      external: true,
      title: t('rooms_websites_title'),
      desc: t('rooms_websites_desc'),
      status: t('rooms_status_active'),
    },
    {
      id: 'research',
      href: NA_RESEARCH_URL,
      external: true,
      title: t('rooms_research_title'),
      desc: t('rooms_research_desc'),
      status: t('rooms_status_active'),
    },
    {
      id: 'classroom',
      to: '/classroom',
      title: t('rooms_classroom_title'),
      desc: t('rooms_classroom_desc'),
      status: t('rooms_status_active'),
      current: true,
    },
    {
      id: 'business-systems',
      title: t('rooms_business_systems_title'),
      desc: t('rooms_business_systems_desc'),
      status: t('rooms_status_unavailable'),
      disabled: true,
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
          className={`absolute top-full right-0 mt-2 w-[min(100vw-2rem,300px)] border shadow-sm py-2 z-[100] ${
            scrolled ? 'bg-sand border-ink/10' : 'bg-quartz border-sand/20'
          }`}
          role="menu"
        >
          {entries.map((item) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`font-serif text-sm transition-colors ${
                      item.disabled
                        ? scrolled
                          ? 'text-ink/40'
                          : 'text-sand/40'
                        : item.current
                          ? 'text-tropical'
                          : scrolled
                            ? 'text-ink group-hover:text-tropical'
                            : 'text-sand group-hover:text-sand'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`font-sans text-[9px] tracking-widest uppercase shrink-0 inline-flex items-center gap-1 ${
                      item.disabled ? (scrolled ? 'text-ink/35' : 'text-sand/35') : 'text-olive'
                    }`}
                  >
                    {item.disabled && <Lock size={10} strokeWidth={2} aria-hidden="true" />}
                    {item.current ? t('rooms_status_active') : item.status}
                  </span>
                </div>
                <p
                  className={`font-sans text-xs mt-0.5 leading-snug ${
                    item.disabled
                      ? scrolled
                        ? 'text-ink/30'
                        : 'text-sand/30'
                      : scrolled
                        ? 'text-ink/45'
                        : 'text-sand/50'
                  }`}
                >
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

            if (item.external) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  role="menuitem"
                  className={`block px-4 py-3 transition-colors group ${
                    scrolled ? 'hover:bg-ink/5' : 'hover:bg-sand/10'
                  }`}
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={onClose}
                role="menuitem"
                className={`block px-4 py-3 transition-colors group ${
                  item.current
                    ? scrolled
                      ? 'bg-tropical/5'
                      : 'bg-sand/10'
                    : scrolled
                      ? 'hover:bg-ink/5'
                      : 'hover:bg-sand/10'
                }`}
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
