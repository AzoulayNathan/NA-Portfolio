import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectSlug } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { ProjectCarouselImage } from '@/components/ProjectMedia';

function slugKey(title) {
  return projectSlug(title).replaceAll('-', '_');
}

/** Fisher–Yates shuffle (mutates and returns same array). */
function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

const SLOT_INTERVALS = [4000, 5000, 6000];
const FLORAL_FRAME_SRC = '/carousel-floral-frame.png';
const SLOT_CLASSES = [
  'col-span-4 h-[430px] md:h-[700px]',
  'col-span-4 h-[430px] md:h-[700px]',
  'col-span-4 h-[430px] md:h-[700px]',
];

function pickRandomExcluding(max, excluded) {
  if (max <= 0) return 0;
  const allowed = [];
  for (let i = 0; i < max; i += 1) {
    if (!excluded.includes(i)) allowed.push(i);
  }
  if (allowed.length === 0) return Math.floor(Math.random() * max);
  return allowed[Math.floor(Math.random() * allowed.length)];
}

function createInitialSlots(max) {
  if (max === 0) return [0, 0, 0];
  const first = Math.floor(Math.random() * max);
  const second = pickRandomExcluding(max, [first]);
  const third = pickRandomExcluding(max, [first, second]);
  return [first, second, third];
}

function SandBurst({ burstKey }) {
  const seeds = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        angle: (Math.PI * 2 * i) / 18 + Math.random() * 0.4,
        dist: 40 + Math.random() * 80,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 0.08,
        olive: i % 2 === 0,
      })),
    [burstKey],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {seeds.map((s) => (
        <motion.span
          key={`${burstKey}-${s.id}`}
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '42%',
            width: s.size,
            height: s.size,
            background: s.olive ? 'rgba(63,90,79,0.85)' : 'rgba(232,223,201,0.95)',
            boxShadow: '0 0 6px rgba(232,223,201,0.5)',
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: Math.cos(s.angle) * s.dist,
            y: Math.sin(s.angle) * s.dist + 30,
            scale: 0.2,
          }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: s.delay }}
        />
      ))}
    </div>
  );
}

