import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Asymmetric grid layout ÔÇö Formula Builder featured
const GRID_STYLES = [
  "col-span-2 row-span-2",  // Formula Builder
  "col-span-1",             // Error Diary
  "col-span-1",             // OralSafe
  "col-span-1",             // MicroExam
  "col-span-2",             // Concept Builder
  "col-span-1",             // Learning Map
];

const TOOL_IMAGES = {
  "formula-builder": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80",
  "error-diary": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
  "oralsafe": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=80",
  "microexam": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
  "concept-builder": "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80",
  "learning-map": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80",
};

// CSS-only fallback visuals per tool
function ToolFallback({ id, large }) {
  const h = large ? "h-36" : "h-20";

  if (id === "formula-builder") return (
    <div className={`${h} bg-olive/8 flex flex-col items-center justify-center gap-1 mb-3`}>
      <span className="font-mono text-[11px] text-olive/50">x╠ä = ╬úxßÁó / n</span>
      <span className="font-mono text-[10px] text-olive/30">v = d / t</span>
      <div className="flex gap-1 mt-1">{[3, 5, 4, 6, 3].map((h, i) => <div key={i} style={{ height: h * 3 }} className="w-2 bg-olive/20 rounded-sm" />)}</div>
    </div>
  );

  if (id === "error-diary") return (
    <div className={`${h} bg-terracotta/7 flex flex-col justify-center px-4 gap-1 mb-3`}>
      {["ÔÇö mistake Ô£ù", "ÔÇö pattern ÔåÆ", "ÔÇö practice Ô£ô"].map((l, i) => (
        <span key={i} className={`font-mono text-[10px] ${i === 0 ? "text-terracotta/50" : i === 1 ? "text-olive/40" : "text-deep-green/40"}`}>{l}</span>
      ))}
    </div>
  );

  if (id === "oralsafe") return (
    <div className={`${h} bg-sky-blue/12 flex items-center justify-center gap-1 mb-3`}>
      {[2, 4, 6, 8, 6, 4, 7, 5, 3, 6, 4, 2].map((v, i) => (
        <div key={i} style={{ height: v * 4 }} className="w-1.5 bg-sky-blue/50 rounded-full" />
      ))}
    </div>
  );

  if (id === "microexam") return (
    <div className={`${h} bg-sand/60 flex flex-col items-center justify-center gap-1.5 mb-3`}>
      <span className="font-sans text-xl font-light text-olive/50">10'</span>
      {[80, 60, 90].map((w, i) => <div key={i} style={{ width: `${w}%` }} className="h-px bg-olive/20 rounded" />)}
    </div>
  );

  if (id === "concept-builder") return (
    <div className={`${h} bg-deep-green/6 flex items-center justify-center gap-1 mb-3`}>
      {["Simple", "Visual", "Analogy", "Exam"].map((label, i) => (
        <div key={i} className="bg-white/60 px-1.5 py-0.5 rounded-sm text-[9px] font-sans text-olive/50 shadow-sm" style={{ transform: `rotate(${(i - 1.5) * 2.5}deg) translateY(${Math.abs(i - 1.5) * 3}px)` }}>
          {label}
        </div>
      ))}
    </div>
  );

  if (id === "learning-map") return (
    <div className={`${h} bg-sand/40 flex items-center justify-center gap-3 mb-3`}>
      {[["bg-olive", ""], ["bg-sand border border-olive/30", ""], ["bg-transparent border border-olive/20", ""]].map(([cls, _], i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className={`w-5 h-5 rounded-full ${cls}`} />
          {i < 2 && <div className="w-6 h-px bg-olive/20 absolute" style={{ transform: `translateX(${i === 0 ? 18 : 0}px)` }} />}
        </div>
      ))}
    </div>
  );

  return <div className={`${h} bg-sand/50 mb-3`} />;
}

