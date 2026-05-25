import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useI18n } from '@/lib/i18n';

export default function Websites() {
  const { t } = useI18n();

  return (
    <PageLayout>
      <section className="min-h-[70vh] flex items-center bg-quartz px-6 md:px-10 py-32">
        <div className="max-w-2xl mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow text-olive/70 mb-4"
          >
            {t('websites_eyebrow')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-serif text-4xl md:text-5xl text-ink tracking-tight mb-4"
          >
            {t('websites_heading')}
          </motion.h1>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="inline-block font-sans text-[10px] tracking-widest uppercase text-terracotta/80 border border-terracotta/25 px-2.5 py-1 mb-8"
          >
            {t('rooms_status_building')}
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-sans text-ink/60 leading-relaxed mb-12"
          >
            {t('websites_body')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase bg-tropical text-quartz px-5 py-3 hover:bg-olive transition-colors"
            >
              <ArrowLeft size={14} />
              {t('websites_cta_studio')}
            </Link>
            <Link
              to="/classroom"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-tropical border border-tropical/30 px-5 py-3 hover:bg-tropical/5 transition-colors"
            >
              {t('websites_cta_classroom')}
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
