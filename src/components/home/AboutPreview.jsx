import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function AboutPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  const { t } = useI18n();

  return (
    <section ref={ref} className="bg-quartz py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1fr] gap-12 md:gap-20 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-5">
            
            {t('about_eyebrow')}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-serif text-[34px] md:text-[40px] font-light text-ink leading-snug mb-5">
            
            {t('about_heading')}
          </motion.h3>
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-10 h-px bg-terracotta mb-6" />
          
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-[15px] text-ink/60 leading-relaxed max-w-sm mb-8">
            
            {t('about_body')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}>
            
            <Link
              to="/experience"
              className="group inline-flex items-center gap-3 font-sans text-sm font-medium text-tropical border-b border-tropical pb-0.5 hover:text-tropical/70 transition-all duration-300">
              
              {t('about_link')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
          className="relative hidden md:block">
          
          <div className="aspect-[3/2] overflow-hidden">
            

            
            
            
            
          </div>
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-sky/30" />
        </motion.div>
      </div>
    </section>);

}
