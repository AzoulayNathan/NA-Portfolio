import { createBookALesson } from './booking.js';
import { EMBEDDED, ASSET_BASE, currentSearch, pathParts, setClassroomLocation } from './embed.js';
import { t, initLang, getLang } from './i18n.js';

const app = document.querySelector('#app');
let store = { pillars: [] };
let activePillar = 'data-analysis';
let activeLesson = 0;
if (EMBEDDED) document.documentElement.classList.add('is-embedded');
const iconPaths = {
  leaf: '<path d="M12 21c0-7 2-12 8-17-1 7-4 12-8 17ZM12 21c0-5-3-9-8-12 0 6 3 10 8 12Z"/><path d="M12 21V9"/>',
  crystal: '<path d="m12 2 5 4 3 6-4 8H8l-4-8 3-6 5-4Z"/><path d="m7 6 5 6 5-6M4 12h16M8 20l4-8 4 8"/>',
  vase: '<path d="M9 3h6M10 3v4c0 2-4 3-4 8 0 4 3 6 6 6s6-2 6-6c0-5-4-6-4-8V3"/><path d="M7 14h10M8 18h8"/>',
  brass: '<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/>',
  olive: '<path d="M12 22V8M12 10c-4 0-6-2-6-5 4 0 6 2 6 5ZM12 15c4 0 6-2 6-5-4 0-6 2-6 5ZM12 20c-4 0-6-2-6-5 4 0 6 2 6 5Z"/>',
  coral: '<path d="M12 22v-9M12 15 7 10M12 12l4-4M8 11V6M16 8V3M7 10H3M16 8h4M12 13l-3 3M12 18l4-4"/>',
  quartz: '<path d="M4 8 8 3h8l4 5-3 10-5 3-5-3L4 8Z"/><path d="m8 3 4 9 4-9M4 8l8 4 8-4M7 18l5-6 5 6"/>',
  book: '<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v16H5.5A2.5 2.5 0 0 0 3 21V5.5ZM21 5.5A2.5 2.5 0 0 0 18.5 3H13v16h5.5A2.5 2.5 0 0 1 21 21V5.5Z"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m14 10 6-6M17 4h3v3"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.6 2c-1 .6-1.4 1.1-1.4 2M12 17h.01"/>',
  database: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  bulb: '<path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.8-1.5 1.6-1.7 2.5h-3.6c-.2-.9-.8-1.7-1.7-2.5Z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
  pencil: '<path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20ZM14 6l3.5 3.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  message: '<path d="M21 12a8 8 0 0 1-8 8H6l-4 2 1.5-5A8 8 0 1 1 21 12Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9Z"/>',
  file: '<path d="M6 2h8l4 4v16H6V2Z"/><path d="M14 2v5h5M9 12h6M9 16h6"/>'
};
function icon(name, cls='icon') { return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.book}</svg>`; }
function esc(s=''){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function pillarById(id){ return store.pillars.find(p=>p.id===id) || store.pillars[0]; }
function navigate(url, opts={}){
  const before = EMBEDDED ? location.hash : location.href;
  setClassroomLocation(url, opts);
  const after = EMBEDDED ? location.hash : location.href;
  if (!EMBEDDED || opts.replace || before === after) route();
  window.scrollTo({top:0,left:0,behavior:'instant'});
}
function pName(p){ return t(`pillars.${p.id}.name`) || p.name; }
function pIntro(p){ return t(`pillars.${p.id}.intro`) || p.intro; }
function pStages(p){ const s=t(`pillars.${p.id}.stages`); return Array.isArray(s)?s:p.stages; }
function lessonName(l){ return getLang()==='fr' ? l.title : l.short; }
function nav(active=''){
  return `<header class="topbar"><a class="brand" href="/classroom" data-nav><span>NA</span><i>/</i><b>CLASSROOM</b></a><nav><a href="/classroom/learn" data-nav class="${active==='learn'?'active':''}">${esc(t('nav.learn'))}</a><a href="/classroom/teaching" data-nav class="${active==='teaching'?'active':''}">${esc(t('nav.teaching'))}</a><a href="/classroom/book-a-lesson" data-nav class="nav-cta ${active==='booking'?'active':''}">${esc(t('nav.book'))}</a></nav></header>`;
}
function applyTheme(p){
  const root=document.documentElement;
  root.style.setProperty('--accent',p?.accent || '#1f5b3d');
  root.style.setProperty('--accent-soft',p?.accentSoft || '#7f9a72');
  root.style.setProperty('--pillar-ink',p?.ink || '#153b29');
  root.style.setProperty('--pillar-surface',p?.surface || '#f4f2ea');
  document.body.dataset.pillar=p?.id || 'data-analysis';
}
function route(){
  const parts=pathParts();
  if(!parts.length) return renderEntry();
  if(parts[0]==='learn' && parts[1]) return renderPillarPage(parts[1]);
  if(parts[0]==='learn') return renderLearn();
  if(parts[0]==='teaching') return renderTeaching();
  if(parts[0]==='booking' || parts[0]==='book-a-lesson') return renderBooking();
  renderEntry();
}
function wireNav(){}

function renderEntry(){
  document.body.className='page-entry';
  applyTheme(store.pillars[0]);
  app.innerHTML=`<main class="entry-screen">
    <a class="entry-brand" href="/classroom" data-nav><span>NA</span><i>/</i><b>CLASSROOM</b></a>
    <div class="entry-heading"><h1>${esc(t('entry.title'))}</h1><p>${esc(t('entry.sub'))}</p></div>
    <a href="/classroom/learn" data-nav class="entry-choice entry-learn">
      <div class="entry-art learn-art"></div><div class="entry-choice-copy"><span class="eyebrow">${esc(t('entry.learnEyebrow'))}</span><h2>${esc(t('entry.learnTitle'))}</h2><p>${esc(t('entry.learnBody')).replace(/\n/g,'<br>')}</p><span class="outline-action green">${esc(t('entry.learnCta'))} <b>→</b></span></div>
    </a>
    <a href="/classroom/teaching" data-nav class="entry-choice entry-teach">
      <div class="entry-art teach-art"></div><div class="entry-choice-copy"><span class="eyebrow warm">${esc(t('entry.teachEyebrow'))}</span><h2>${esc(t('entry.teachTitle'))}</h2><p>${esc(t('entry.teachBody')).replace(/\n/g,'<br>')}</p><span class="outline-action pottery">${esc(t('entry.teachCta'))} <b>→</b></span></div>
    </a>
  </main>`;
  wireNav();
}

function pillarSidebar(){
  return `<aside class="pillar-rail" aria-label="${esc(t('learn.pillar'))}">${store.pillars.map(p=>`<button class="rail-item ${p.id===activePillar?'active':''}" data-target="${p.id}" style="--rail:${p.accent}"><span class="rail-number">${p.number}</span><span class="rail-icon">${icon(p.motif,'mini-icon')}</span><span class="rail-name">${esc(pName(p))}</span></button>`).join('')}</aside>`;
}
function lessonThumb(i,p){ const fixed=['/assets/lesson-1.webp','/assets/lesson-2.webp','/assets/lesson-3.webp','/assets/lesson-4.webp']; return ASSET_BASE+fixed[i%4]; }
function stageDots(p){ return pStages(p).map((s,i)=>`<div class="road-stage ${i===0?'active':''}"><span>${i+1}</span><b>${esc(s)}</b></div>`).join(''); }
function lessonCards(p){ return p.lessons.slice(0,4).map((l,i)=>`<button class="lesson-card" data-open-pillar="${p.id}" data-week="${l.week}"><img src="${lessonThumb(i,p)}" alt=""/><div class="lesson-card-copy"><small>${String(l.week).padStart(2,'0')}</small><h3>${esc(lessonName(l))}</h3><div class="lesson-meta">${icon('clock','tiny-icon')} ${l.duration}<span>·</span>${l.level}</div></div></button>`).join(''); }
function pillarSlide(p,index){
  return `<section class="pillar-slide" id="${p.id}" data-pillar-section="${p.id}" style="--accent:${p.accent};--accent-soft:${p.accentSoft};--pillar-ink:${p.ink};--pillar-surface:${p.surface}">
    <div class="pillar-hero">
      <div class="pillar-copy"><div class="eyebrow dark">${esc(t('learn.pillar'))} ${p.number}</div><h1>${esc(pName(p))}</h1><p class="pillar-intro">${esc(pIntro(p))}</p><p class="pillar-note">${esc(t('learn.note'))}</p><a href="/classroom/learn/${p.id}" data-nav class="solid-action" style="--button:${p.ink}">${esc(t('learn.open'))} <b>→</b></a></div>
      <div class="pillar-visual ${p.id}"><div class="pillar-visual-image"></div><div class="visual-wash"></div><div class="milestone-path">${pStages(p).slice(0,5).map((s,i)=>`<span class="milestone m${i+1}" title="${esc(s)}">${i===0?icon('chart','milestone-icon'):i===1?icon('search','milestone-icon'):i===2?icon('chart','milestone-icon'):i===3?icon('target','milestone-icon'):icon('file','milestone-icon')}</span>`).join('')}</div></div>
    </div>
    <div class="pillar-roadmap"><div class="section-label">${esc(t('learn.pillar'))} ${p.number} ${esc(t('learn.roadmap'))}</div><div class="stage-line">${stageDots(p)}</div><div class="section-label lessons-label">${esc(t('learn.lessons'))}</div><div class="lesson-preview">${lessonCards(p)}<a href="/classroom/learn/${p.id}" data-nav class="round-more">→</a></div></div>
  </section>`;
}
function renderLearn(){
  document.body.className='page-learn'; activePillar=activePillar||store.pillars[0].id; applyTheme(pillarById(activePillar));
  app.innerHTML=`${nav('learn')}<main class="learn-shell">${pillarSidebar()}<div class="pillar-feed">${store.pillars.map(pillarSlide).join('')}</div></main>`;
  wireNav();
  const railItems=[...document.querySelectorAll('.rail-item')];
  railItems.forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'})));
  document.querySelectorAll('[data-open-pillar]').forEach(btn=>btn.addEventListener('click',()=>navigate(`/classroom/learn/${btn.dataset.openPillar}?week=${btn.dataset.week}`)));
  const observer=new IntersectionObserver(entries=>{
    const best=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!best)return;
    activePillar=best.target.dataset.pillarSection; const p=pillarById(activePillar); applyTheme(p);
    railItems.forEach(x=>x.classList.toggle('active',x.dataset.target===activePillar));
  },{threshold:[.42,.58,.72]});
  document.querySelectorAll('[data-pillar-section]').forEach(s=>observer.observe(s));
}

function lessonFlow(p){
  const icons={
    'data-analysis':['question','database','chart','bulb','check'],
    'data-science':['question','database','chart','target','check'],
    'business-analysis':['question','people','file','chart','check'],
    'ai-automation':['question','file','brass','target','check']
  };
  const copy=t(`flow.${p.id}`);
  const fallback=t('flow.data-analysis');
  const pairs=Array.isArray(copy)?copy:(Array.isArray(fallback)?fallback:[]);
  const ics=icons[p.id]||icons['data-analysis'];
  return pairs.map((pair,i)=>[ics[i], pair[0], pair[1]]);
}
function courseSections(p,l){
  const idea = p.id==='data-analysis' ? t('learn.ideaDa') : t('learn.ideaOther', { name: pName(p) });
  return `<section class="course-section"><div class="course-section-icon">${icon('bulb')}</div><div><h2>${esc(t('learn.idea'))}</h2><p>${esc(idea)}</p></div></section>
  <section class="course-section"><div class="course-section-icon">${icon('target')}</div><div><h2>${esc(t('learn.learnH'))}</h2><ul><li>${esc(t('learn.l1'))}</li><li>${esc(t('learn.l2'))}</li><li>${esc(t('learn.l3'))}</li></ul></div></section>
  <section class="course-section"><div class="course-section-icon">${icon('pencil')}</div><div><h2>${esc(t('learn.practice'))}</h2><p><strong>${esc(t('learn.exercise'))}</strong> ${esc(l.practice)}</p></div></section>
  <section class="course-section"><div class="course-section-icon">${icon('book')}</div><div><h2>${esc(t('learn.source'))}</h2><p>${esc(l.source)}</p></div></section>
  <section class="course-section"><div class="course-section-icon">${icon('target')}</div><div><h2>${esc(t('learn.challenge'))}</h2><p>${esc(t('learn.challengeP'))}</p></div></section>`;
}
function renderPillarPage(id){
  const p=pillarById(id); activePillar=p.id; applyTheme(p); document.body.className='page-course';
  const params=new URLSearchParams(currentSearch()); activeLesson=Math.max(0,Math.min(p.lessons.length-1,Number(params.get('week')||1)-1)); const l=p.lessons[activeLesson];
  const lead=p.id==='data-analysis'?t('learn.leadDa'):(getLang()==='fr'?l.title:l.short);
  app.innerHTML=`${nav('learn')}<main class="course-layout">
    <aside class="course-roadmap"><a href="/classroom/learn" data-nav class="back-link">← &nbsp; ${esc(pName(p))}</a><div class="roadmap-title">${esc(pName(p))} ${esc(t('learn.roadmap'))}</div><div class="lesson-steps">${p.lessons.map((x,i)=>`<button data-lesson="${i}" class="lesson-step ${i===activeLesson?'active':''}"><span>${i+1}</span><div><b>${esc(lessonName(x))}</b><small>${esc(t('learn.week'))} ${String(x.week).padStart(2,'0')}</small></div></button>`).join('')}</div><div class="roadmap-mini"><div class="roadmap-mini-icon">${icon(p.motif)}</div><p>${esc(t('learn.mini'))}</p></div></aside>
    <section class="course-content"><div class="course-kicker">${esc(pName(p).toUpperCase())} &nbsp;·&nbsp; ${esc(t('learn.week'))} ${String(l.week).padStart(2,'0')}</div><h1>${esc(lessonName(l))}</h1><p class="course-lead">${esc(lead)}</p><div class="course-meta">${icon('clock','meta-icon')} ${l.duration}<span></span>${icon('chart','meta-icon')} ${l.level}<span></span>${icon('book','meta-icon')} ${esc(t('learn.partOf'))} ${esc(pName(p))}<span></span><a href="/classroom/book-a-lesson?pillar=${p.id}&week=${String(l.week).padStart(2,'0')}&lesson=${encodeURIComponent(l.id)}" data-nav>${esc(t('nav.book'))}</a></div>${courseSections(p,l)}</section>
    <aside class="flow-panel"><div class="flow-heading">${esc(t('learn.flow', { name: pName(p).toUpperCase() }))}</div>${lessonFlow(p).map(([ic,title,txt])=>`<div class="flow-node"><span>${icon(ic,'flow-icon')}</span><div><h3>${esc(title)}</h3><p>${esc(txt)}</p></div></div>`).join('')}<div class="flow-wave"></div></aside>
    <footer class="course-bottom"><button id="prevLesson" ${activeLesson===0?'disabled':''}>← <span>${esc(t('learn.previous'))}<br><b>${activeLesson>0?esc(lessonName(p.lessons[activeLesson-1])):esc(t('learn.started'))}</b></span></button><div class="course-progress">${p.lessons.map((_,i)=>`<i class="${i===activeLesson?'active':''}"></i>`).join('')}</div><button id="nextLesson" ${activeLesson===p.lessons.length-1?'disabled':''}><span>${esc(t('learn.next'))}<br><b>${activeLesson<p.lessons.length-1?esc(lessonName(p.lessons[activeLesson+1])):esc(t('learn.end'))}</b></span> →</button></footer>
  </main>`;
  wireNav();
  document.querySelectorAll('[data-lesson]').forEach(b=>b.addEventListener('click',()=>{activeLesson=Number(b.dataset.lesson);navigate(`/classroom/learn/${p.id}?week=${activeLesson+1}`,{replace:true});}));
  document.querySelector('#prevLesson')?.addEventListener('click',()=>{if(activeLesson>0) navigate(`/classroom/learn/${p.id}?week=${activeLesson}`,{replace:true});});
  document.querySelector('#nextLesson')?.addEventListener('click',()=>{if(activeLesson<p.lessons.length-1) navigate(`/classroom/learn/${p.id}?week=${activeLesson+2}`,{replace:true});});
}

function renderTeaching(){
  document.body.className='page-teaching'; applyTheme(store.pillars[0]);
  app.innerHTML=`${nav('teaching')}<main class="teaching-page">
    <section class="teaching-hero"><div class="teaching-copy"><div class="eyebrow dark">${esc(t('teach.eyebrow'))}</div><h1>${esc(t('teach.title'))}</h1><p>${esc(t('teach.sub'))}</p><div class="teaching-points"><span>${icon('leaf','point-icon')}${esc(t('teach.p1'))}</span><span>${icon('file','point-icon')}${esc(t('teach.p2'))}</span><span>${icon('target','point-icon')}${esc(t('teach.p3'))}</span></div><div class="teaching-hero-ctas"><a href="/classroom/book-a-lesson" data-nav class="solid-action teaching-action">${esc(t('nav.book'))} <b>→</b></a><a href="/classroom/learn" data-nav class="pottery-action">${esc(t('nav.enter'))} <b>→</b></a></div></div><div class="teaching-photo"><img src="${ASSET_BASE}/assets/teaching-hero.png" alt="${esc(t('teach.photoAlt'))}"/><div class="teaching-photo-fade"></div></div></section>
    <section class="teaching-details"><article><div class="detail-heading">${icon('leaf')}<h2>${esc(t('teach.approach'))}</h2></div><div class="approach-line">${[['search','teach.a1t','teach.a1d'],['message','teach.a2t','teach.a2d'],['pencil','teach.a3t','teach.a3d'],['check','teach.a4t','teach.a4d']].map(([ic,tk,dk])=>`<div class="approach-step"><span>${icon(ic)}</span><b>${esc(t(tk))}</b><small>${esc(t(dk))}</small></div>`).join('')}</div></article><article><div class="detail-heading">${icon('book')}<h2>${esc(t('teach.subjects'))}</h2></div><ul class="subjects">${(Array.isArray(t('teach.subjectList'))?t('teach.subjectList'):[]).map((s)=>`<li>${esc(s)}</li>`).join('')}</ul></article><article><div class="detail-heading">${icon('people')}<h2>${esc(t('teach.experience'))}</h2></div><div class="experience"><p>${icon('people')}<span>${esc(t('teach.e1'))}</span></p><p>${icon('globe')}<span>${esc(t('teach.e2'))}</span></p><p>${icon('message')}<span>${esc(t('teach.e3'))}</span></p></div></article></section>
    <section class="teaching-cta teaching-cta-dual">
      <div class="na-seal">NA</div>
      <div><h2>${esc(t('teach.ctaTitle'))}</h2><p>${esc(t('teach.ctaBody'))}</p></div>
      <div class="teaching-cta-actions">
        <a href="/classroom/learn" data-nav class="solid-action teaching-action">${esc(t('nav.enter'))} <b>→</b></a>
        <a href="/classroom/book-a-lesson" data-nav class="pottery-action">${esc(t('nav.book'))} <b>→</b></a>
      </div>
    </section>
  </main>`;
  wireNav();
}

function renderBooking(){
  applyTheme(store.pillars[0]);
  createBookALesson({
    app,
    nav,
    icon,
    pillars: store.pillars,
    navigate
  });
}

async function init(){
  initLang();
  store=await fetch(`${ASSET_BASE}/data/structure.json`).then(r=>r.json());
  window.addEventListener('popstate',route);
  if (EMBEDDED) window.addEventListener('hashchange',route);
  window.addEventListener('na:lang',route);
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[data-nav]'); if(!a)return; e.preventDefault(); navigate(a.getAttribute('href'));
  });
  if (EMBEDDED) {
    const relay=()=>{
      try {
        const y=window.scrollY||document.documentElement.scrollTop||0;
        window.parent.postMessage({ type:'na-classroom-scroll', y }, '*');
      } catch {}
    };
    window.addEventListener('scroll',relay,{passive:true});
    relay();
  }
  route();
}
init();
