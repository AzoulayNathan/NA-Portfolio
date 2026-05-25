import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const SHEET_KEYS = ["profile", "experience", "languages"];

export default function ClassroomTeacherDesk({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("profile");
  const [expandedItem, setExpandedItem] = useState(null);

  const handleTabChange = (key) => {
    setActive(key);
    setExpandedItem(null);
  };

  const sheet = t.desk.sheets[active];

  return (
    <section id="profile" className="py-24 bg-quartz" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10">
          {/* Left: title + tagline + tabs */}
          <div className="lg:w-60 shrink-0">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-serif text-3xl sm:text-4xl text-ink leading-tight mb-4"
            >
              {t.desk.title}
            </motion.h2>
            <div className="w-8 h-px bg-olive/30 mb-4" />
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-serif italic text-sm text-olive/60 leading-snug mb-8"
            >
              {t.desk.tagline}
            </motion.p>

            <div className="flex lg:flex-col gap-2">
              {SHEET_KEYS.map((key) => {
                const s = t.desk.sheets[key];
                return (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + SHEET_KEYS.indexOf(key) * 0.08 }}
                    onClick={() => handleTabChange(key)}
                    className={`text-left px-3 py-2 font-serif text-base transition-all border-l-2 ${
                      active === key
                        ? "border-deep-green text-deep-green bg-deep-green/5 font-medium"
                        : "border-transparent text-ink/40 hover:text-ink/70 hover:border-olive/25"
                    }`}
                  >
                    {s.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: paper sheet sliding from right */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="bg-quartz/80 border-l-2 border-sand p-7 relative min-h-[300px]"
              >
                {/* Notebook margin line */}
                <div className="absolute left-14 top-0 bottom-0 w-px bg-sky-blue/20 pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sand pointer-events-none" />

                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-olive/35 mb-5 ml-8">
                  {sheet.label}
                </p>

                <ul className="space-y-1 ml-8">
                  {sheet.items.map((item, i) => {
                    const itemKey = `${active}-${i}`;
                    const isOpen = expandedItem === itemKey;
                    return (
                      <motion.li
                        key={itemKey}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.28, delay: i * 0.045 }}
                      >
                        <button
                          onClick={() => setExpandedItem(isOpen ? null : itemKey)}
                          className={`text-left w-full flex items-start gap-3 py-1.5 group transition-colors ${
                            isOpen ? "text-deep-green" : "text-ink/72 hover:text-ink"
                          }`}
                        >
                          <span
                            className={`w-px h-5 mt-0.5 shrink-0 block transition-colors duration-200 ${
                              isOpen ? "bg-terracotta/50" : "bg-olive/20 group-hover:bg-olive/45"
                            }`}
                          />
                          <span className="font-sans text-sm font-medium">{item.title}</span>
                          <span className={`ml-auto font-sans text-[10px] text-ink/25 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                            +
                          </span>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden"
                            >
                              <p className="font-serif italic text-sm text-ink/50 leading-snug pt-1 pb-2.5 pl-4 ml-4 border-l border-sky-blue/30">
                                {item.detail}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </ul>

                {active === "languages" && sheet.note && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="ml-8 mt-5 font-serif italic text-xs text-ink/38 leading-snug"
                  >
                    {sheet.note}
                  </motion.p>
                )}

                {/* Corner correction mark */}
                <span className="absolute top-4 right-4 font-serif italic text-[10px] text-terracotta/30">
                  Ô£ô
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