function AppCard({ app, idx, inView, onOpen }) {
  const isFeatured = idx === 0;
  const imgSrc = TOOL_IMAGES[app.id];

  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.8, delay: idx * 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(26,26,24,0.08)" }}
      onClick={() => onOpen(app)}
      className={`${GRID_STYLES[idx]} text-left bg-quartz p-5 cursor-pointer transition-all duration-300 border border-sand/60`}
      style={{ transformOrigin: "bottom center" }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={app.name}
          className={`w-full object-cover mb-3 ${isFeatured ? "h-36" : "h-20"}`}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : (
        <ToolFallback id={app.id} large={isFeatured} />
      )}
      <p className={`font-serif ${isFeatured ? "text-xl" : "text-base"} text-ink mb-1`}>{app.name}</p>
      <p className="font-sans text-xs text-ink/45 leading-snug">{app.short}</p>
    </motion.button>
  );
}

function DetailPanel({ app, t, onClose }) {
  const imgSrc = TOOL_IMAGES[app.id];

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={app.name}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-quartz w-full max-w-md max-h-[88vh] overflow-y-auto p-7"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-sans text-xs text-ink/35 hover:text-ink/65 transition-colors"
        >
          {t.closeLabel}
        </button>

        {imgSrc ? (
          <img src={imgSrc} alt={app.name} className="w-full h-32 object-cover mb-4" />
        ) : (
          <div className="mb-4"><ToolFallback id={app.id} large /></div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-serif text-2xl text-ink">{app.name}</h3>
          <span className="font-sans text-[10px] uppercase tracking-widest text-terracotta/55 border border-terracotta/20 px-2 py-0.5 shrink-0">
            {app.status}
          </span>
        </div>

        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-4">{app.description}</p>
        <p className="font-serif italic text-sm text-olive/65 mb-5">"{app.value}"</p>

        <div className="mb-4">
          <p className="font-sans text-[10px] uppercase tracking-wider text-ink/30 mb-2">For</p>
          <div className="flex flex-wrap gap-1.5">
            {app.targets.map((tg, i) => (
              <span key={i} className="font-sans text-xs text-ink/50 bg-sand/60 px-2 py-0.5">{tg}</span>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="font-sans text-[10px] uppercase tracking-wider text-ink/30 mb-2">V1 features</p>
          <ul className="space-y-1">
            {app.features.map((f, i) => (
              <li key={i} className="font-sans text-xs text-ink/55 flex items-start gap-2">
                <span className="w-3 h-px bg-olive/30 mt-1.5 shrink-0 block" />{f}
              </li>
            ))}
          </ul>
        </div>

        {app.examples.length > 0 && (
          <div className="mb-5">
            <p className="font-sans text-[10px] uppercase tracking-wider text-ink/30 mb-2">Examples</p>
            <div className="flex flex-wrap gap-1.5">
              {app.examples.map((ex, i) => (
                <span key={i} className="font-mono text-xs text-olive/55 bg-olive/6 px-2 py-0.5">{ex}</span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-sand pt-4">
          <p className="font-sans text-xs text-ink/28 italic">{t.githubLabel}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ClassroomToolTable({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [selected, setSelected] = useState(null);

  return (
    <section id="tools" className="py-24 bg-quartz" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl sm:text-4xl text-ink mb-3"
        >
          {t.tools.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-sans text-sm text-ink/52 leading-relaxed mb-2 max-w-xl"
        >
          {t.tools.intro}
        </motion.p>
        <p className="font-sans text-[11px] text-terracotta/45 italic mb-10">{t.tools.label}</p>

        <div className="grid grid-cols-3 gap-3 auto-rows-auto">
          {t.tools.apps.map((app, i) => (
            <AppCard key={app.id} app={app} idx={i} inView={inView} onOpen={setSelected} />
          ))}
        </div>

        <p className="mt-5 font-sans text-[11px] text-ink/25 text-center">
          Click any tool to open its file.
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <DetailPanel app={selected} t={t.tools} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
