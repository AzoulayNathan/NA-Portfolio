export const EMBEDDED = location.pathname.includes('/na-classroom');
export const ASSET_BASE = EMBEDDED ? '/na-classroom' : '';

export function currentSearch() {
  if (EMBEDDED) {
    const hash = location.hash.replace(/^#/, '');
    const i = hash.indexOf('?');
    return i >= 0 ? hash.slice(i) : '';
  }
  return location.search;
}

export function pathParts() {
  const raw = EMBEDDED
    ? (location.hash.replace(/^#/, '').split('?')[0] || '/')
    : location.pathname.replace(/^\/classroom\/?/, '');
  return raw.replace(/^\/+/, '').split('/').filter(Boolean);
}

export function classroomUrl(url) {
  if (!url) return '/classroom';
  if (url.startsWith('/classroom')) return url;
  return `/classroom${url.startsWith('/') ? url : `/${url}`}`;
}

export function toHash(url) {
  const rel = classroomUrl(url).replace(/^\/classroom/, '') || '/';
  return rel.startsWith('/') ? rel : `/${rel}`;
}

export function setClassroomLocation(url, { replace = false } = {}) {
  const full = classroomUrl(url);
  if (EMBEDDED) {
    const hash = toHash(full);
    const next = `#${hash}`;
    if (replace) history.replaceState({}, '', `${location.pathname}${location.search}${next}`);
    else if (location.hash !== next) location.hash = hash;
    try {
      window.parent.postMessage({ type: 'na-classroom-route', path: hash }, '*');
    } catch {
      // ignore
    }
    return;
  }
  if (replace) history.replaceState({}, '', full);
  else history.pushState({}, '', full);
}
