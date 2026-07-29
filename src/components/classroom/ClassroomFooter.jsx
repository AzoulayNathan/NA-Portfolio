import { useI18n } from '@/lib/i18n';
import { NA_WEBSITES_URL, NA_RESEARCH_URL, BOOKING_CALENDAR_URL } from '@/lib/externalLinks';

export default function ClassroomFooter({ t }) {
  const { t: tGlobal } = useI18n();

  const ecosystemLinks = [
    { label: tGlobal('rooms_studio_title'), href: '/' },
    { label: tGlobal('rooms_websites_title'), href: NA_WEBSITES_URL, external: true },
    { label: tGlobal('rooms_research_title'), href: NA_RESEARCH_URL, external: true },
    { label: tGlobal('contact_calendar_label'), href: BOOKING_CALENDAR_URL, external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/nathanazoulay', external: true },
  ];

  return (
    <footer className="py-10 bg-ink">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-sans text-[11px] text-white/28 text-center sm:text-left leading-relaxed">
          {t.footer.line}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
          {ecosystemLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="font-sans text-[11px] text-white/28 hover:text-white/55 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
