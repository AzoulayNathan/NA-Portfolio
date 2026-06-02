import { motion, useReducedMotion } from "framer-motion";
import NaHoverCircleButton from "@/components/ui/NaHoverCircleButton";

const HERO_IMAGE = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80";

export default function ClassroomHero({ t }) {
  const reduced = useReducedMotion();
  const d = (v) => (reduced ? 0 : v);
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const titleLines = t.hero.title.split("\n");
  const textEase = [0.22, 1, 0.36, 1];

  return (
    <section
      className="relative min-h-screen flex items-stretch overflow-hidden pt-16"
      style={{ background: "linear-gradient(135deg, #F6F3ED 0%, #E8DFC9 45%, #d5e5e0 78%, #AFC8D1 100%)" }}
    >
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: d(1.4), delay: d(0.1), ease: textEase }}
        className="absolute left-[50%] lg:left-[45%] top-0 h-full w-px bg-olive/12 origin-top hidden lg:block z-10"
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{ background: "linear-gradient(to bottom, transparent, #F6F3ED)" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_1.45fr] gap-8 lg:gap-0 items-center w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 56 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: d(0.85), ease: textEase }}
          className="space-y-6 lg:pr-12"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-olive/60">
            {t.hero.eyebrow}
          </p>

          <div className="space-y-1">
            {titleLines.map((line, i) => (
              <h1
                key={i}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ink font-medium leading-[1.05] tracking-tight"
              >
                {line}
              </h1>
            ))}
          </div>

          <p className="font-sans text-[15px] text-ink/58 leading-relaxed max-w-[400px]">
            {t.hero.subtitle}
          </p>

          <p className="font-serif italic text-xl sm:text-2xl text-terracotta/75">
            {t.hero.humanLine}
          </p>

          <div className="flex flex-wrap gap-6 pt-2 items-center">
            <NaHoverCircleButton label={t.hero.cta1} to="/classroom/contact" size="md" variant="olive" />
            <motion.button
              type="button"
              onClick={() => scroll("principles")}
              whileHover={{ scale: 1.03 }}
              className="font-sans text-sm text-ink/60 border-b border-ink/20 pb-px hover:text-ink/80 hover:border-ink/40 transition-colors duration-200"
            >
              {t.hero.cta2}
            </motion.button>
          </div>
        </motion.div>

        <div className="relative self-stretch min-h-[480px] lg:min-h-[640px]">
          <motion.div
            initial={{ opacity: 0, x: -56 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: d(0.9), delay: d(0.55), ease: textEase }}
            className="absolute inset-0"
          >
            <img
              src={HERO_IMAGE}
              alt="Teaching desk — handwritten mathematics notes, French correction marks, warm daylight"
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

          {t.hero.annotations.map((a, i) => {
            const pos = ["-bottom-2 left-4", "-top-2 right-8", "bottom-16 -right-2", "top-20 left-2"];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: d(0.4), delay: d(1.2 + i * 0.1) }}
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