export default function ProjectCarousel({ projects, initialDelayMs = 4500, className = '' }) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const pool = useMemo(() => {
    const copy = [...projects];
    shuffleInPlace(copy);
    return copy;
  }, [projects, pathname]);
  const poolSize = pool.length;
  const [slotIndices, setSlotIndices] = useState(() => createInitialSlots(poolSize));
  const [burstKey, setBurstKey] = useState(0);
  const [focusedSlot, setFocusedSlot] = useState(null);
  const [focusedProjectTitle, setFocusedProjectTitle] = useState(null);
  const focusedSlotRef = useRef(null);
  const [slotExitDirs, setSlotExitDirs] = useState([1, -1, 1]);

  const setFocus = (slotIdx, project) => {
    focusedSlotRef.current = slotIdx;
    setFocusedSlot(slotIdx);
    setFocusedProjectTitle(project?.title ?? null);
  };

  const clearFocus = () => {
    focusedSlotRef.current = null;
    setFocusedSlot(null);
    setFocusedProjectTitle(null);
  };

  useEffect(() => {
    setSlotIndices(createInitialSlots(poolSize));
    clearFocus();
  }, [poolSize]);

  useEffect(() => {
    if (poolSize < 2) return undefined;

    const timeouts = [];
    const intervals = SLOT_INTERVALS.map((interval, slotIdx) => {
      const rotateSlot = () => {
        setSlotExitDirs((prev) => {
          const clone = [...prev];
          clone[slotIdx] = Math.random() < 0.5 ? -1 : 1;
          return clone;
        });
        setSlotIndices((prev) => {
          const excluded = prev.filter((_, i) => i !== slotIdx);
          const next = pickRandomExcluding(poolSize, excluded);
          const clone = [...prev];
          clone[slotIdx] = next;
          return clone;
        });
      };

      const timeoutId = window.setTimeout(() => {
        if (focusedSlotRef.current === slotIdx) return;
        rotateSlot();
        setBurstKey((k) => k + 1);
      }, initialDelayMs + slotIdx * 180);
      timeouts.push(timeoutId);

      return window.setInterval(() => {
        if (focusedSlotRef.current === slotIdx) return;
        rotateSlot();
      }, interval);
    });

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      intervals.forEach((id) => window.clearInterval(id));
    };
  }, [initialDelayMs, poolSize]);

  const visibleProjects = useMemo(
    () => (poolSize === 0
      ? []
      : [
          pool[slotIndices[0] % poolSize],
          pool[slotIndices[1] % poolSize],
          pool[slotIndices[2] % poolSize],
        ]),
    [slotIndices, pool, poolSize],
  );
  useEffect(() => {
    if (focusedSlot == null) return;
    const current = visibleProjects[focusedSlot];
    if (!current || current.title !== focusedProjectTitle) {
      clearFocus();
    }
  }, [focusedSlot, focusedProjectTitle, visibleProjects]);

  const focusedProject = useMemo(() => {
    if (!focusedProjectTitle) return null;
    return pool.find((p) => p.title === focusedProjectTitle) || null;
  }, [pool, focusedProjectTitle]);

  return (
    <div
      className={`relative bg-tropical/5 overflow-hidden ${className}`}
      onMouseLeave={clearFocus}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={FLORAL_FRAME_SRC}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-[0.44]"
          style={{
            filter: 'hue-rotate(78deg) saturate(0.62) brightness(0.86) contrast(0.96)',
            mixBlendMode: 'multiply',
          }}
        />
      </div>
      <div className="relative min-h-[430px] md:min-h-[700px] z-10 px-0 pb-2">
        <div
          className="grid grid-cols-12 items-start gap-0 w-full"
          style={{ perspective: '1300px', transformStyle: 'preserve-3d' }}
        >
          {visibleProjects.map((project, slotIdx) => {
            if (!project) return null;
            const hash = projectSlug(project.title);
            return (
              <AnimatePresence mode="wait" key={`slot-${slotIdx}`}>
                <motion.div
                  key={`${slotIdx}-${project.title}`}
                  initial={{ opacity: 0, y: (slotExitDirs[slotIdx] || 1) * -16, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: (slotExitDirs[slotIdx] || 1) * 20, scale: 0.985 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`${SLOT_CLASSES[slotIdx]} -mx-[1px] z-10 ${focusedSlot != null && focusedSlot !== slotIdx ? 'opacity-70' : 'opacity-100'} transition-opacity duration-300`}
                  style={{ transformStyle: 'preserve-3d' }}
                  onMouseEnter={() => setFocus(slotIdx, project)}
                >
                  <div className="pointer-events-none absolute inset-0 translate-x-[10px] translate-y-[12px] rounded-none bg-olive/28 blur-[1px]" />
                  <div className="pointer-events-none absolute inset-0 translate-x-[5px] translate-y-[6px] rounded-none border border-ink/20 bg-ink/8" />
                  <Link
                    to={`/projects#${hash}`}
                    className="group relative block w-full h-full rounded-none border border-ink/18 bg-quartz/92 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-tropical/50"
                    style={{
                      borderRadius: 0,
                      boxShadow: '0 26px 44px rgba(31,61,51,0.2), 0 8px 14px rgba(0,0,0,0.14)',
                    }}
                  >
                    <div className="relative h-[68%] overflow-hidden">
                      <ProjectCarouselImage src={project.image} alt={project.title} />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'linear-gradient(125deg, rgba(246,243,237,0.16) 0%, transparent 58%)' }}
                      />
                      <span className="absolute bottom-3 left-3 z-10 eyebrow-light text-[10px]">{project.year}</span>
                    </div>
                    <div className="h-[32%] bg-quartz/95 px-2.5 md:px-3 py-2.5 flex flex-col items-center justify-center text-center">
                      <p className="eyebrow mb-0.5 text-[9px]">{t(`projects_${slugKey(project.title)}_meta`)}</p>
                      <h3 className="font-serif text-[12px] md:text-[17px] font-light text-ink leading-tight mb-0.5 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="font-sans text-[9px] md:text-[10px] text-ink/58 leading-relaxed line-clamp-1">{t(`projects_${slugKey(project.title)}_pitch`)}</p>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>
        <AnimatePresence>
          {focusedProject && (
            <motion.div
              key={`focus-${focusedSlot}-${focusedProject.title}`}
              initial={{ opacity: 0, scale: 0.84, y: 26 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 14 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            >
              <Link
                to={`/projects#${projectSlug(focusedProject.title)}`}
                className="group relative block w-[min(88vw,760px)] h-[min(78vh,640px)] border-2 border-ink/25 bg-quartz overflow-hidden pointer-events-auto"
                style={{ boxShadow: '0 40px 80px rgba(31,61,51,0.3), 0 18px 28px rgba(0,0,0,0.2)' }}
                onMouseEnter={() => {
                  if (focusedSlot != null) focusedSlotRef.current = focusedSlot;
                }}
              >
                <div className="h-full overflow-y-auto overscroll-contain [scrollbar-width:thin] touch-pan-y">
                  <div className="relative h-[62%] min-h-[330px] overflow-hidden">
                    <img
                      src={focusedProject.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover scale-[1.26]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tropical/78 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 eyebrow-light">{focusedProject.year}</span>
                  </div>
                  <div className="min-h-[46%] bg-quartz px-6 md:px-8 py-4 md:py-5 flex flex-col justify-start">
                    <p className="eyebrow mb-1">{t(`projects_${slugKey(focusedProject.title)}_meta`)}</p>
                    <h3 className="font-serif text-[26px] md:text-[36px] font-light text-ink leading-tight mb-2">
                      {focusedProject.title}
                    </h3>
                    <p className="font-sans text-sm text-ink/62 leading-relaxed mb-3">{t(`projects_${slugKey(focusedProject.title)}_pitch`)}</p>
                    <ul className="space-y-1.5 mb-3">
                      {[t(`projects_${slugKey(focusedProject.title)}_b1`), t(`projects_${slugKey(focusedProject.title)}_b2`)].map((b, i) => (
                        <li key={`${focusedProject.title}-b-${i}`} className="font-sans text-[13px] text-ink/62 leading-relaxed">
                          - {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {(focusedProject.stack || []).map((s) => (
                        <span key={s} className="font-sans text-[10px] tracking-[0.14em] uppercase text-tropical/85 border border-tropical/35 px-2 py-1">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <SandBurst burstKey={burstKey} />
      </div>
    </div>
  );
}
