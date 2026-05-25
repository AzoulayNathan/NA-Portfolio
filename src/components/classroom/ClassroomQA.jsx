import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

export default function ClassroomQA({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [open, setOpen] = useState(null);

  return (
    <section id="qa" className="py-24 bg-quartz relative" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl sm:text-4xl text-ink mb-10"
        >
          {t.qa.title}
        </motion.h2>

        <div className="divide-y divide-olive/10">
          {t.qa.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.06 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-5 flex items-start justify-between gap-6 group"
              >
                <div className="flex items-start gap-3">
                  {open === i && (
                    <span className="w-1 h-full bg-terracotta/50 shrink-0 mt-0.5 self-stretch" />
                  )}
                  <span className="font-sans text-sm text-ink/75 group-hover:text-ink transition-colors leading-relaxed">
                    {item.q}
                  </span>
                </div>
                <span className={`font-sans text-lg text-ink/25 shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="font-sans text-sm text-ink/55 leading-relaxed pb-5 pl-4 border-l-2 border-terracotta/20">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
