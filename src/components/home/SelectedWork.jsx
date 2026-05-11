import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import ProjectCarousel from '@/components/home/ProjectCarousel';
import { PROJECTS } from '@/data/portfolioProjects';

export default function SelectedWork() {
  const introRef = useRef(null);
  const archiveRef = useRef(null);
  const inView = useInView(introRef, { once: false, margin: '-60px' });
  const archiveInView = useInView(archiveRef, { once: false, margin: '-40px' });
  const { t } = useI18n();

  return (
    <section className="bg-sand pt-24 pb-0 overflow-x-hidden">
      <motion.div
        ref={introRef}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-6 md:px-10 pb-12"
      >
        <p className="eyebrow mb-5">{t('selected_eyebrow')}</p>
        <h2 className="font-serif text-[42px] md:text-[52px] font-light text-ink leading-tight max-w-lg">
          {t('selected_heading')}
        </h2>
      </motion.div>

      <div className="w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2 flex flex-col gap-0 pb-16">
        <ProjectCarousel projects={PROJECTS} initialDelayMs={5200} className="border-b border-ink/10" />
      </div>

      <motion.div
        ref={archiveRef}
        initial={{ opacity: 0, y: 16 }}
        animate={archiveInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative border-t border-ink/12 bg-sand"
      >
        <motion.div
          className="absolute top-0 bottom-0 w-[38%] pointer-events-none z-[5]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(246,243,237,0.58) 45%, rgba(232,223,201,0.28) 70%, transparent 100%)',
            filter: 'blur(0.6px)',
          }}
          initial={{ x: '-130%', opacity: 0 }}
          animate={{ x: '260%', opacity: [0, 0.95, 0] }}
          transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4.9 }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(63,90,79,0.06) 1px, rgba(63,90,79,0.06) 2px),
              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(31,61,51,0.04) 1px, rgba(31,61,51,0.04) 2px)
            `,
            backgroundSize: '100% 3px, 4px 100%',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-olive/25 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-1 pb-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-md">
            <p className="font-serif text-xl md:text-[22px] text-ink/85 mb-2">{t('archive_title')}</p>
            <p className="font-sans text-sm text-ink/50 leading-relaxed">{t('archive_sub')}</p>
          </div>
          <Link
            to="/projects"
            className="group inline-flex items-center gap-3 font-sans text-sm font-medium text-tropical border-b-2 border-tropical/30 pb-1 whitespace-nowrap hover:border-tropical hover:text-tropical transition-all shrink-0"
          >
            {t('archive_link')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
      <div className="h-16 md:h-20 bg-gradient-to-b from-sand via-[#ece3cf] to-quartz pointer-events-none" />
    </section>
  );
}
