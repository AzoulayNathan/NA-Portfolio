(function(){
  'use strict';
  const DATA=window.NA_DATA;
  const DATA_FR=window.NA_DATA_FR||{profile:{},fields:{}};
  const CONFIG=window.NA_CONFIG;
  const VIS=window.NA_VISUALS;
  const I18N=window.NA_I18N;
  const app=document.getElementById('app');
  const transition=document.getElementById('route-transition');
  let lang=(localStorage.getItem('na-expertise-lang')||'en').toLowerCase();
  if(!['en','fr'].includes(lang)) lang='en';
  let lastRoute='expertise';
  let contactIntent='hire';
  let cvLang=lang;

  const esc=(s='')=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const t=(key)=> (I18N[lang]&&I18N[lang][key]) || (I18N.en&&I18N.en[key]) || key;

  function localizedField(base){
    if(!base) return base;
    if(lang!=='fr') return base;
    const fr=DATA_FR.fields[base.id];
    if(!fr) return base;
    return Object.assign({}, base, fr);
  }

  function localizedProfile(){
    if(lang!=='fr') return DATA.profile;
    return Object.assign({}, DATA.profile, DATA_FR.profile||{});
  }

  function fieldsList(){
    return DATA.fields.map(localizedField);
  }

  function fieldById(id){
    const base=DATA.fields.find(f=>f.id===id);
    return localizedField(base);
  }

  function cvPath(fieldId, language){
    const base=(CONFIG.cvBase||'documents/cv').replace(/\/$/,'');
    return `${base}/${fieldId}_${language}.pdf`;
  }

  function setLang(next){
    if(!['en','fr'].includes(next) || next===lang) return;
    lang=next;
    cvLang=next;
    localStorage.setItem('na-expertise-lang', lang);
    document.documentElement.lang=lang;
    try{
      if(window.parent && window.parent!==window){
        window.parent.postMessage({ type:'na-expertise-lang', lang }, '*');
      }
    }catch(e){}
    render();
  }

  function langSwitcher(){
    return `<div class="expertise-lang" role="group" aria-label="${esc(t('lang_label'))}">
      <button type="button" data-set-lang="en" class="${lang==='en'?'active':''}">EN</button>
      <button type="button" data-set-lang="fr" class="${lang==='fr'?'active':''}">FR</button>
    </div>`;
  }

  const icon=(name='arrow')=>{
    const paths={
      arrow:'M5 12h14m-6-6 6 6-6 6', back:'M19 12H5m6 6-6-6 6-6', menu:'M4 7h16M4 12h16M4 17h16',
      close:'M6 6l12 12M18 6 6 18', user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 9a7 7 0 0 0-14 0',
      brief:'M4 7h16v13H4zM9 7V4h6v3M4 12h16', download:'M12 3v12m-5-5 5 5 5-5M5 20h14',
      mail:'M3 5h18v14H3zM3 6l9 7 9-7', link:'M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2',
      grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', pin:'M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
      chevron:'m9 18 6-6-6-6', copy:'M8 8h11v11H8zM5 16H4V5h11v1', check:'m5 12 4 4L19 6',
      spark:'M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z', globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3ZM3 12h18'
    };
    return `<svg class="icon icon-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.arrow}"/></svg>`;
  };

  const fieldIcon=(field)=>{
    const map={
      'ai-automation':'M4 8h16v10H4zM8 4v4m8-4v4M8 13h.01M12 13h.01M16 13h.01',
      'business-strategy':'M5 19V9m7 10V5m7 14v-7M3 19h18M6 7l5-4 5 3 5-4',
      'data-analytics':'M4 19V9m5 10V5m5 14v-7m5 7V3M3 19h18',
      'data-science':'M7 4h10M9 4v5l-5 8a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-8V4M8 14h8',
      'finance-risk':'M4 20h16M6 17V8l6-4 6 4v9M9 10h6m-6 3h6',
      'marketing-growth':'M4 18V6m0 12h16M7 15l4-4 3 2 5-7M16 6h3v3',
      'operations-pmo':'M5 6h4v4H5zM15 6h4v4h-4zM10 16h4v4h-4zM9 8h6M7 10v4h5m5-4v4h-5'
    };
    return `<svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${map[field.id]}"/></svg>`;
  };

  function parseHash(){
    const raw=(location.hash||'#/expertise').replace(/^#\/?/,'');
    const [path,query='']=raw.split('?');
    return {path:path||'expertise', params:new URLSearchParams(query)};
  }

  function routeHref(path,params={}){
    const q=new URLSearchParams(params).toString();
    return `#/${path}${q?'?'+q:''}`;
  }

  function navTo(path,params={},sourceEl=null){
    const current=parseHash().path;
    const next=path;
    if(current===next && !Object.keys(params).length) return;
    const currentIsHub=current==='expertise';
    const nextIsHub=next==='expertise';
    const direction=currentIsHub&&!nextIsHub?'forward':(!currentIsHub&&nextIsHub?'reverse':'cross');
    const field=fieldById(next)||fieldById(current);
    transition.style.setProperty('--transition-accent',field?.accent||'#b9aa58');
    transition.className=`route-transition is-active is-${direction}`;
    document.body.dataset.navDirection=direction;
    if(sourceEl){
      const r=sourceEl.getBoundingClientRect();
      transition.style.setProperty('--origin-y',`${r.top+r.height/2}px`);
    }
    window.setTimeout(()=>{ location.hash=routeHref(path,params); },240);
  }

  function topNav(){ return ''; }

  function hub(){
    const fields=fieldsList();
    document.title='NA Studio — Expertise';
    document.body.dataset.page='hub';
    document.documentElement.style.setProperty('--page-accent','#8d8a54');
    const extras=CONFIG.extraCvs||[];
    return `<div class="page-shell page-shell--hub">
      ${topNav({dark:false})}
      <main class="expertise-hub">
        <div class="hub-living-bg" aria-hidden="true">
          <div class="hub-ribbon hub-ribbon--one"></div><div class="hub-ribbon hub-ribbon--two"></div>
          ${Array.from({length:28},(_,i)=>`<i style="--x:${(i*37)%96}%;--y:${(i*61)%92}%;--d:${2+i%7}s;--s:${2+i%4}px"></i>`).join('')}
        </div>
        <div class="hub-toolbar">${langSwitcher()}</div>
        <section class="hub-intro">
          <div class="hub-copy">
            <span class="section-kicker">${esc(t('hub_kicker'))}</span>
            <h1>${esc(t('hub_title_1'))}<br><em>${esc(t('hub_title_2'))}</em></h1>
            <p>${esc(t('hub_intro'))}</p>
            <div class="hub-intents">
              <button data-contact-intent="hire">${icon('user')}<span><b>${esc(t('hub_hire'))}</b><small>${esc(t('hub_hire_sub'))}</small></span>${icon('arrow')}</button>
              <button data-contact-intent="freelance">${icon('brief')}<span><b>${esc(t('hub_freelance'))}</b><small>${esc(t('hub_freelance_sub'))}</small></span>${icon('arrow')}</button>
            </div>
          </div>
          <div class="hub-sculpture" aria-hidden="true">
            <div class="hub-orbit orbit-1"></div><div class="hub-orbit orbit-2"></div><div class="hub-orbit orbit-3"></div>
            <div class="hub-form form-a"></div><div class="hub-form form-b"></div><div class="hub-form form-c"></div>
            <div class="hub-light"></div>
          </div>
        </section>
        <section class="hub-fields" aria-label="${esc(t('hub_fields_aria'))}">
          <div class="hub-page-stack" aria-hidden="true">${Array.from({length:7},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div>
          ${fields.map((f,i)=>`<button class="hub-field ${i===3?'is-highlighted':''}" style="--field:${f.accent};--field-rgb:${f.rgb}" data-route="${f.id}" data-hub-field="${f.id}">
            <span class="hub-field-index">${f.index}</span>
            <span class="hub-field-icon">${fieldIcon(f)}</span>
            <span class="hub-field-copy"><b>${esc(f.title)}</b><small>${esc(f.promise)}</small></span>
            <span class="hub-field-action">${esc(t('hub_explore'))} ${icon('arrow')}</span>
            <span class="hub-field-progress"></span>
          </button>`).join('')}
        </section>
        ${extras.length?`<section class="hub-extra-cvs">
          <span class="section-kicker">${esc(t('hub_extra_cvs'))}</span>
          <div class="hub-extra-list">
            ${extras.map(id=>{
              const label=t(`hub_extra_${id}`)||id;
              return `<a href="${esc(cvPath(id,lang))}" download>${icon('download')}<span>${esc(label)}</span></a>`;
            }).join('')}
          </div>
        </section>`:''}
      </main>
    </div>`;
  }

  function sidebar(field){
    const fields=fieldsList();
    const profile=localizedProfile();
    return `<aside class="field-sidebar is-collapsed" data-sidebar>
      <div class="sidebar-head">
        <a class="sidebar-logo" href="${esc(CONFIG.naStudioHome)}" target="_top"><span>NA</span><small>STUDIO</small></a>
        <button class="sidebar-toggle" type="button" aria-label="${esc(t('toggle_nav'))}" data-sidebar-toggle>${icon('arrow')}</button>
      </div>
      <a class="overview-link" href="#/expertise" data-route="expertise">${icon('back')}<span>${esc(t('overview'))}</span></a>
      <p class="sidebar-label">${esc(t('sidebar_label'))}</p>
      <nav class="field-nav" aria-label="${esc(t('hub_fields_aria'))}">
        ${fields.map(f=>`<a href="#/${f.id}" data-route="${f.id}" class="${field.id===f.id?'active':''}" style="--item:${f.accent};--item-rgb:${f.rgb}" title="${esc(f.title)}">
          <span class="field-nav-index">${f.index}</span><span class="field-nav-icon">${fieldIcon(f)}</span><span class="field-nav-name">${esc(f.title)}</span><i></i>
        </a>`).join('')}
      </nav>
      <div class="sidebar-spacer"></div>
      <div class="sidebar-profile">
        <span class="profile-monogram">NA</span>
        <div><b>Nathan Azoulay</b><small>${esc(field.roles[0])}</small></div>
      </div>
      <div class="sidebar-meta"><span>${icon('pin')} Europe</span><span class="available"><i></i>${esc(profile.availability)}</span></div>
      <div class="sidebar-links"><a href="${esc(CONFIG.linkedIn)}" target="_blank" rel="noopener">in</a><a href="${esc(CONFIG.github)}" target="_blank" rel="noopener">gh</a><a href="#/contact?field=${field.id}" data-route="contact" data-field="${field.id}">${icon('mail')}</a></div>
    </aside>`;
  }

  function pageKpis(){
    return `<section class="credibility-strip" aria-label="${esc(t('kpi_aria'))}">
      <div><b>3</b><span>${esc(t('kpi_internships'))}</span></div>
      <div><b>3</b><span>${esc(t('kpi_programmes'))}</span></div>
      <div><b>${lang==='fr'?'Depuis 2017':'Since 2017'}</b><span>${esc(t('kpi_tutoring'))}</span></div>
      <div><b>FR · EN · ES</b><span>${esc(t('kpi_langs'))}</span></div>
    </section>`;
  }

  function methodGraphic(field){
    const cls=`method-graphic method-graphic--${field.visual}`;
    if(field.visual==='strategy'){
      return `<div class="${cls}"><div class="method-map-core">DECIDE</div>${field.method.map((m,i)=>`<div class="method-orbit method-orbit-${i}"><span>0${i+1}</span><b>${m}</b></div>`).join('')}</div>`;
    }
    if(field.visual==='analytics'){
      return `<div class="${cls}">${field.method.map((m,i)=>`<div class="method-column" style="--i:${i}"><span>0${i+1}</span><i></i><b>${m}</b></div>`).join('')}</div>`;
    }
    if(field.visual==='science'){
      return `<div class="${cls}">${field.method.map((m,i)=>`<div class="method-node" style="--i:${i}"><span>0${i+1}</span><b>${m}</b></div>${i<field.method.length-1?'<i class="method-link"></i>':''}`).join('')}</div>`;
    }
    if(field.visual==='risk'){
      return `<div class="${cls}"><div class="risk-band"></div>${field.method.map((m,i)=>`<div class="risk-step" style="--i:${i}"><span>0${i+1}</span><b>${m}</b></div>`).join('')}</div>`;
    }
    if(field.visual==='growth'){
      return `<div class="${cls}">${field.method.map((m,i)=>`<div class="funnel-step" style="--i:${i}"><span>${m}</span></div>`).join('')}<i class="growth-arrow"></i></div>`;
    }
    if(field.visual==='operations'){
      return `<div class="${cls}"><i class="ops-track"></i>${field.method.map((m,i)=>`<div class="ops-method-node" style="--i:${i}"><span>0${i+1}</span><b>${m}</b></div>`).join('')}</div>`;
    }
    return `<div class="${cls}">${field.method.map((m,i)=>`<div class="pipeline-step" style="--i:${i}"><span>0${i+1}</span><b>${m}</b></div>`).join('')}</div>`;
  }

  function cvControls(field){
    const href=cvPath(field.id, cvLang);
    return `<div class="cv-controls">
      <div class="cv-lang" role="group" aria-label="${esc(t('cv_lang'))}">
        <button type="button" data-set-cv-lang="en" class="${cvLang==='en'?'active':''}">EN</button>
        <button type="button" data-set-cv-lang="fr" class="${cvLang==='fr'?'active':''}">FR</button>
      </div>
      <a class="cv-download" href="${esc(href)}" download>${icon('download')}${esc(t('download_cv'))}</a>
    </div>`;
  }

  function profilePage(field){
    const profile=localizedProfile();
    document.title=`NA Studio — ${field.title}`;
    document.body.dataset.page='profile';
    document.body.dataset.field=field.id;
    document.documentElement.style.setProperty('--page-accent',field.accent);
    document.documentElement.style.setProperty('--page-accent-2',field.accent2);
    document.documentElement.style.setProperty('--page-rgb',field.rgb);
    return `<div class="page-shell page-shell--profile profile-${field.id}" style="--accent:${field.accent};--accent2:${field.accent2};--rgb:${field.rgb}">
      ${sidebar(field)}
      <div class="profile-stage">
        ${topNav({dark:true,field})}
        <main class="profile-main">
          <div class="profile-toolbar">${langSwitcher()}</div>
          <section class="profile-hero">
            <div class="profile-hero-copy">
              <span class="section-kicker">${esc(field.eyebrow)} · ${field.index} / 07</span>
              <h1>${field.hero.map((x,i)=>i===1?`<em>${esc(x)}</em>`:esc(x)).join('<br>')}</h1>
              <p>${esc(field.subtitle)}</p>
              <div class="profile-tags">${field.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div>
              <div class="profile-actions">
                <button class="action-primary" data-contact-intent="hire" data-field="${field.id}">${icon('user')}${esc(t('hire_nathan'))} ${icon('arrow')}</button>
                <button data-contact-intent="freelance" data-field="${field.id}">${icon('brief')}${esc(t('freelance_support'))} ${icon('arrow')}</button>
                ${cvControls(field)}
              </div>
            </div>
            ${VIS[field.visual]()}
          </section>

          <section class="intent-rail">
            <button data-intent-filter="hire" class="active">${icon('user')}<span><b>${esc(t('hub_hire'))}</b><small>${esc(t('intent_hire_sub'))}</small></span>${icon('chevron')}</button>
            <button data-intent-filter="freelance">${icon('brief')}<span><b>${esc(t('hub_freelance'))}</b><small>${esc(t('intent_freelance_sub'))}</small></span>${icon('chevron')}</button>
          </section>

          ${pageKpis()}

          <section class="evidence-section">
            <div class="section-heading"><div><span class="section-kicker">${esc(t('evidence_kicker'))}</span><h2>${esc(t('evidence_title'))}</h2></div><a href="#/contact?field=${field.id}&intent=hire" data-route="contact" data-field="${field.id}" data-intent="hire">${esc(t('evidence_request'))} ${icon('arrow')}</a></div>
            <div class="case-layout">
              ${field.cases.map((c,i)=>`<article class="evidence-card evidence-card-${i+1}">
                <span class="case-type">${esc(c.type)}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p>
                <div class="case-proof"><small>${esc(t('proves'))}</small><b>${esc(c.proof)}</b></div>
                <div class="case-art" aria-hidden="true"><i></i><i></i><i></i><span></span></div>
                <button data-contact-intent="${i===0?'hire':'freelance'}" data-field="${field.id}">${esc(t('discuss_case'))} ${icon('arrow')}</button>
              </article>`).join('')}
            </div>
          </section>

          <section class="capability-layout" data-view="hire">
            <article class="capability-panel problems-panel">
              <span class="section-kicker">${esc(t('problems_kicker'))}</span><h2>${esc(t('problems_title'))}</h2>
              ${field.problems.map(x=>`<p>${icon('check')}<span>${esc(x)}</span></p>`).join('')}
            </article>
            <article class="capability-panel deliverables-panel">
              <span class="section-kicker">${esc(t('deliverables_kicker'))}</span><h2>${esc(t('deliverables_title'))}</h2>
              ${field.deliverables.map(x=>`<p>${icon('spark')}<span>${esc(x)}</span></p>`).join('')}
            </article>
            <article class="capability-panel method-panel">
              <span class="section-kicker">${esc(t('approach_kicker'))}</span><h2>${esc(field.promise)}</h2>
              ${methodGraphic(field)}
              <p class="method-note">${esc(field.methodNote)}</p>
            </article>
          </section>

          <section class="detail-grid">
            <article><span class="section-kicker">${esc(t('tools_kicker'))}</span>${field.tools.map(x=>`<b>${esc(x)}</b>`).join('')}</article>
            <article><span class="section-kicker">${esc(t('sectors_kicker'))}</span>${field.sectors.map(x=>`<b>${esc(x)}</b>`).join('')}</article>
            <article class="hire-only"><span class="section-kicker">${esc(t('roles_kicker'))}</span>${field.roles.map(x=>`<b>${esc(x)}</b>`).join('')}</article>
            <article class="freelance-only"><span class="section-kicker">${esc(t('services_kicker'))}</span>${field.services.map(x=>`<b>${esc(x)}</b>`).join('')}</article>
          </section>

          <section class="foundation-section">
            <div class="foundation-intro"><span class="section-kicker">${esc(t('foundation_kicker'))}</span><h2>${esc(t('foundation_title'))}</h2><p>${esc(t('foundation_body'))}</p></div>
            <div class="foundation-timeline">${profile.education.slice(0,3).map(x=>`<article><span>${x[0]}</span><b>${esc(x[1])}</b><small>${esc(x[2])}</small></article>`).join('')}${profile.experience.slice(0,3).map(x=>`<article><span>${x[0]}</span><b>${esc(x[1])}</b><small>${esc(x[2])}</small></article>`).join('')}</div>
          </section>

          <section class="closing-cta">
            <div><span class="section-kicker">${esc(t('next_kicker'))}</span><h2>${esc(t('next_title'))}</h2><p>${esc(t('next_body'))}</p></div>
            <button class="action-primary" data-contact-intent="hire" data-field="${field.id}">${esc(t('discuss_role'))} ${icon('arrow')}</button>
            <button data-contact-intent="freelance" data-field="${field.id}">${esc(t('start_project'))} ${icon('arrow')}</button>
          </section>
        </main>
      </div>
    </div>`;
  }

  function dynamicFields(intent){
    if(intent==='freelance'){
      return `<label>${esc(t('df_problem'))}<textarea name="problem" rows="4" placeholder="${esc(t('df_problem_ph'))}"></textarea></label>
      <label>${esc(t('df_outcome'))}<textarea name="outcome" rows="3" placeholder="${esc(t('df_outcome_ph'))}"></textarea></label>
      <div class="form-row"><label>${esc(t('df_timing'))}<select name="timing"><option>${esc(t('df_timing_1'))}</option><option>${esc(t('df_timing_2'))}</option><option>${esc(t('df_timing_3'))}</option><option>${esc(t('df_timing_4'))}</option></select></label><label>${esc(t('df_budget'))}<select name="budget"><option>${esc(t('df_budget_1'))}</option><option>${esc(t('df_budget_2'))}</option><option>${esc(t('df_budget_3'))}</option><option>${esc(t('df_budget_4'))}</option><option>${esc(t('df_budget_5'))}</option></select></label></div>`;
    }
    if(intent==='general'){
      return `<label>${esc(t('df_message'))}<textarea name="message" rows="6" placeholder="${esc(t('df_message_ph'))}"></textarea></label>`;
    }
    return `<div class="form-row"><label>${esc(t('df_role'))}<input name="role" placeholder="${esc(t('df_role_ph'))}"></label><label>${esc(t('df_format'))}<select name="format"><option>${esc(t('df_format_1'))}</option><option>${esc(t('df_format_2'))}</option><option>${esc(t('df_format_3'))}</option><option>${esc(t('df_format_4'))}</option><option>${esc(t('df_format_5'))}</option></select></label></div>
      <label>${esc(t('df_team'))}<textarea name="teamContext" rows="4" placeholder="${esc(t('df_team_ph'))}"></textarea></label>
      <label>${esc(t('df_next'))}<textarea name="nextStep" rows="3" placeholder="${esc(t('df_next_ph'))}"></textarea></label>`;
  }

  function contactPage(params){
    const fields=fieldsList();
    const requested=params.get('intent');
    contactIntent=['hire','freelance','general'].includes(requested)?requested:(localStorage.getItem('na-contact-intent')||'hire');
    const selected=fieldById(params.get('field'))||fields[3];
    document.title='NA Studio — Contact';
    document.body.dataset.page='contact';
    document.documentElement.style.setProperty('--page-accent',selected.accent);
    document.documentElement.style.setProperty('--page-accent-2',selected.accent2);
    document.documentElement.style.setProperty('--page-rgb',selected.rgb);
    const email=CONFIG.contactEmail||'nathanazoulay.pro@gmail.com';
    const linkedIn=CONFIG.linkedIn||'https://linkedin.com/in/nathanazoulay';
    const github=CONFIG.github||'https://github.com/nathanazoulay';
    const booking=CONFIG.bookingUrl||'https://calendar.app.google/FwvLrs17YcM1Ksmy9';
    return `<div class="page-shell page-shell--contact" style="--accent:${selected.accent};--accent2:${selected.accent2};--rgb:${selected.rgb}">
      ${topNav({dark:true,field:selected})}
      <main class="contact-main">
        <div class="contact-toolbar">${langSwitcher()}</div>
        <a class="contact-back" href="#/${selected.id}" data-route="${selected.id}">${icon('back')}${esc(t('contact_back'))} ${esc(selected.short)}</a>
        <section class="contact-heading">
          <span class="section-kicker">${esc(t('contact_kicker'))}</span>
          <h1>${esc(t('contact_title'))}</h1>
          <p>${esc(t('contact_body'))}</p>
        </section>
        <section class="contact-channels" aria-label="${esc(t('channels_aria'))}">
          <a href="mailto:${esc(email)}"><span>${esc(t('channel_email'))}</span><b>${esc(email)}</b></a>
          <a href="${esc(linkedIn)}" target="_blank" rel="noopener noreferrer"><span>${esc(t('channel_linkedin'))}</span><b>linkedin.com/in/nathanazoulay</b></a>
          <a href="${esc(github)}" target="_blank" rel="noopener noreferrer"><span>${esc(t('channel_github'))}</span><b>github.com/nathanazoulay</b></a>
          <a href="${esc(booking)}" target="_blank" rel="noopener noreferrer"><span>${esc(t('channel_calendar'))}</span><b>${esc(t('book_call'))}</b></a>
        </section>
        <section class="contact-grid">
          <aside class="contact-planner">
            <span class="section-kicker">${esc(t('intention'))}</span>
            <div class="contact-intents">
              <button data-set-contact="hire" class="${contactIntent==='hire'?'active':''}">${icon('user')}<b>${esc(t('intent_hire'))}</b></button>
              <button data-set-contact="freelance" class="${contactIntent==='freelance'?'active':''}">${icon('brief')}<b>${esc(t('intent_freelance'))}</b></button>
              <button data-set-contact="general" class="${contactIntent==='general'?'active':''}">${icon('mail')}<b>${esc(t('intent_general'))}</b></button>
            </div>
            <label class="field-select">${esc(t('relevant_field'))}<select id="contact-field">${fields.map(f=>`<option value="${f.id}" ${f.id===selected.id?'selected':''}>${esc(f.title)}</option>`).join('')}</select></label>
            <div class="contact-profile-card" id="contact-profile-card" hidden></div>
          </aside>
          <form class="smart-form" id="smart-contact-form">
            <div class="form-row"><label>${esc(t('your_name'))}<input required name="name" autocomplete="name" placeholder="${esc(t('name_ph'))}"></label><label>${esc(t('email'))}<input required type="email" name="email" autocomplete="email" placeholder="${esc(t('email_ph'))}"></label></div>
            <label>${esc(t('organisation'))}<input name="organisation" autocomplete="organization" placeholder="${esc(t('org_ph'))}"></label>
            <div id="dynamic-contact-fields">${dynamicFields(contactIntent)}</div>
            <label>${esc(t('anything_else'))}<textarea name="notes" rows="3" placeholder="${esc(t('notes_ph'))}"></textarea></label>
            <pre id="request-preview" class="sr-only" aria-hidden="true"></pre>
            <div class="form-actions"><button class="action-primary" type="submit">${icon('mail')}${esc(t('prepare_email'))}</button></div>
            <p class="form-status" id="form-status" role="status"></p>
          </form>
        </section>
      </main>
    </div>`;
  }

  function render({initial=false}={}){
    const {path,params}=parseHash();
    let html;
    if(path==='expertise') html=hub();
    else if(path==='contact') html=contactPage(params);
    else html=fieldById(path)?profilePage(fieldById(path)):hub();
    app.innerHTML=html;
    app.className='app-rendered';
    document.documentElement.lang=lang;
    bindAll();
    requestAnimationFrame(()=>{
      document.querySelector('.page-shell')?.classList.add('is-visible');
      transition.classList.add('is-revealing');
      setTimeout(()=>{transition.className='route-transition';},620);
    });
    if(!initial) window.scrollTo({top:0,behavior:'instant'});
    lastRoute=path;
    try {
      const qs=Object.fromEntries(params.entries());
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type:'na-expertise-route', path, params: qs, lang }, '*');
      }
    } catch (e) {}
  }

  function bindScrollRelay(){
    if(window.__naExpertiseScrollBound) return;
    window.__naExpertiseScrollBound=true;
    const relay=()=>{
      try{
        if(window.parent && window.parent !== window){
          const y=window.scrollY || document.documentElement.scrollTop || 0;
          window.parent.postMessage({ type:'na-expertise-scroll', y }, '*');
        }
      }catch(e){}
    };
    window.addEventListener('scroll',relay,{passive:true});
    relay();
  }

  function bindAll(){
    bindScrollRelay();
    document.querySelectorAll('[data-set-lang]').forEach(el=>{
      el.addEventListener('click',()=>setLang(el.dataset.setLang));
    });
    document.querySelectorAll('[data-set-cv-lang]').forEach(el=>{
      el.addEventListener('click',()=>{
        cvLang=el.dataset.setCvLang;
        const fieldId=document.body.dataset.field;
        const link=document.querySelector('.cv-download');
        if(link && fieldId) link.href=cvPath(fieldId, cvLang);
        document.querySelectorAll('[data-set-cv-lang]').forEach(x=>x.classList.toggle('active',x.dataset.setCvLang===cvLang));
      });
    });
    document.querySelectorAll('[data-route]').forEach(el=>{
      el.addEventListener('click',e=>{
        const path=el.dataset.route;
        if(!path) return;
        e.preventDefault();
        const params={};
        if(el.dataset.intent) params.intent=el.dataset.intent;
        if(el.dataset.field) params.field=el.dataset.field;
        navTo(path,params,el);
      });
    });
    document.querySelectorAll('[data-contact-intent]').forEach(el=>el.addEventListener('click',()=>{
      const intent=el.dataset.contactIntent||'general';
      const field=el.dataset.field||parseHash().path;
      localStorage.setItem('na-contact-intent',intent);
      navTo('contact',{intent,field:fieldById(field)?field:''},el);
    }));
    const sidebarEl=document.querySelector('[data-sidebar]');
    if(sidebarEl){
      const collapse=()=>sidebarEl.classList.add('is-collapsed');
      const expand=()=>sidebarEl.classList.remove('is-collapsed');
      collapse();
      sidebarEl.addEventListener('mouseenter',expand);
      sidebarEl.addEventListener('mouseleave',collapse);
      sidebarEl.addEventListener('focusin',expand);
      sidebarEl.addEventListener('focusout',(e)=>{
        if(!sidebarEl.contains(e.relatedTarget)) collapse();
      });
      const toggle=document.querySelector('[data-sidebar-toggle]');
      if(toggle){
        toggle.addEventListener('click',()=>{
          if(window.matchMedia('(max-width:980px)').matches){
            sidebarEl.classList.toggle('mobile-open');
          } else {
            sidebarEl.classList.toggle('is-collapsed');
          }
        });
      }
    }
    document.querySelectorAll('[data-hub-field]').forEach(el=>{
      el.addEventListener('mouseenter',()=>{
        document.querySelectorAll('[data-hub-field]').forEach(x=>x.classList.remove('is-highlighted'));
        el.classList.add('is-highlighted');
        const f=fieldById(el.dataset.hubField);
        document.querySelector('.expertise-hub')?.style.setProperty('--hub-accent',f.accent);
        document.querySelector('.hub-sculpture')?.setAttribute('data-field',f.visual);
      });
    });
    document.querySelectorAll('[data-intent-filter]').forEach(el=>el.addEventListener('click',()=>{
      document.querySelectorAll('[data-intent-filter]').forEach(x=>x.classList.toggle('active',x===el));
      const view=el.dataset.intentFilter;
      const layout=document.querySelector('.capability-layout');
      if(layout) layout.dataset.view=view;
      document.querySelectorAll('.hire-only').forEach(x=>x.hidden=view!=='hire');
      document.querySelectorAll('.freelance-only').forEach(x=>x.hidden=view!=='freelance');
    }));
    bindContact();
  }

  function bindContact(){
    const form=document.getElementById('smart-contact-form');
    if(!form) return;
    const fieldSelect=document.getElementById('contact-field');
    const dynamic=document.getElementById('dynamic-contact-fields');
    const preview=document.getElementById('request-preview');
    const card=document.getElementById('contact-profile-card');
    const status=document.getElementById('form-status');

    function selectedField(){return fieldById(fieldSelect.value)||fieldsList()[3];}
    function updateTheme(){
      const f=selectedField();
      const shell=document.querySelector('.page-shell--contact');
      shell.style.setProperty('--accent',f.accent); shell.style.setProperty('--accent2',f.accent2); shell.style.setProperty('--rgb',f.rgb);
      if(card && !card.hasAttribute('hidden')){
        card.innerHTML=`<span>${f.index}</span><h2>${esc(f.title)}</h2><p>${esc(f.promise)}</p><div>${f.tags.slice(0,4).map(x=>`<b>${esc(x)}</b>`).join('')}</div>`;
      }
    }
    function formDataObject(){return Object.fromEntries(new FormData(form).entries());}
    function buildMessage(){
      const f=selectedField(); const d=formDataObject();
      const head=contactIntent==='hire'?(lang==='fr'?'DEMANDE RECRUTEMENT':'RECRUITMENT ENQUIRY'):contactIntent==='freelance'?(lang==='fr'?'DEMANDE PROJET FREELANCE':'FREELANCE PROJECT ENQUIRY'):(lang==='fr'?'DEMANDE GÉNÉRALE':'GENERAL ENQUIRY');
      const lines=[head,`Expertise: ${f.title}`,`Name: ${d.name||'—'}`,`Email: ${d.email||'—'}`,`Organisation: ${d.organisation||'—'}`];
      Object.entries(d).filter(([k,v])=>!['name','email','organisation'].includes(k)&&String(v).trim()).forEach(([k,v])=>lines.push(`${k.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase())}: ${v}`));
      return lines.join('\n\n');
    }
    function updatePreview(){
      const message=buildMessage(); preview.textContent=message;
      localStorage.setItem('na-contact-draft',JSON.stringify({intent:contactIntent,field:fieldSelect.value,data:formDataObject()}));
    }
    function switchIntent(intent){
      contactIntent=intent; localStorage.setItem('na-contact-intent',intent);
      document.querySelectorAll('[data-set-contact]').forEach(x=>x.classList.toggle('active',x.dataset.setContact===intent));
      dynamic.innerHTML=dynamicFields(intent);
      dynamic.querySelectorAll('input,textarea,select').forEach(x=>x.addEventListener('input',updatePreview));
      updatePreview();
    }
    document.querySelectorAll('[data-set-contact]').forEach(x=>x.addEventListener('click',()=>switchIntent(x.dataset.setContact)));
    fieldSelect.addEventListener('change',()=>{updateTheme();updatePreview();});
    form.querySelectorAll('input,textarea,select').forEach(x=>x.addEventListener('input',updatePreview));
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!form.reportValidity()) return;
      const message=buildMessage();
      const f=selectedField();
      const subject=`${contactIntent==='hire'?(lang==='fr'?'Opportunité de rôle':'Role opportunity'):contactIntent==='freelance'?(lang==='fr'?'Projet freelance':'Freelance project'):(lang==='fr'?'Demande':'Enquiry')} — ${f.title}`;
      if(CONFIG.formspreeEndpoint){
        try{
          status.textContent=lang==='fr'?'Envoi…':'Sending…';
          const res=await fetch(CONFIG.formspreeEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...formDataObject(),intent:contactIntent,expertise:f.title,structuredMessage:message})});
          if(!res.ok) throw new Error('Submission failed');
          status.textContent=lang==='fr'?'Message envoyé.':'Message sent successfully.'; return;
        }catch(err){status.textContent=lang==='fr'?'Envoi direct échoué ; ouverture du client email.':'Direct submission failed; opening your email client instead.';}
      }
      location.href=`mailto:${encodeURIComponent(CONFIG.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    });
    updateTheme();
    const saved=localStorage.getItem('na-contact-draft');
    if(saved){
      try{
        const draft=JSON.parse(saved);
        if(draft.field===fieldSelect.value&&draft.intent===contactIntent){Object.entries(draft.data||{}).forEach(([k,v])=>{const el=form.elements.namedItem(k);if(el)el.value=v;});}
      }catch{}
    }
    updatePreview();
  }

  window.addEventListener('message',(event)=>{
    const data=event.data;
    if(!data || data.type!=='na-studio-lang') return;
    if(data.lang==='en' || data.lang==='fr') setLang(data.lang);
  });

  window.addEventListener('hashchange',()=>render());
  if(!location.hash) location.hash='#/expertise';
  else render({initial:true});
})();
