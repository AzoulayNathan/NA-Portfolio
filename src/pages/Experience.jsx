import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useI18n, LANGUAGES } from '@/lib/i18n';
import ContactButton from '@/components/ui/ContactButton';

const CV_LANG_LABELS = { fr: 'FR', en: 'EN', es: 'ES' };
const CV_LANG_ORDER = ['fr', 'en', 'es'];

const CARD_COLORS = [
  { bg: '#E8DFC9', border: 'rgba(63,90,79,0.25)' },
  { bg: '#DDD3B5', border: 'rgba(63,90,79,0.35)' },
  { bg: '#D4C4A8', border: 'rgba(181,82,59,0.30)' },
];

const SIDE_OFFSETS = [
  { side: 'left', xOffset: 0 },
  { side: 'right', xOffset: 0 },
  { side: 'left', xOffset: 20 },
  { side: 'right', xOffset: 20 },
  { side: 'left', xOffset: -10 },
  { side: 'right', xOffset: -10 },
  { side: 'left', xOffset: 15 },
  { side: 'right', xOffset: -5 },
  { side: 'left', xOffset: 5 },
];

function TimelineItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const cardColor = CARD_COLORS[index % 3];
  const placement = SIDE_OFFSETS[index % SIDE_OFFSETS.length];
  const isRight = placement.side === 'right';
  const drift = placement.xOffset;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mb-10 flex"
      style={{ justifyContent: isRight ? 'flex-end' : 'flex-start', paddingLeft: isRight ? 0 : `${Math.max(0, drift + 40)}px`, paddingRight: isRight ? `${Math.max(0, -drift + 40)}px` : 0 }}
    >
      <div
        className="p-6 md:p-8 max-w-md w-full cursor-pointer transition-shadow duration-300"
        style={{ backgroundColor: cardColor.bg, border: `1px solid ${cardColor.border}`, boxShadow: '0 8px 32px rgba(31,61,51,0.13), 0 2px 8px rgba(0,0,0,0.07)' }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-olive flex-shrink-0" />
          <p className="font-sans text-[11px] tracking-widest uppercase text-ink/40">{item.period}</p>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-serif text-[20px] md:text-[24px] font-light text-ink leading-snug hover:text-tropical transition-colors">
              {item.title}
            </h3>
            <p className="font-sans text-sm text-ink/50 mt-1.5">{item.summary}</p>
          </div>
          <div className="mt-2 w-4 h-px bg-olive/40 flex-shrink-0 transition-all duration-300" style={{ transform: open ? 'scaleX(0.5) rotate(0deg)' : 'scaleX(1)' }} />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <ul className="mt-5 space-y-2 border-l-2 border-olive/25 pl-4">
                {item.bullets.map((b, i) => (
                  <li key={i} className="font-sans text-sm text-ink/65 leading-relaxed">{b}</li>
                ))}
              </ul>
              <span className="inline-block mt-3 font-sans text-[11px] tracking-widest uppercase text-olive/60 border border-olive/30 px-2.5 py-1">
                {item.type}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const closingRef = useRef(null);
  const closingInView = useInView(closingRef, { once: true, margin: '-60px' });
  const { t, lang } = useI18n();
  const [cvOpen, setCvOpen] = useState(false);
  const [cvLang, setCvLang] = useState(lang);

  const openCv = () => {
    const next = LANGUAGES.includes(lang) ? lang : 'en';
    setCvLang(next);
    setCvOpen(true);
  };

  useEffect(() => {
    if (!cvOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setCvOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cvOpen]);

  const TIMELINE = [
    { id: 'maths-licence', period: '2018 — 2021', title: t('tl_licence'), summary: t('tl_licence_s'), bullets: t('tl_licence_b'), type: 'Education' },
    { id: 'maths-master', period: '2021 — 2023', title: t('tl_master_maths'), summary: t('tl_master_maths_s'), bullets: t('tl_master_maths_b'), type: 'Education' },
    { id: 'tutorat', period: '2020 — 2022', title: t('tl_tutorat'), summary: t('tl_tutorat_s'), bullets: t('tl_tutorat_b'), type: 'Experience' },
    { id: 'dgfip', period: '2022', title: t('tl_dgfip'), summary: t('tl_dgfip_s'), bullets: t('tl_dgfip_b'), type: 'Experience' },
    { id: 'sada', period: '2023', title: t('tl_sada'), summary: t('tl_sada_s'), bullets: t('tl_sada_b'), type: 'Experience' },
    { id: 'dental', period: '2023', title: t('tl_dental'), summary: t('tl_dental_s'), bullets: t('tl_dental_b'), type: 'Experience' },
    { id: 'mbfa', period: '2023 — 2024', title: t('tl_mbfa'), summary: t('tl_mbfa_s'), bullets: t('tl_mbfa_b'), type: 'Education' },
    { id: 'iterato', period: '2024', title: t('tl_iterato'), summary: t('tl_iterato_s'), bullets: t('tl_iterato_b'), type: 'Experience' },
    { id: 'msc-analytics', period: '2025 — ongoing', title: t('tl_msc'), summary: t('tl_msc_s'), bullets: t('tl_msc_b'), type: 'Education' },
  ];

  return (
    <PageLayout>
      <div className="relative isolate">
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-[0.22] [filter:saturate(0.62)_brightness(0.8)_contrast(1.04)]"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          >
            <source src="/hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#E8DFC9]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#E8DFC9]/88 via-[#E8DFC9]/70 to-[#E8DFC9]/90" />
        </div>

      <section className="bg-sand/64 backdrop-blur-[1px] pt-32 pb-16 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-5"
          >
            {t('exp_eyebrow')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-serif text-[52px] md:text-[72px] font-light text-ink leading-tight mb-5"
          >
            {t('exp_heading')}<br />
            <em className="text-tropical not-italic">{t('exp_heading2')}</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="font-sans text-[15px] text-ink/55 leading-relaxed max-w-md mx-auto"
          >
            {t('exp_body')}
          </motion.p>
        </div>
      </section>

      <section className="bg-sand/56 backdrop-blur-[1px] px-6 md:px-16 pb-12 overflow-hidden">
        <div className="max-w-3xl mx-auto">
          {/* Frise : uniquement la hauteur des cartes — la ligne ne dépasse pas sous le bloc CV */}
          <div className="relative">
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-olive/50 z-0"
              style={{ boxShadow: '0 0 8px rgba(63,90,79,0.25)' }}
            />
            <div className="space-y-8 relative z-10">
              {TIMELINE.map((item, i) => (
                <TimelineItem key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center mt-10 md:mt-12"
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[-62px] bottom-[-74px] w-1 bg-olive/45 z-0"
              style={{ boxShadow: '0 0 8px rgba(63,90,79,0.22)' }}
              aria-hidden
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-82px] z-0 w-0 h-0"
              style={{
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '16px solid rgba(63,90,79,0.78)',
              }}
              aria-hidden
            />
            <button
              type="button"
              onClick={openCv}
              className="group relative z-10 flex h-[200px] w-[200px] max-w-[90vw] flex-col items-center justify-center overflow-hidden border-2 border-olive bg-[#E8DFC9] text-center shadow-[0_8px_28px_rgba(31,61,51,0.12)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(31,61,51,0.18)]"
            >
              <span
                className="absolute inset-0 origin-bottom scale-y-0 bg-olive transition-transform duration-500 ease-out group-hover:scale-y-100"
                aria-hidden
              />
              <span className="relative z-10 font-serif text-[15px] tracking-[0.25em] uppercase text-ink transition-colors duration-300 group-hover:text-sand">
                {t('exp_cv_label')}
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      <section ref={closingRef} className="relative bg-quartz/82 backdrop-blur-[1px] py-20 px-6 md:px-10 border-t border-ink/10">
        <div className="max-w-xl mx-auto text-center relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-20 h-20 w-1 bg-olive/45"
            style={{ boxShadow: '0 0 8px rgba(63,90,79,0.22)' }}
            aria-hidden
          />
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={closingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="font-serif text-[34px] md:text-[40px] font-light text-ink leading-snug mb-5"
          >
            {t('exp_closing_h')}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={closingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="font-sans text-sm text-ink/55 leading-relaxed mb-10"
          >
            {t('exp_closing_p')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={closingInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25 }}
            className="relative flex flex-col items-center justify-center mt-2"
          >
            <div
              className="relative z-0 w-0 h-0 mb-4"
              style={{
                borderLeft: '11px solid transparent',
                borderRight: '11px solid transparent',
                borderTop: '17px solid rgba(63,90,79,0.8)',
              }}
              aria-hidden
            />
            <ContactButton label={t('exp_closing_link')} href="/projects" />
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {cvOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-ink/80 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCvOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl max-h-[92vh] bg-quartz shadow-2xl overflow-hidden rounded-sm flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-sand/90 border border-ink/10 px-1.5 py-1 shadow-[0_2px_8px_rgba(31,61,51,0.10)]">
                {CV_LANG_ORDER.map((l) => {
                  const active = cvLang === l;
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setCvLang(l)}
                      aria-pressed={active}
                      className={`font-sans text-[11px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full transition-colors duration-200 ${
                        active
                          ? 'bg-olive text-sand'
                          : 'text-ink/55 hover:text-ink hover:bg-ink/5'
                      }`}
                    >
                      {CV_LANG_LABELS[l]}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setCvOpen(false)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-sand/90 text-ink/60 hover:text-ink border border-ink/10 transition-colors"
                aria-label={t('exp_cv_close')}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
              <div className="flex-1 min-h-[70vh] overflow-auto pt-12">
                <object
                  key={cvLang}
                  data={`/cv/NathanAzoulay_${cvLang}.pdf`}
                  type="application/pdf"
                  className="w-full min-h-[68vh]"
                  title={`CV ${CV_LANG_LABELS[cvLang]}`}
                >
                  <div className="p-8 text-center font-sans text-sm text-ink/55">
                    <p className="mb-3">{t('exp_cv_hint')}</p>
                    <a
                      href={`/cv/NathanAzoulay_${cvLang}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block underline text-tropical hover:text-tropical/70"
                    >
                      {`NathanAzoulay_${cvLang}.pdf`}
                    </a>
                  </div>
                </object>
              </div>
              <p className="text-[11px] text-center text-ink/40 px-3 py-2 border-t border-ink/10 font-sans">
                {t('exp_cv_hint')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </PageLayout>
  );
}
