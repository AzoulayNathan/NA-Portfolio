import { motion, useReducedMotion } from "framer-motion";

// Replace with Nathan's personal image when available.
// Recommended: warm desk scene, handwritten notes, soft daylight, olive shadows.
const HERO_IMAGE = "https://media.base44.com/images/public/6a13fc24178d42b5928c0a73/a3f7fae75_generated_image.png";

export default function ClassroomHero({ t }) {
  const reduced = useReducedMotion();
  const d = (v) => (reduced ? 0 : v);
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const titleLines = t.hero.title.split("\n");

  return (
    <section
      className="relative min-h-screen flex items-stretch overflow-hidden pt-14"
      style={{ background: "linear-gradient(135deg, #F6F3ED 0%, #E8DFC9 45%, #d5e5e0 78%, #AFC8D1 100%)" }}
    >
      {/* Vertical seam */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: d(1.4), delay: d(0.1), ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[50%] lg:left-[45%] top-0 h-full w-px bg-olive/12 origin-top hidden lg:block z-10"
      />

      {/* Bottom gradient fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-20"
        style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_1.45fr] gap-8 lg:gap-0 items-center w-full relative z-10">
        {/* Left: copy */}
        <div className="space-y-6 lg:pr-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.5), delay: d(0.25) }}
            className="font-sans text-[11px] uppercase tracking-[0.22em] text-olive/60"
          >
            {t.hero.eyebrow}
          </motion.p>

          <div className="space-y-1">
            {titleLines.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: d(0.72), delay: d(0.38 + i * 0.13), ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ink font-medium leading-[1.05] tracking-tight"
                >
                  {line}
                </motion.h1>
              </div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.6), delay: d(0.7) }}
            className="font-sans text-[15px] text-ink/58 leading-relaxed max-w-[400px]"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: d(0.5), delay: d(0.9) }}
            className="font-serif italic text-xl sm:text-2xl text-terracotta/75"
          >
            {t.hero.humanLine}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.5), delay: d(1.05) }}
            className="flex flex-wrap gap-6 pt-2 items-center"
          >
            <motion.button
              onClick={() => scroll("contact")}
              className="vibrate w-36 h-36 rounded-full bg-olive flex items-center justify-center text-center cursor-pointer shrink-0"
              style={{
                border: "none",
                boxShadow: "0 4px 20px rgba(63,90,79,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="font-serif text-sm text-quartz leading-snug px-3">{t.hero.cta1}</span>
            </motion.button>
            <motion.button
              onClick={() => scroll("principles")}
              whileHover={{ scale: 1.03 }}
              className="font-sans text-sm text-ink/60 border-b border-ink/20 pb-px hover:text-ink/80 hover:border-ink/40 transition-colors duration-200"
            >
              {t.hero.cta2}
            </motion.button>
          </motion.div>
        </div>

        {/* Right: full-height image with left fade */}
        <div className="relative self-stretch min-h-[480px] lg:min-h-[640px]">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: d(1.1), delay: d(0.45), ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={HERO_IMAGE}
              alt="Teaching desk ÔÇö handwritten mathematics notes, French correction marks, warm daylight"
              className="w-full h-full object-cover object-center"
              style={{
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 18%, black 38%)",
                maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 18%, black 38%)",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.style.background =
                  "linear-gradient(135deg, #E8DFC9 0%, #d5e5e0 60%, #AFC8D1 100%)";
              }}
            />
          </motion.div>

          {/* Floating annotations */}
          {t.hero.annotations.map((a, i) => {
            const pos = ["-bottom-2 left-4", "-top-2 right-8", "bottom-16 -right-2", "top-20 left-2"];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: d(0.4), delay: d(1.15 + i * 0.1) }}
                className={`absolute ${pos[i]} bg-quartz/80 backdrop-blur-sm px-2.5 py-1 z-20 hidden sm:block`}
              >
                <span className="font-serif italic text-[11px] text-ink/45">{a}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
