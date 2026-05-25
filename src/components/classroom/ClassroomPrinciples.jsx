import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function ClassroomPrinciples({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(null);

  return (
    <section id="principles" className="py-24 bg-quartz overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Board title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl sm:text-4xl text-ink mb-3"
        >
          {t.board.title}
        </motion.h2>

        {/* Drawing line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-olive/20 mb-14 origin-left"
        />

        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
          {/* Left: signature */}
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-serif text-2xl sm:text-3xl text-deep-green leading-[1.2] italic"
            >
              "{t.board.signature}"
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-sans text-[11px] tracking-widest text-ink/30 uppercase"
            >
              {t.board.flow}
            </motion.p>
          </div>

          {/* Right: principles as board notes */}
          <div className="space-y-6">
            {t.board.principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.09 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative group cursor-default"
              >
                <div className="flex gap-4 items-start">
                  <span className="font-sans text-[10px] text-terracotta/40 mt-1 w-6 shrink-0">{p.num}</span>
                  <div>
                    <p className="font-sans text-sm font-medium text-ink/80">{p.name}</p>
                    <motion.p
                      initial={false}
                      animate={{ height: hovered === i ? "auto" : 0, opacity: hovered === i ? 1 : 0 }}
                      transition={{ duration: 0.22 }}
                      className="font-serif italic text-xs text-ink/50 leading-snug overflow-hidden"
                    >
                      {p.note}
                    </motion.p>
                  </div>
                  {hovered === i && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -left-1 top-0 font-sans text-xs text-terracotta font-medium"
                    >
                      ÔÇö
                    </motion.span>
                  )}
                </div>
                {i < t.board.principles.length - 1 && (
                  <div className="mt-6 h-px bg-olive/10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
