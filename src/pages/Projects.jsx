import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shuffle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useI18n } from '@/lib/i18n';
import ContactButton from '@/components/ui/ContactButton';
import { PROJECTS } from '@/data/portfolioProjects';
import { projectSlug } from '@/lib/utils';
import { ProjectCoverImage } from '@/components/ProjectMedia';

const ALLOWED_PROOF_TYPES = ['github', 'pdf', 'image'];

function getProof(project) {
  const type = project?.proof_type;
  const url = project?.proof_url;
  if (!ALLOWED_PROOF_TYPES.includes(type)) return null;
  if (typeof url !== 'string' || url.trim() === '') return null;
  return { type, url };
}

const TYPE_FILTERS = ['All', 'Personal', 'School', 'Professional'];
const TOPIC_FILTERS = ['Data', 'AI', 'Automation', 'Web', 'Research', 'Game'];

const FLOAT_VARIANTS = [
  { y: [-4, 4, -4], duration: 4.2 },
  { y: [-6, 3, -6], duration: 5.7 },
  { y: [-3, 6, -3], duration: 3.9 },
  { y: [-5, 2, -5], duration: 6.1 },
  { y: [-4, 5, -4], duration: 4.8 },
];

function ProjectBlock({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;
  const float = FLOAT_VARIANTS[index % FLOAT_VARIANTS.length];
  const { t } = useI18n();
  const proof = getProof(project);
  const proofLabel =
    proof &&
    (typeof project?.cta_i18n_key === 'string' && project.cta_i18n_key.trim()
      ? t(project.cta_i18n_key.trim())
      : t(`projects_proof_${proof.type}`));
  const slugKey = projectSlug(project.title).replaceAll('-', '_');
  const meta = t(`projects_${slugKey}_meta`);
  const pitch = t(`projects_${slugKey}_pitch`);
  const bullets = [t(`projects_${slugKey}_b1`), t(`projects_${slugKey}_b2`)];

  return (
    <motion.article
      id={projectSlug(project.title)}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`grid grid-cols-1 md:grid-cols-2 md:grid-rows-1 md:h-[520px] md:max-h-[520px] min-h-[420px] md:min-h-0 items-stretch overflow-hidden border-b border-ink/10 scroll-mt-28 ${isEven ? '' : 'md:[direction:rtl]'}`}
    >
      {/* Image */}
      <div className="relative min-h-[260px] h-[280px] md:h-full md:min-h-0 w-full overflow-hidden group shrink-0 md:shrink" style={{ direction: 'ltr' }}>
        <motion.div
          className="absolute inset-0"
          animate={{ y: float.y }}
          transition={{ duration: float.duration, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
        >
          <ProjectCoverImage src={project.image} alt={project.title} className="w-full h-full" />
        </motion.div>
        <div className="absolute bottom-5 left-5 z-10">
          <span className="eyebrow-light">{project.year}</span>
        </div>
      </div>

      {/* Text */}
      <motion.div
        className="flex flex-col min-h-0 md:h-full md:overflow-hidden justify-start p-8 md:p-10 lg:p-12 bg-sand"
        style={{ direction: 'ltr', border: '2px solid rgba(63,90,79,0.18)', borderLeft: '3px solid rgba(63,90,79,0.25)' }}
        animate={{ y: float.y.map(v => v * -0.5) }}
        transition={{ duration: float.duration * 1.1, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      >
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin] pr-1 -mr-1">
          <p className="eyebrow mb-3 shrink-0 line-clamp-2">{meta}</p>
          <h3 className="font-serif text-[32px] md:text-[38px] lg:text-[42px] font-light text-ink leading-tight mb-2 shrink-0 line-clamp-3">{project.title}</h3>
          <div className="w-6 h-px bg-terracotta mb-3 shrink-0" />
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-4 max-w-sm shrink-0 line-clamp-5">{pitch}</p>
          <ul className="space-y-1.5 mb-4 shrink-0">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 min-w-0">
                <span className="w-1 h-1 rounded-full bg-olive mt-1.5 shrink-0" />
                <span className="font-sans text-sm text-ink/55 line-clamp-2">{b}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mb-1 shrink-0">
            {project.stack.map((s) => (
              <span key={s} className="font-sans text-[11px] tracking-widest uppercase text-tropical/80 border border-tropical/30 px-2.5 py-1">
                {s}
              </span>
            ))}
          </div>
        </div>
        {proof && (
          <a
            href={proof.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 font-sans text-sm font-medium text-tropical border-b border-tropical pb-0.5 w-fit hover:text-tropical/70 transition-all shrink-0 mt-auto pt-2"
          >
            {proofLabel}
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </a>
        )}
      </motion.div>
    </motion.article>
  );
}

export default function Projects() {
  const [activeType, setActiveType] = useState('All');
  const [activeTopics, setActiveTopics] = useState([]);
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const raw = location.hash?.replace(/^#/, '');
    if (!raw) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(raw);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.hash, location.pathname]);

  const toggleTopic = (topic) => {
    setActiveTopics((prev) =>
      prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]
    );
  };

  const filterKey = (f) => {
    const map = {
      All: 'filter_all',
      Personal: 'filter_personal',
      School: 'filter_school',
      Professional: 'filter_professional',
      Data: 'filter_data',
      AI: 'filter_ai',
      Automation: 'filter_automation',
      Web: 'filter_web',
      Research: 'filter_research',
      Game: 'filter_game',
    };
    return t(map[f] || f);
  };

  const filtered = PROJECTS.filter((p) => {
    const typeOk = activeType === 'All' || p.categories.includes(activeType);
    const topicOk = activeTopics.length === 0 || activeTopics.some((tp) => p.categories.includes(tp));
    return typeOk && topicOk;
  });

  const goRandomProject = () => {
    const randomProject = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
    if (!randomProject) return;
    navigate(`/projects#${projectSlug(randomProject.title)}`);
    requestAnimationFrame(() => {
      const target = document.getElementById(projectSlug(randomProject.title));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-tropical pt-32 pb-20 px-6 md:px-10 relative">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow-light mb-5"
          >
            {t('projects_eyebrow')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-serif text-[56px] md:text-[80px] font-light text-sand leading-tight max-w-2xl mb-6"
          >
            {t('projects_heading')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="font-sans text-[15px] text-sand/55 leading-relaxed max-w-md"
          >
            {t('projects_body')}
          </motion.p>
        </div>
      </section>

      {/* Sticky 2-row filter bar */}
      <div className="bg-sand border-b border-ink/10 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 items-center">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveType(f)}
                className={`font-sans text-xs tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 ${
                  activeType === f ? 'bg-tropical text-sand border-tropical' : 'text-ink/50 border-ink/20 hover:border-ink/50 hover:text-ink'
                }`}
              >
                {filterKey(f)}
              </button>
            ))}
            <button
              type="button"
              onClick={goRandomProject}
              className="ml-auto group inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-4 py-1.5 border border-olive/35 text-olive hover:border-olive/60 hover:bg-olive/10 transition-all"
            >
              <Shuffle size={12} className="group-hover:rotate-12 transition-transform" />
              {t('projects_random')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPIC_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => toggleTopic(f)}
                className={`font-sans text-xs tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 ${
                  activeTopics.includes(f) ? 'bg-olive text-sand border-olive' : 'text-ink/40 border-ink/15 hover:border-ink/40 hover:text-ink'
                }`}
              >
                {filterKey(f)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Archive */}
      <div className="bg-sand">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeType + activeTopics.join()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((p, i) => (
                <ProjectBlock key={p.title} project={p} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <p className="font-serif text-2xl text-ink/40">{t('projects_nothing')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Closing */}
      <section className="bg-quartz py-20 px-6 md:px-10 border-t border-ink/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="font-serif text-[28px] font-light text-ink mb-2">{t('projects_closing_heading')}</p>
            <p className="font-sans text-sm text-ink/50">{t('projects_closing_sub')}</p>
          </div>
          <ContactButton label={t('projects_cta')} href="/contact" />
        </div>
      </section>
    </PageLayout>
  );
}