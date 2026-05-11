import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

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
            { label: t('nav_path'), path: '/experience' },
            { label: t('nav_tools'), path: '/tools' },
            { label: t('nav_contact'), path: '/contact' },
          ].map((item) => (
            <Link key={item.path} to={item.path} className="font-sans text-xs tracking-widest uppercase text-quartz/40 hover:text-quartz/80 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="font-sans text-xs text-quartz/25">© 2026 NA Studio</p>
      </div>
    </footer>
  );
}