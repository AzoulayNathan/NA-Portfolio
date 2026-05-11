import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import ContactButton from '@/components/ui/ContactButton';

export default function ContactClose() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  const [hovered, setHovered] = useState(false);
  const { t } = useI18n();

  return (
    <section ref={ref} className="relative bg-sand py-32 px-6 md:px-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 80%, rgba(31,61,51,0.08) 0%, transparent 70%)' }}
      />
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={inView ? { x: '200%', opacity: [0, 0.06, 0] } : {}}
        transition={{ duration: 1.8, delay: 0.3, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-1/3 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #F6F3ED, transparent)' }}
      />
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={inView ? { height: 80, opacity: 0.25 } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute top-12 left-1/2 -translate-x-1/2 w-px bg-tropical"
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="eyebrow mb-8"
        >
          {t('contact_close_eyebrow')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif text-[52px] md:text-[68px] font-light text-ink leading-tight mb-5"
        >
          {t('contact_close_heading')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="font-sans text-[15px] text-ink/55 leading-relaxed mb-12"
        >
          {t('contact_close_body')}
        </motion.p>

        {/* Circular button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center"
        >
          <ContactButton label={t('contact_close_cta')} href="/contact" />
        </motion.div>
      </div>
    </section>
  );
}
