import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { useI18n } from '@/lib/i18n';

function postStudioLang(frame, lang) {
  const next = lang === 'fr' ? 'fr' : 'en';
  try {
    frame?.contentWindow?.postMessage({ type: 'na-studio-lang', lang: next }, '*');
  } catch {
    // ignore
  }
}

function studioPathToHash(pathname, search) {
  const rel = pathname.replace(/^\/classroom\/?/, '');
  const query = search || '';
  if (!rel) return `#/${query}`;
  return `#/${rel}${query}`;
}

function hashToStudioPath(path) {
  const raw = String(path || '/').replace(/^#/, '');
  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  if (normalized === '/' || normalized === '') return '/classroom';
  return `/classroom${normalized}`;
}

export default function ClassroomShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const iframeRef = useRef(null);
  const ignoreNextMessage = useRef(false);

  const hash = useMemo(
    () => studioPathToHash(location.pathname, location.search),
    [location.pathname, location.search],
  );
  const src = `/na-classroom/index.html${hash}`;

  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data;
      if (!data || data.type !== 'na-classroom-route') return;
      if (ignoreNextMessage.current) {
        ignoreNextMessage.current = false;
        return;
      }
      const next = hashToStudioPath(data.path);
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) navigate(next, { replace: true });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigate]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame || frame.dataset.ready !== '1') return;
    try {
      const win = frame.contentWindow;
      if (win && win.location.hash !== hash) {
        ignoreNextMessage.current = true;
        win.location.hash = hash;
      }
    } catch {
      // same-origin only
    }
  }, [hash]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame || frame.dataset.ready !== '1') return;
    postStudioLang(frame, lang);
  }, [lang]);

  return (
    <PageLayout showFooter={false} mainClassName="p-0">
      <div className="bg-[#080d0a] pt-16">
        <iframe
          ref={iframeRef}
          title="NA Classroom"
          src={src}
          className="block w-full border-0"
          style={{ height: 'calc(100vh - 4rem)', minHeight: '640px' }}
          onLoad={() => {
            if (iframeRef.current) {
              iframeRef.current.dataset.ready = '1';
              postStudioLang(iframeRef.current, lang);
            }
          }}
        />
      </div>
    </PageLayout>
  );
}
