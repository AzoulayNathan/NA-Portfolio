import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { useI18n } from '@/lib/i18n';

function buildHash(fieldId, searchParams) {
  if (!fieldId) return '#/expertise';
  if (fieldId === 'contact') {
    const q = searchParams.toString();
    return `#/contact${q ? `?${q}` : ''}`;
  }
  return `#/${fieldId}`;
}

export default function Expertise() {
  const { fieldId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const iframeRef = useRef(null);
  const ignoreNextMessage = useRef(false);

  const hash = useMemo(() => buildHash(fieldId, searchParams), [fieldId, searchParams]);
  const src = `/expertise/index.html${hash}`;

  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data;
      if (!data || data.type !== 'na-expertise-route') return;
      if (ignoreNextMessage.current) {
        ignoreNextMessage.current = false;
        return;
      }

      const path = data.path || 'expertise';
      const params = data.params || {};
      let next = '/expertise';
      if (path === 'contact') {
        const q = new URLSearchParams(params).toString();
        next = `/expertise/contact${q ? `?${q}` : ''}`;
      } else if (path !== 'expertise') {
        next = `/expertise/${path}`;
      }

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
    const next = lang === 'fr' ? 'fr' : 'en';
    try {
      frame.contentWindow?.postMessage({ type: 'na-studio-lang', lang: next }, '*');
    } catch {
      // ignore
    }
  }, [lang]);

  return (
    <PageLayout showFooter>
      <div className="bg-[#05080d] pt-16">
        <iframe
          ref={iframeRef}
          title="NA Studio Expertise"
          src={src}
          className="block w-full border-0"
          style={{ height: 'calc(100vh - 4rem)', minHeight: '640px' }}
          onLoad={() => {
            if (iframeRef.current) {
              iframeRef.current.dataset.ready = '1';
              const next = lang === 'fr' ? 'fr' : 'en';
              try {
                iframeRef.current.contentWindow?.postMessage({ type: 'na-studio-lang', lang: next }, '*');
              } catch {
                // ignore
              }
            }
          }}
        />
      </div>
    </PageLayout>
  );
}
