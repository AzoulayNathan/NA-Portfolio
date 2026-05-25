import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useI18n } from '@/lib/i18n';

export default function FocusedRooms() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { t } = useI18n();

  const rooms = [
    { to: '/websites', title: t('focused_rooms_websites'), status: t('rooms_status_building'), statusClass: 'text-terracotta/80' },
    { to: '/classroom', title: t('focused_rooms_classroom'), status: t('rooms_status_active'), statusClass: 'text-olive' },
  ];

  return (
    <section ref={ref} className="py-20 px-6 md:px-10 bg-sand/40 border-t border-olive/10">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="eyebrow text-olive/70 mb-3"
        >
          {t('focused_rooms_eyebrow')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05 }}
          className="font-serif text-2xl md:text-3xl text-ink mb-2"
        >
          {t('focused_rooms_heading')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="font-sans text-sm text-ink/50 mb-10 max-w-lg"
        >
          {t('focused_rooms_body')}
        </motion.p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {rooms.map((room, i) => (
            <motion.div
              key={room.to}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <Link
                to={room.to}
                className="block bg-quartz border border-olive/12 px-5 py-4 hover:border-tropical/30 transition-colors group"
              >
                <span className="font-serif text-lg text-ink group-hover:text-tropical transition-colors">{room.title}</span>
                <span className={`font-sans text-[10px] tracking-widest uppercase block mt-2 ${room.statusClass}`}>{room.status}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
