import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useI18n } from '@/lib/i18n';

function ToolBlock({ block, revealed, delay }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay }}
      className="relative cursor-pointer overflow-hidden min-h-[240px]"
      onClick={() => setOpen(!open)}
      whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(31,61,51,0.25)', zIndex: 10 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img src={block.image} alt="" className="w-full h-full object-cover" style={{ opacity: open ? 0.25 : 0.4 }} />
        <div className="absolute inset-0" style={{ backgroundColor: open ? 'rgba(31,61,51,0.97)' : 'rgba(31,61,51,0.62)' }} />
      </div>

      <AnimatePresence>
        {!open && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 p-7 md:p-9 h-full flex flex-col justify-between items-center text-center">
            <div className="w-full">
              <p className="eyebrow-light mb-3">{block.label}</p>
              <h3 className="font-serif text-[28px] md:text-[34px] font-light text-sand leading-snug">{block.hook}</h3>
            </div>
            <div className="flex items-center justify-center gap-2 text-sand/50 text-xs font-sans tracking-widest uppercase mt-4">
              <span>{t('block_open')}</span>
              <span className="text-terracotta">+</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-20 p-7 md:p-9 overflow-auto flex flex-col items-center text-center min-h-full">
            <p className="eyebrow-light mb-3 w-full">{block.label}</p>
            <p className="font-sans text-sm text-sand/80 leading-relaxed mb-5">{block.intro}</p>
            <div className="flex flex-wrap gap-2 mb-5 justify-center">
              {block.tools.map((tool) => (
                <span key={tool} className="font-sans text-xs text-sand/90 border border-sand/25 px-2.5 py-1">{tool}</span>
              ))}
            </div>
            <p className="font-sans text-xs text-sky/80 leading-relaxed italic mb-5">{block.logic}</p>
            <div className="flex items-center justify-center gap-2 text-sand/40 text-xs font-sans tracking-widest uppercase mt-auto">
              <span>{t('block_close')}</span>
              <span className="text-terracotta">−</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Tools() {
  const { t } = useI18n();
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  const BLOCKS = [
    { id: 'environment', label: 'Environment', hook: t('env_hook'), intro: t('env_intro'), tools: ['Windows', 'VS Code', 'Edge', 'PowerShell'], logic: t('env_logic'), image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
    { id: 'web', label: 'Web', hook: t('web_hook'), intro: t('web_intro'), tools: ['React', 'TypeScript', 'Vite', 'Next.js', 'Tailwind CSS'], logic: t('web_logic'), image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80' },
    { id: 'data', label: 'Data', hook: t('data_hook'), intro: t('data_intro'), tools: ['Python', 'SQL', 'R', 'SAS', 'Power BI', 'Excel / VBA'], logic: t('data_logic'), image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80' },
    { id: 'ai', label: 'AI Workflow', hook: t('ai_hook'), intro: t('ai_intro'), tools: ['Ollama', 'OpenRouter', 'Prompting systems', 'Generation / testing loops'], logic: t('ai_logic'), image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80' },
    { id: 'creation', label: 'Creation', hook: t('creation_hook'), intro: t('creation_intro'), tools: ['Canva', 'CapCut', 'Filmora'], logic: t('creation_logic'), image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  ];

  return (
    <PageLayout>

      <section className="bg-sand pt-32 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="eyebrow mb-5">
            {t('tools_eyebrow')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="font-serif text-[52px] md:text-[76px] font-light leading-tight max-w-2xl mx-auto mb-5 text-tropical"
          >
            {t('tools_heading')}<br />
            <em className="not-italic text-tropical">{t('tools_heading2')}</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 2.0 }} className="font-sans text-[15px] text-ink/55 leading-relaxed max-w-md mx-auto">
            {t('tools_body')}
          </motion.p>
        </div>
      </section>

      {/* Grille en U inversé : 5 infos → citation centrale → NA */}
      <section ref={gridRef} className="px-6 md:px-10 pb-24 bg-sand">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          <ToolBlock block={BLOCKS[0]} revealed={gridInView} delay={0} />
          <ToolBlock block={BLOCKS[1]} revealed={gridInView} delay={1} />
          <ToolBlock block={BLOCKS[2]} revealed={gridInView} delay={2} />
          <ToolBlock block={BLOCKS[3]} revealed={gridInView} delay={3} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 5 }}
            className="min-h-[240px] bg-sand border border-ink/10 flex items-center justify-center px-8 md:px-12"
          >
            <p
              className="font-serif font-light italic text-center"
              style={{ color: '#3F5A4F', fontSize: 'clamp(20px, 2.2vw, 28px)', lineHeight: 1.4 }}
            >
              {t('tools_quote')}
            </p>
          </motion.div>
          <ToolBlock block={BLOCKS[4]} revealed={gridInView} delay={4} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 6 }}
            className="md:col-span-3 flex flex-col items-center justify-center gap-6 pt-4 md:pt-6"
          >
            <div
              className="group/na leading-none select-none font-serif font-light cursor-default"
              style={{ fontSize: 'clamp(100px, 16vw, 180px)' }}
            >
              <span
                className="inline transition-[text-shadow,filter] duration-300 group-hover/na:[text-shadow:0_0_42px_rgba(175,200,209,0.95),0_0_88px_rgba(175,200,209,0.45)]"
                style={{ color: '#AFC8D1' }}
              >
                N
              </span>
              <span
                className="inline transition-[text-shadow,filter] duration-300 group-hover/na:[text-shadow:0_0_40px_rgba(181,82,59,0.95),0_0_80px_rgba(181,82,59,0.5)]"
                style={{ color: '#B5523B' }}
              >
                A
              </span>
            </div>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase border-b pb-0.5 transition-all text-tropical border-tropical hover:opacity-70"
            >
              {t('tools_na_link')}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </PageLayout>
  );
}
