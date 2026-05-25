import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { key: "profile", id: "profile" },
  { key: "principles", id: "principles" },
  { key: "tools", id: "tools" },
  { key: "lab", id: "lab" },
  { key: "qa", id: "qa" },
  { key: "contact", id: "contact" },
];

export default function ClassroomHeader({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top < 160) {
          setActive(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-quartz/92 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-13 flex items-center justify-between gap-6">
        <span className="font-serif text-base text-deep-green tracking-wide shrink-0 flex items-baseline gap-1">
          <motion.span
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 180, damping: 14 }}
            className="inline-block"
          >
            NA
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Classroom
          </motion.span>
        </span>

        <nav className="hidden lg:flex items-center gap-5">
          {NAV_ITEMS.map(({ key, id }) => (
            <button
              key={key}
              onClick={() => scroll(id)}
              className={`font-sans text-xs transition-colors relative pb-0.5 ${
                active === id ? "text-deep-green" : "text-ink/45 hover:text-ink/70"
              }`}
            >
              {t.nav[key]}
              {active === id && (
                <motion.span
                  layoutId="activeRule"
                  className="absolute bottom-0 left-0 right-0 h-px bg-olive/60"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex text-[11px] font-sans gap-0.5">
            {["en", "fr", "es"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-1.5 py-0.5 transition-colors ${
                  lang === l ? "text-deep-green font-medium" : "text-ink/35 hover:text-ink/60"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="/" className="font-sans text-[11px] text-ink/30 hover:text-ink/55 transition-colors hidden sm:block">
            {t.nav.studio} ÔåÆ
          </a>
        </div>
      </div>
      {scrolled && <div className="h-px bg-olive/12" />}
    </motion.header>
  );
}
