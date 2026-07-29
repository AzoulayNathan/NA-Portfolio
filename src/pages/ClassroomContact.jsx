import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowRight, Calendar, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import content from '@/lib/classroomContent';
import ContactButton from '@/components/ui/ContactButton';
import ClassroomHeader from '@/components/classroom/ClassroomHeader';
import { BOOKING_CALENDAR_URL } from '@/lib/externalLinks';

export default function ClassroomContact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftInView = useInView(leftRef, { once: true, margin: '-40px' });
  const rightInView = useInView(rightRef, { once: true, margin: '-40px' });
  const { lang, setLang } = useI18n();
  const page = content[lang] ?? content.en;
  const t = page.contactPage;

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${t.mailSubject} - ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    );
    window.location.href = `mailto:nathanazoulay.pro@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const links = [
    { icon: Mail, label: 'Email', value: 'nathanazoulay.pro@gmail.com', href: 'mailto:nathanazoulay.pro@gmail.com' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/nathan-azoulay-0719b4207', href: 'https://www.linkedin.com/in/nathan-azoulay-0719b4207' },
    { icon: Github, label: 'GitHub', value: 'github.com/AzoulayNathan', href: 'https://github.com/AzoulayNathan' },
    { icon: Calendar, label: t.calendarLabel, value: t.calendarValue, href: BOOKING_CALENDAR_URL },
  ];

  return (
    <div className="min-h-screen bg-quartz">
      <ClassroomHeader t={page} lang={lang} setLang={setLang} />
      <section className="bg-tropical pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto relative overflow-hidden min-h-[280px]">
          <motion.div
            className="absolute inset-y-0 right-[-4%] w-[62%] md:w-[46%] pointer-events-none z-0"
            animate={{ y: [0, -8, 0], scale: [1, 1.015, 1] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-[0.62]"
              style={{
                filter: 'saturate(0.72) brightness(0.9) contrast(1.06) hue-rotate(6deg)',
                objectPosition: '56% 14%',
              }}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
              poster="/we-visual.png"
            >
              <source src="/contact-right-loop.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-l from-[#3F5A4F]/48 via-[#3F5A4F]/24 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#3F5A4F]/22 via-transparent to-[#3F5A4F]/24" />
          </motion.div>
          <Link
            to="/classroom"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-sand/50 hover:text-sand mb-6 relative z-10 transition-colors"
          >
            <ArrowLeft size={14} />
            NA Classroom
          </Link>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow-light mb-5 relative z-10"
          >
            {t.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-serif text-[56px] md:text-[80px] font-light text-sand leading-tight max-w-2xl mb-6 relative z-10"
          >
            {t.heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="font-sans text-[15px] text-sand/55 leading-relaxed max-w-md relative z-10"
          >
            {t.body}
          </motion.p>
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -24 }}
            animate={leftInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="eyebrow mb-8">{t.find}</p>
            <div className="space-y-6">
              {links.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={leftInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.07 + 0.1 }}
                  >
                    {link.href ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 py-3 border-b border-ink/10 hover:border-olive transition-all"
                      >
                        <Icon size={16} className="text-olive mt-0.5 flex-shrink-0 group-hover:text-tropical transition-colors" />
                        <div>
                          <p className="font-sans text-[11px] tracking-widest uppercase text-ink/40 mb-0.5">{link.label}</p>
                          <p className="font-sans text-sm text-ink/70 group-hover:text-ink transition-colors break-all">{link.value}</p>
                        </div>
                        <ArrowRight size={12} className="ml-auto text-ink/20 group-hover:text-olive group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 py-3 border-b border-ink/10">
                        <Icon size={16} className="text-ink/30 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-sans text-[11px] tracking-widest uppercase text-ink/30 mb-0.5">{link.label}</p>
                          <p className="font-sans text-sm text-ink/35">{link.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, x: 24 }}
            animate={rightInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col justify-center py-12"
              >
                <div className="w-8 h-px bg-terracotta mb-6" />
                <h3 className="font-serif text-[36px] font-light text-ink mb-3">{t.sentH}</h3>
                <p className="font-sans text-sm text-ink/55">{t.sentP}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="eyebrow mb-6">{t.write}</p>
                <div>
                  <label htmlFor="classroom-name" className="font-sans text-[11px] tracking-widest uppercase text-ink/45 block mb-2">
                    {t.name}
                  </label>
                  <input
                    id="classroom-name"
                    type="text"
                    placeholder={t.namePh}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-ink/20 focus:border-olive outline-none py-2.5 font-sans text-sm text-ink placeholder-ink/30 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="classroom-email" className="font-sans text-[11px] tracking-widest uppercase text-ink/45 block mb-2">
                    {t.email}
                  </label>
                  <input
                    id="classroom-email"
                    type="email"
                    placeholder={t.emailPh}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-ink/20 focus:border-olive outline-none py-2.5 font-sans text-sm text-ink placeholder-ink/30 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="classroom-message" className="font-sans text-[11px] tracking-widest uppercase text-ink/45 block mb-2">
                    {t.message}
                  </label>
                  <textarea
                    id="classroom-message"
                    placeholder={t.messagePh}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full bg-transparent border-b border-ink/20 focus:border-olive outline-none py-2.5 font-sans text-sm text-ink placeholder-ink/30 transition-colors resize-none"
                  />
                </div>
                <div className="pt-4 flex flex-col items-center gap-4">
                  <ContactButton label={t.submit} isSubmit />
                  <a
                    href={BOOKING_CALENDAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-olive hover:text-tropical transition-colors"
                  >
                    <Calendar size={14} />
                    {t.calendarLabel}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
