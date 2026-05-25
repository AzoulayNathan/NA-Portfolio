import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function LessonStep({ stepLabel, content, isExplanation, delay, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-7"
    >
      {/* Line segment */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.4, delay: delay - 0.1, ease: "easeOut" }}
        className="absolute left-2 top-0 bottom-0 w-px bg-olive/15 origin-top"
      />
      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.25, delay: delay + 0.05 }}
        className="absolute left-0.5 top-2 w-3 h-3 rounded-full bg-white border-2 border-olive/30"
      />

      <p className="font-sans text-[10px] uppercase tracking-wider text-ink/25 mb-0.5">{stepLabel}</p>
      <p className={`font-sans text-sm leading-relaxed ${isExplanation ? "font-serif italic text-deep-green text-base" : "text-ink/65"}`}>
        {content}
      </p>
    </motion.div>
  );
}

function LessonSide({ data, steps, side, inView }) {
  const isLeft = side === "left";
  const baseDelay = isLeft ? 0.5 : 0.72;
  const stepInterval = 0.45;
  const values = [data.learnerSays, data.diagnosis, data.explanation, data.exercise, data.feedback];

  return (
    <div className="space-y-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: isLeft ? 0.3 : 0.45 }}
        className="mb-7"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink/28">{data.tag}</span>
        <h3 className="font-serif text-xl text-ink mt-1">{data.problem}</h3>
      </motion.div>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <LessonStep
            key={i}
            stepLabel={step}
            content={values[i]}
            isExplanation={i === 2}
            delay={baseDelay + i * stepInterval}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}

export default function ClassroomSplitLab({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="lab" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Split background */}
      <div className="absolute inset-0 grid md:grid-cols-2 pointer-events-none">
        <div style={{ background: "#F6F3ED" }} />
        <div style={{ background: "rgba(175, 200, 209, 0.12)" }} />
      </div>
      {/* Stronger center seam */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-0 bottom-0 w-px bg-olive/20 origin-top hidden md:block pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif text-3xl sm:text-4xl text-ink mb-2"
        >
          {t.lab.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-sans text-sm text-ink/45 mb-12"
        >
          {t.lab.subtitle}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="md:pr-10 pb-10 md:pb-0">
            <LessonSide data={t.lab.math} steps={t.lab.steps} side="left" inView={inView} />
          </div>
          <div className="md:pl-10 pt-10 md:pt-0 border-t md:border-t-0 border-sand">
            <LessonSide data={t.lab.fle} steps={t.lab.steps} side="right" inView={inView} />
          </div>
        </div>

        {/* Closing citation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 3.2 }}
          className="mt-16 text-center"
        >
          <p className="font-serif italic text-2xl sm:text-3xl text-olive leading-snug">
            {t.lab.quote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
