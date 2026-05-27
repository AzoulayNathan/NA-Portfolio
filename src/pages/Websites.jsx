import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useI18n } from '@/lib/i18n';
import { NA_WEBSITES_URL } from '@/lib/externalLinks';

export default function Websites() {
  const { t } = useI18n();

  useEffect(() => {
    window.location.replace(NA_WEBSITES_URL);
  }, []);

  return (
    <PageLayout>
      <section className="min-h-[50vh] flex items-center bg-quartz px-6 md:px-10 py-32">
        <div className="max-w-2xl mx-auto w-full text-center md:text-left">
          <p className="eyebrow text-olive/70 mb-4">{t('websites_eyebrow')}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-ink tracking-tight mb-4">{t('websites_heading')}</h1>
          <p className="font-sans text-ink/70 leading-relaxed mb-8">{t('websites_body')}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href={NA_WEBSITES_URL}
              className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase bg-tropical text-quartz px-5 py-3 hover:bg-olive transition-colors"
            >
              {t('websites_cta_visit')}
              <ArrowRight size={14} />
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-tropical border border-tropical/30 px-5 py-3 hover:bg-tropical/5 transition-colors"
            >
              <ArrowLeft size={14} />
              {t('websites_cta_studio')}
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
