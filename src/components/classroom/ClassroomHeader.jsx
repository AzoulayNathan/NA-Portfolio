import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";

const NAV_ITEMS = [
  { key: "profile", id: "profile" },
  { key: "principles", id: "principles" },
  { key: "tools", id: "tools" },
  { key: "lab", id: "lab" },
  { key: "qa", id: "qa" },
  { key: "contact", id: "contact", route: "/classroom/contact" },
];

export default function ClassroomHeader({ t, lang, setLang }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const item of [...NAV_ITEMS].reverse()) {
        if (item.route) continue;
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

  const goTo = (item) => {
    if (item.route) {
      navigate(item.route);
      return;
    }
    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 overflow-visible ${
        scrolled
          ? "bg-sand/95 backdrop-blur-sm border-b border-ink/8"
          : "bg-olive/95 backdrop-blur-sm border-b border-sand/15"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/classroom")}
          className="flex items-center gap-2 group shrink-0"
        >
          <motion.div
            className="w-8 h-8 bg-tropical flex items-center justify-center"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
          >
            <span className="font-serif text-sand text-sm font-semibold tracking-tight">NA</span>
          </motion.div>
          <span className="font-sans text-xs font-medium text-sand/70 tracking-widest uppercase hidden sm:block group-hover:text-sand transition-colors">
            Classroom
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_ITEMS.map(({ key, id, route }) => {
            const isActive = route ? false : active === id;
            return (
              <button
                key={key}
                type="button"
                onClick={() => goTo({ key, id, route })}
                className={`font-sans text-xs font-medium tracking-widest uppercase transition-colors duration-200 relative ${
                  isActive ? "text-sand" : scrolled ? "text-ink/60 hover:text-ink" : "text-sand/75 hover:text-sand"
                }`}
              >
                {t.nav[key]}
                {isActive && (
                  <motion.span
                    layoutId="classroom-nav-indicator"
                    className={`absolute -bottom-1 left-0 right-0 h-px ${scrolled ? "bg-tropical" : "bg-sand"}`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className={`flex items-center gap-1.5 font-sans text-xs font-medium transition-colors ${
                scrolled ? "text-olive/70 hover:text-olive" : "text-sand/80 hover:text-sand"
              }`}
              aria-label="Language"
            >
              <Globe size={13} />
              <span className="uppercase">{lang}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 bg-sand border border-ink/10 shadow-sm py-1 min-w-[80px] z-[100]"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        setLang(l);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 font-sans text-xs tracking-widest uppercase transition-colors ${
                        lang === l ? "text-tropical font-medium" : "text-ink/50 hover:text-ink"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="/"
            className={`font-sans text-xs font-medium tracking-widest uppercase transition-colors hidden sm:block ${
              scrolled ? "text-ink/50 hover:text-ink/80" : "text-sand/55 hover:text-sand/90"
            }`}
          >
            {t.nav.studio} →
          </a>
        </div>
      </div>
    </motion.header>
  );
}
