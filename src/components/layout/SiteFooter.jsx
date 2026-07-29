import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { NA_WEBSITES_URL, NA_RESEARCH_URL } from '@/lib/externalLinks';

export default function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-ink text-quartz/60 py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-olive flex items-center justify-center">
            <span className="font-serif text-sand text-xs font-semibold">NA</span>
          </div>
          <span className="font-sans text-xs tracking-widest uppercase text-quartz/40">Nathan Azoulay</span>
        </div>

        <nav className="flex flex-wrap gap-6">
          {[
            { label: t('nav_home'), path: '/' },
            { label: t('nav_projects'), path: '/projects' },
            { label: t('nav_expertise'), path: '/expertise' },
            { label: t('nav_path'), path: '/experience' },
            { label: t('nav_tools'), path: '/tools' },
            { label: t('rooms_websites_title'), href: NA_WEBSITES_URL, external: true },
            { label: t('rooms_research_title'), href: NA_RESEARCH_URL, external: true },
            { label: t('rooms_classroom_title'), path: '/classroom' },
            { label: t('rooms_business_systems_title'), disabled: true },
            { label: t('nav_contact'), path: '/contact' },
          ].map((item) =>
            item.disabled ? (
              <span
                key={item.label}
                title={t('rooms_status_unavailable')}
                className="font-sans text-xs tracking-widest uppercase text-quartz/25 inline-flex items-center gap-1.5 cursor-not-allowed"
              >
                <Lock size={10} strokeWidth={2} aria-hidden="true" />
                {item.label}
              </span>
            ) : item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs tracking-widest uppercase text-quartz/40 hover:text-quartz/80 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className="font-sans text-xs tracking-widest uppercase text-quartz/40 hover:text-quartz/80 transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <p className="font-sans text-xs text-quartz/25">© 2026 NA Studio</p>
      </div>
    </footer>
  );
}
