import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n, LANGUAGES } from '@/lib/i18n';
import { useSandRain } from '@/lib/SandRainContext';
import { Globe, CloudRain, Volume2, ChevronDown, Lock } from 'lucide-react';
import NaRoomsMenu from './NaRoomsMenu';
import { NA_WEBSITES_URL, NA_RESEARCH_URL } from '@/lib/externalLinks';

const DEFAULT_AMBIENCE_VOLUME = 12;
const AMBIENCE_MAX_SCALE = 0.01;
let sharedAmbienceAudio = null;
let sharedAmbienceVolume = DEFAULT_AMBIENCE_VOLUME;

function getSharedAmbienceAudio() {
  if (typeof window === 'undefined') return null;
  if (!sharedAmbienceAudio) {
    const audio = new Audio('/home-ambience.m4a');
    audio.loop = true;
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audio.volume = (sharedAmbienceVolume / 100) * AMBIENCE_MAX_SCALE;
    sharedAmbienceAudio = audio;
  }
  return sharedAmbienceAudio;
}

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(sharedAmbienceVolume);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const { enabled: sandRainEnabled, setEnabled: setSandRainEnabled } = useSandRain();
  const ambienceRef = useRef(null);

  const navItems = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_projects'), path: '/projects' },
    { label: t('nav_expertise'), path: '/expertise' },
    { label: t('nav_path'), path: '/experience' },
    { label: t('nav_tools'), path: '/tools' },
    { label: t('nav_contact'), path: '/contact' },
  ];
  const isRoomsActive = ['/classroom', '/websites'].includes(location.pathname);
  const isNavItemActive = (path) =>
    path === '/expertise'
      ? location.pathname === '/expertise' || location.pathname.startsWith('/expertise/')
      : location.pathname === path;
  const isContactTop = location.pathname === '/contact' && !scrolled;
  const isHomeTop = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onMessage = (event) => {
      if (event.data?.type === 'na-expertise-scroll') {
        setScrolled(Number(event.data.y) > 40);
      }
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  // Reset scrolled styling when leaving expertise routes via parent scroll
  useEffect(() => {
    if (!location.pathname.startsWith('/expertise')) {
      setScrolled(window.scrollY > 40);
    }
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setRoomsOpen(false);
    setMobileRoomsOpen(false);
    setVolumeOpen(false);
    // Scroll to top on every route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    ambienceRef.current = getSharedAmbienceAudio();
    return () => {
      ambienceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = ambienceRef.current;
    if (!audio) return;
    sharedAmbienceVolume = volume;
    audio.volume = (volume / 100) * AMBIENCE_MAX_SCALE;
  }, [volume]);

  const handleNavClick = (path) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(path);
  };

  const handleNavItemClick = (item) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      setMenuOpen(false);
      return;
    }
    handleNavClick(item.path);
    setMenuOpen(false);
  };

  const navItemKey = (item) => item.path || item.href;

  const ensurePlayback = async () => {
    const audio = ambienceRef.current;
    if (!audio) return;

    try {
      await audio.play();
    } catch {
      // Browser may block autoplay until user interaction; slider/button click retries playback.
    }
  };

  const toggleVolumePanel = async () => {
    setVolumeOpen((v) => !v);
    await ensurePlayback();
  };

  const onVolumeChange = async (event) => {
    const next = Number(event.target.value);
    setVolume(next);
    const audio = ambienceRef.current;
    if (!audio) return;
    if (next === 0) {
      audio.pause();
      return;
    }
    if (audio.paused) await ensurePlayback();
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 overflow-visible ${
          isContactTop || isHomeTop
            ? 'bg-olive border-b border-olive'
            : scrolled
              ? 'bg-sand/95 backdrop-blur-sm border-b border-ink/8'
              : 'bg-olive/95 backdrop-blur-sm border-b border-sand/15'
        }`}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo with drop animation */}
          <button onClick={() => handleNavClick('/')} className="flex items-center gap-2 group">
            <motion.div
              className="w-8 h-8 bg-tropical flex items-center justify-center"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 200, damping: 18 }}
            >
              <span className="font-serif text-sand text-sm font-semibold tracking-tight">NA</span>
            </motion.div>
            <span className="font-sans text-xs font-medium text-ink/50 tracking-widest uppercase hidden sm:block">
              Studio
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.path);
              const linkClass = `font-sans text-xs font-medium tracking-widest uppercase transition-colors duration-200 relative ${
                isActive ? 'text-tropical' : 'text-ink/60 hover:text-ink'
              }`;
              return (
                <button
                  key={navItemKey(item)}
                  type="button"
                  onClick={() => handleNavItemClick(item)}
                  className={linkClass}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-tropical"
                    />
                  )}
                </button>
              );
            })}

            <div className="relative">
              <button
                type="button"
                onClick={() => { setRoomsOpen((v) => !v); setLangOpen(false); setVolumeOpen(false); }}
                className={`font-sans text-xs font-medium tracking-widest uppercase transition-colors duration-200 relative flex items-center gap-1 ${
                  isRoomsActive ? 'text-tropical' : 'text-ink/60 hover:text-ink'
                }`}
                aria-expanded={roomsOpen}
                aria-haspopup="menu"
              >
                {t('nav_rooms')}
                <ChevronDown size={12} className={`transition-transform ${roomsOpen ? 'rotate-180' : ''}`} />
                {isRoomsActive && (
                  <motion.span
                    layoutId="nav-indicator-rooms"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-tropical"
                  />
                )}
              </button>
              <NaRoomsMenu open={roomsOpen} onClose={() => setRoomsOpen(false)} />
            </div>

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 font-sans text-xs font-medium text-olive/70 hover:text-olive transition-colors"
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
                    className="absolute top-full right-0 mt-2 bg-sand border border-ink/10 shadow-md py-1 min-w-[80px]"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 font-sans text-xs tracking-widest uppercase transition-colors ${
                          lang === l ? 'text-tropical font-medium' : 'text-ink/50 hover:text-ink'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={toggleVolumePanel}
                className={`p-1 rounded-sm transition-opacity duration-200 ${
                  volume > 0 ? 'text-olive hover:text-olive/85' : 'text-olive/50 hover:text-olive/70 opacity-90'
                }`}
                aria-label="Régler le volume d’ambiance"
                title="Régler le volume d’ambiance"
              >
                <Volume2 size={15} strokeWidth={1.85} />
              </button>
              <AnimatePresence>
                {volumeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full right-0 mt-2 z-[120] bg-sand border border-ink/10 shadow-md px-3 py-2 min-w-[130px]"
                  >
                    <label className="font-sans text-[10px] tracking-widest uppercase text-ink/45 block mb-2">Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={volume}
                      onChange={onVolumeChange}
                      className="w-full accent-olive"
                      aria-label="Volume ambience"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => setSandRainEnabled((v) => !v)}
              className={`p-1 rounded-sm transition-opacity duration-200 ${
                sandRainEnabled ? 'text-olive hover:text-olive/85' : 'text-olive/50 hover:text-olive/70 opacity-90'
              }`}
              aria-label={sandRainEnabled ? 'Désactiver les grains' : 'Activer les grains'}
              title={sandRainEnabled ? 'Désactiver les grains' : 'Activer les grains'}
            >
              <CloudRain size={15} strokeWidth={1.85} />
            </button>
          </nav>

          {/* Mobile: lang + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-olive/70"
            >
              <Globe size={13} />
              <span className="font-sans text-xs uppercase">{lang}</span>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={toggleVolumePanel}
                className={`p-1 rounded-sm transition-opacity ${
                  volume > 0 ? 'text-olive' : 'text-olive/55 opacity-90'
                }`}
                aria-label="Régler le volume d’ambiance"
              >
                <Volume2 size={15} strokeWidth={1.85} />
              </button>
              <AnimatePresence>
                {volumeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 bg-sand border border-ink/10 shadow-md px-3 py-2 min-w-[130px] z-[120]"
                  >
                    <label className="font-sans text-[10px] tracking-widest uppercase text-ink/45 block mb-2">Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={volume}
                      onChange={onVolumeChange}
                      className="w-full accent-olive"
                      aria-label="Volume ambience"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => setSandRainEnabled((v) => !v)}
              className={`p-1 rounded-sm transition-opacity ${
                sandRainEnabled ? 'text-olive' : 'text-olive/55 opacity-90'
              }`}
              aria-label={sandRainEnabled ? 'Désactiver les grains' : 'Activer les grains'}
            >
              <CloudRain size={15} strokeWidth={1.85} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-14 right-6 bg-sand border border-ink/10 shadow-md py-1 min-w-[80px] z-50"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 font-sans text-xs tracking-widest uppercase ${
                        lang === l ? 'text-tropical font-medium' : 'text-ink/50'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-1"
              aria-label="Menu"
            >
              <span className={`block h-px w-6 bg-ink transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-px w-6 bg-ink transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-6 bg-ink transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pt-16 flex flex-col bg-sand overflow-hidden"
          >
            <div className="absolute inset-0 top-16 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span
                className="font-serif font-light leading-none text-tropical/15"
                style={{ fontSize: 'min(72vw, 520px)', letterSpacing: '-0.06em' }}
              >
                N
              </span>
              <span
                className="font-serif font-light leading-none text-terracotta/12 -ml-[0.08em]"
                style={{ fontSize: 'min(72vw, 520px)', letterSpacing: '-0.06em' }}
              >
                A
              </span>
            </div>
            <div className="relative z-10 flex flex-col flex-1 justify-center px-10 pb-12">
              <nav className="flex flex-col gap-7">
                {navItems.map((item, i) => {
                  const isActive = isNavItemActive(item.path);
                  const mobileClass = `font-serif text-4xl sm:text-5xl font-light tracking-tight transition-colors text-left w-full ${
                    isActive ? 'text-tropical' : 'text-ink/85'
                  }`;
                  return (
                    <motion.div
                      key={navItemKey(item)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <button
                        type="button"
                        onClick={() => handleNavItemClick(item)}
                        className={mobileClass}
                      >
                        {item.label}
                      </button>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => setMobileRoomsOpen((v) => !v)}
                    className={`font-serif text-4xl sm:text-5xl font-light tracking-tight transition-colors text-left w-full flex items-center gap-3 ${
                      isRoomsActive ? 'text-tropical' : 'text-ink/85'
                    }`}
                  >
                    {t('nav_rooms')}
                    <ChevronDown size={22} className={`transition-transform ${mobileRoomsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileRoomsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pl-2 flex flex-col gap-4 border-l border-olive/20"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            window.open(NA_WEBSITES_URL, '_blank', 'noopener,noreferrer');
                            setMobileRoomsOpen(false);
                            setMenuOpen(false);
                          }}
                          className="text-left"
                        >
                          <span className="font-serif text-2xl text-ink/90 block">{t('rooms_websites_title')}</span>
                          <span className="font-sans text-xs text-ink/45 block mt-0.5">{t('rooms_websites_desc')}</span>
                          <span className="font-sans text-[10px] tracking-widest uppercase text-olive mt-1 block">{t('rooms_status_active')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            window.open(NA_RESEARCH_URL, '_blank', 'noopener,noreferrer');
                            setMobileRoomsOpen(false);
                            setMenuOpen(false);
                          }}
                          className="text-left"
                        >
                          <span className="font-serif text-2xl text-ink/90 block">{t('rooms_research_title')}</span>
                          <span className="font-sans text-xs text-ink/45 block mt-0.5">{t('rooms_research_desc')}</span>
                          <span className="font-sans text-[10px] tracking-widest uppercase text-olive mt-1 block">{t('rooms_status_active')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleNavClick('/classroom'); setMobileRoomsOpen(false); }}
                          className="text-left"
                        >
                          <span className="font-serif text-2xl text-ink/90 block">{t('rooms_classroom_title')}</span>
                          <span className="font-sans text-xs text-ink/45 block mt-0.5">{t('rooms_classroom_desc')}</span>
                          <span className="font-sans text-[10px] tracking-widest uppercase text-olive mt-1 block">{t('rooms_status_active')}</span>
                        </button>
                        <div
                          role="presentation"
                          aria-disabled="true"
                          title={t('rooms_status_unavailable')}
                          className="text-left cursor-not-allowed opacity-70"
                        >
                          <span className="font-serif text-2xl text-ink/40 block">{t('rooms_business_systems_title')}</span>
                          <span className="font-sans text-xs text-ink/30 block mt-0.5">{t('rooms_business_systems_desc')}</span>
                          <span className="font-sans text-[10px] tracking-widest uppercase text-ink/35 mt-1 inline-flex items-center gap-1">
                            <Lock size={11} strokeWidth={2} aria-hidden="true" />
                            {t('rooms_status_unavailable')}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </nav>
              <p className="eyebrow mt-14 text-ink/45 text-sm tracking-[0.2em]">nathanazoulay.pro@gmail.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}