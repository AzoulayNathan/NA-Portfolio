import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ClassroomCTA({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 bg-gradient-to-b from-tropical/10 via-deep-green/95 to-deep-green relative overflow-hidden" ref={ref}>
      {/* Seam echoes hero */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 origin-top"
      />
      {/* Light sweep */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={inView ? { x: "200%" } : {}}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
      />

      <div className="max-w-xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-3xl sm:text-4xl text-quartz mb-5"
        >
          {t.cta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="font-sans text-sm text-white/55 leading-relaxed mb-10"
        >
          {t.cta.body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col gap-6 items-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/classroom/contact"
              className="w-40 h-40 rounded-full bg-olive flex items-center justify-center text-center"
              style={{
                boxShadow: "0 4px 24px rgba(63,90,79,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span className="font-serif text-sm text-quartz leading-snug px-4">{t.cta.button}</span>
            </Link>
          </motion.div>
          <a
            href="/"
            className="px-8 py-2.5 font-sans text-sm text-white/55 border border-white/20 hover:bg-sand hover:text-ink hover:border-sand transition-all duration-300"
          >
            {t.cta.secondary}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
