import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { useI18n } from '@/lib/i18n';
import content from '@/lib/classroomContent';
import ClassroomTeacherDesk from '@/components/classroom/ClassroomTeacherDesk';
import ClassroomPrinciples from '@/components/classroom/ClassroomPrinciples';
import ClassroomToolTable from '@/components/classroom/ClassroomToolTable';
import ClassroomSplitLab from '@/components/classroom/ClassroomSplitLab';
import NaHoverCircleButton from '@/components/ui/NaHoverCircleButton';

const HERO = '/na-classroom/assets/teaching-hero.png';

const POINT_ICONS = [
  <>
    <path d="M12 21c0-7 2-12 8-17-1 7-4 12-8 17ZM12 21c0-5-3-9-8-12 0 6 3 10 8 12Z" />
    <path d="M12 21V9" />
  </>,
  <>
    <path d="M6 2h8l4 4v16H6V2Z" />
    <path d="M14 2v5h5M9 12h6M9 16h6" />
  </>,
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="m14 10 6-6M17 4h3v3" />
  </>,
];

function PointIcon({ children }) {
  return (
    <span className="w-10 h-10 rounded-full bg-[rgba(31,91,61,0.07)] shrink-0 flex items-center justify-center text-[#1f5b3d]">
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {children}
      </svg>
    </span>
  );
}

export default function TeachingHybrid() {
  const { lang } = useI18n();
  const t = content[lang] ?? content.en;
  const h = t.teachingHero || content.en.teachingHero;
  const cta = t.cta || content.en.cta;

  return (
    <PageLayout showFooter={false} mainClassName="p-0">
      <div className="bg-[#f7f3eb] pt-16">
        <section className="relative min-h-[500px] overflow-hidden grid lg:grid-cols-[56%_44%] border-b border-ink/10">
          <div
            className="relative z-10 flex flex-col justify-center items-start px-6 sm:px-10 lg:pl-20 lg:pr-10 py-14 lg:py-16"
            style={{ background: 'linear-gradient(120deg, #f7f3eb 0 55%, #eee7dc)' }}
          >
            <p className="font-sans text-[13px] font-bold tracking-[0.22em] uppercase text-[#153b29]">{h.eyebrow}</p>
            <h1 className="font-serif font-normal tracking-tight text-[#17251e] mt-5 mb-5 leading-[0.95] text-[clamp(3.2rem,6.5vw,6.1rem)]">
              {h.title}
            </h1>
            <p className="font-sans text-xl leading-relaxed max-w-[630px] text-[#2f3b34]">{h.subtitle}</p>
            <div className="flex flex-wrap gap-8 mt-7 mb-8">
              {h.points.map((point, i) => (
                <span key={point} className="flex items-center gap-2.5 text-[13px] text-[#2f3b34]">
                  <PointIcon>{POINT_ICONS[i]}</PointIcon>
                  {point}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/classroom/book-a-lesson"
                className="inline-flex items-center gap-7 px-[22px] py-3.5 rounded-[11px] text-white text-sm"
                style={{ background: 'linear-gradient(165deg, #347a52, #255a3c)' }}
              >
                {h.book} <b className="font-normal opacity-90">→</b>
              </Link>
              <Link
                to="/classroom/learn"
                className="inline-flex items-center gap-7 px-[22px] py-3.5 rounded-[11px] text-sm text-[#153b29] border border-[#255a3c]/25 hover:bg-[#255a3c] hover:text-white transition-colors"
              >
                {h.learn} <b className="font-normal opacity-90">→</b>
              </Link>
            </div>
          </div>
          <div className="relative min-h-[390px] lg:min-h-[500px]">
            <img
              src={HERO}
              alt={h.photoAlt}
              className="absolute inset-0 w-full h-full object-cover object-[center_12%]"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, #f7f3eb 0%, transparent 18%), linear-gradient(0deg, rgba(247,243,235,.15), transparent 35%)' }}
            />
          </div>
        </section>

        <ClassroomTeacherDesk t={t} />
        <ClassroomPrinciples t={t} />
        <ClassroomToolTable t={t} />
        <ClassroomSplitLab t={t} />

        <section className="py-24 bg-deep-green relative overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" aria-hidden />
          <div className="max-w-xl mx-auto px-6 text-center relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-quartz mb-5">{cta.title}</h2>
            <p className="font-sans text-sm text-white/55 leading-relaxed mb-10">{cta.body}</p>
            <div className="flex items-center justify-center">
              <NaHoverCircleButton label={cta.book} to="/classroom/book-a-lesson" size="lg" variant="olive" />
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
