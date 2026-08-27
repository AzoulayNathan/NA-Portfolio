import { ASSET_BASE, currentSearch, setClassroomLocation } from './embed.js';
import { t, label as lbl } from './i18n.js';

const DRAFT_KEY = 'na-classroom-lesson-request-draft';
const ALLOW_IN_PERSON = true;
const STEP_LABELS = ['Goal', 'Level', 'Preferences', 'Availability', 'Contact'];

const CATEGORIES = [
  {
    id: 'learning-path',
    title: 'One of the 4 learning paths',
    text: 'Data Analysis, Data Science, Business Analysis, AI & Automation.'
  },
  {
    id: 'school-university',
    title: 'School & university',
    text: 'From school fundamentals to university-level support.'
  },
  {
    id: 'fle',
    title: 'French / FLE',
    text: 'Conversation, grammar, exams or professional French.'
  },
  {
    id: 'exam-project',
    title: 'Exam, assignment or project',
    text: 'Prepare for an exam or get help with a specific piece of work.'
  },
  {
    id: 'other',
    title: 'Something else',
    text: 'Tell me what you need and we’ll figure out the right approach.'
  }
];

const PATH_HELP = [
  'Understand a concept',
  'Review a lesson',
  'Work through exercises',
  'Go deeper into the subject',
  'Apply it to a real project',
  'Prepare for an interview or exam',
  'Other'
];

const EDU_LEVELS = [
  'Primary school',
  'Middle school / Collège',
  'High school / Lycée',
  'BTS / BUT',
  'Prépa',
  'Bachelor / Licence',
  'Master',
  'Other'
];

const EDU_SUBJECTS = [
  'Mathematics', 'Statistics', 'Probability', 'Data Analysis', 'Data Science',
  'Python', 'SQL', 'R', 'Excel', 'Business Analytics', 'Other'
];

const EDU_NEEDS = [
  'Understand the lesson', 'Exercises', 'Homework', 'Exam preparation',
  'Catch up', 'Project', 'Build stronger foundations', 'Go further'
];

const FLE_LEVELS = ['A0 / Beginner', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Not sure'];
const FLE_GOALS = [
  'Conversation', 'Grammar', 'Pronunciation', 'Listening', 'Writing',
  'Professional French', 'Academic French', 'DELF', 'DALF', 'TCF',
  'Travel / relocation', 'Other'
];

const PROJECT_TYPES = [
  'School exam', 'University exam', 'Competitive exam', 'Certification',
  'Assignment', 'Data project', 'Research / thesis', 'Portfolio project',
  'Interview preparation', 'Other'
];

const LEARNER_LEVELS = [
  'Starting from scratch', 'I know the basics', 'Intermediate',
  'Comfortable', 'Advanced', 'Not sure'
];

const FREQUENCIES = [
  'One session', 'A few sessions', 'Weekly lessons',
  'Several sessions per week', 'Not sure yet'
];

const DURATIONS = ['30 min', '45 min', '60 min', '90 min'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PERIODS = ['Morning', 'Afternoon', 'Evening'];
const MINOR_LEVELS = new Set(['Primary school', 'Middle school / Collège', 'High school / Lycée']);

function defaultState() {
  let tz = 'Europe/Paris';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz; } catch {}
  return {
    step: 1,
    submitted: false,
    requestId: '',
    errors: {},
    source: { page: 'book-a-lesson', pillar: '', week: '', lessonId: '', articleId: '', referrer: '' },
    requestCategory: '',
    learningPath: { pillar: '', week: '', lessonId: '', goal: '', lessonQuery: '' },
    education: { level: '', subject: '', topic: '', goal: '', under18: '' },
    fle: { level: '', objective: '', details: '', supportLanguage: 'French' },
    project: { type: '', title: '', deadline: '', description: '' },
    other: { details: '' },
    learner: { currentLevel: '', difficulty: '', desiredOutcome: '' },
    lessonPreferences: { frequency: '', duration: '60 min', format: 'Online', language: 'English' },
    availability: { timezone: tz, days: [], periods: [], details: '' },
    contact: { firstName: '', lastName: '', email: '', phone: '', preferredContact: 'Email', country: '' },
    guardian: { required: false, name: '', email: '', phone: '' },
    attachments: [],
    consent: true,
    summaryOpen: false
  };
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return { ...defaultState(), ...JSON.parse(raw), submitted: false, errors: {} };
  } catch { return null; }
}

function saveDraft(state) {
  try {
    const { errors, submitted, requestId, summaryOpen, ...rest } = state;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
  } catch {}
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

function pillarLabel(pillars, id) {
  const p = pillars.find((x) => x.id === id);
  if (!p) return id || '—';
  return t(`pillars.${id}.name`) || p.name;
}

function findLesson(pillars, pillarId, lessonId, week) {
  const p = pillars.find((x) => x.id === pillarId);
  if (!p) return null;
  if (lessonId) return p.lessons.find((l) => l.id === lessonId) || null;
  if (week) return p.lessons.find((l) => String(l.week) === String(Number(week))) || null;
  return null;
}

function categoryTitle(id) {
  const pair = t(`bk.cats.${id}`);
  return Array.isArray(pair) ? pair[0] : (CATEGORIES.find((c) => c.id === id)?.title || '—');
}

function optionRow(name, value, label, sub = '', selected = false, style = '') {
  return `<label class="bk-option ${selected ? 'selected' : ''}" ${style}>
    <input type="radio" name="${name}" value="${escAttr(value)}" ${selected ? 'checked' : ''}/>
    <span class="bk-option-copy"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</span>
    <i aria-hidden="true">${selected ? '✓' : ''}</i>
  </label>`;
}

function chip(name, value, label, selected = false, multi = false) {
  const type = multi ? 'checkbox' : 'radio';
  return `<label class="bk-chip ${selected ? 'selected' : ''}">
    <input type="${type}" name="${name}" value="${escAttr(value)}" ${selected ? 'checked' : ''}/>
    <span>${label}</span>
  </label>`;
}

function fieldError(errors, key) {
  return errors[key] ? `<p class="bk-error" id="err-${key}" role="alert">${errors[key]}</p>` : '';
}
function described(errors, key) {
  return errors[key] ? ` aria-invalid="true" aria-describedby="err-${key}"` : '';
}

function esc(s = '') {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function escAttr(s = '') { return esc(s).replace(/'/g, '&#39;'); }

function applyUrlPrefill(state, pillars) {
  const params = new URLSearchParams(currentSearch());
  const pillar = params.get('pillar') || '';
  const week = params.get('week') || '';
  const lessonId = params.get('lesson') || '';
  const articleId = params.get('article') || '';
  if (!pillar && !week && !lessonId && !articleId) return state;

  const next = { ...state, requestCategory: pillar ? 'learning-path' : state.requestCategory };
  next.source = {
    ...next.source,
    page: articleId ? 'article' : (lessonId || week ? 'lesson' : (pillar ? 'pillar' : 'book-a-lesson')),
    pillar,
    week: week ? String(Number(week)) : '',
    lessonId,
    articleId,
    referrer: document.referrer || next.source.referrer || ''
  };
  if (pillar && pillars.some((p) => p.id === pillar)) {
    const lesson = findLesson(pillars, pillar, lessonId, week);
    next.learningPath = {
      ...next.learningPath,
      pillar,
      week: week ? String(Number(week)) : (lesson ? String(lesson.week) : ''),
      lessonId: lesson?.id || lessonId || ''
    };
  }
  return next;
}

function knownLevelFromCategory(state) {
  return state.requestCategory === 'school-university' || state.requestCategory === 'fle';
}

function buildPayload(state) {
  const { lessonQuery, ...learningPath } = state.learningPath;
  const { under18, ...education } = state.education;
  return {
    id: `draft_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'draft',
    source: { ...state.source },
    requestCategory: state.requestCategory,
    learningPath,
    education,
    fle: { level: state.fle.level, objective: state.fle.objective, supportLanguage: state.fle.supportLanguage },
    project: { ...state.project },
    learner: { ...state.learner },
    lessonPreferences: { ...state.lessonPreferences },
    availability: { ...state.availability, mode: 'generic' },
    contact: { ...state.contact },
    guardian: {
      required: MINOR_LEVELS.has(state.education.level) && under18 === 'yes',
      name: state.guardian.name,
      email: state.guardian.email,
      phone: state.guardian.phone
    },
    attachments: state.attachments || [],
    consent: true,
    notes: state.other?.details || state.fle?.details || ''
  };
}

function validateStep(state) {
  const errors = {};
  if (state.step === 1) {
    if (!state.requestCategory) errors.requestCategory = t('bk.err.requestCategory');
    if (state.requestCategory === 'learning-path') {
      if (!state.learningPath.pillar) errors.pillar = t('bk.err.pillar');
      if (!state.learningPath.goal) errors.pathGoal = t('bk.err.pathGoal');
    }
    if (state.requestCategory === 'school-university') {
      if (!state.education.level) errors.eduLevel = t('bk.err.eduLevel');
      if (!state.education.subject) errors.eduSubject = t('bk.err.eduSubject');
      if (!state.education.goal) errors.eduGoal = t('bk.err.eduGoal');
      if (MINOR_LEVELS.has(state.education.level) && !state.education.under18) {
        errors.under18 = t('bk.err.under18');
      }
    }
    if (state.requestCategory === 'fle') {
      if (!state.fle.level) errors.fleLevel = t('bk.err.fleLevel');
      if (!state.fle.objective) errors.fleObjective = t('bk.err.fleObjective');
    }
    if (state.requestCategory === 'exam-project') {
      if (!state.project.type) errors.projectType = t('bk.err.projectType');
      if (!state.project.title.trim()) errors.projectTitle = t('bk.err.projectTitle');
    }
    if (state.requestCategory === 'other') {
      if (!state.other.details.trim()) errors.otherDetails = t('bk.err.otherDetails');
    }
  }
  if (state.step === 2) {
    if (!knownLevelFromCategory(state) && !state.learner.currentLevel) {
      errors.currentLevel = t('bk.err.currentLevel');
    }
    if (!state.learner.desiredOutcome.trim()) errors.desiredOutcome = t('bk.err.desiredOutcome');
  }
  if (state.step === 3) {
    if (!state.lessonPreferences.frequency) errors.frequency = t('bk.err.frequency');
    if (!state.lessonPreferences.duration) errors.duration = t('bk.err.duration');
    if (!state.lessonPreferences.format) errors.format = t('bk.err.format');
    if (!state.lessonPreferences.language) errors.language = t('bk.err.language');
  }
  if (state.step === 4) {
    if (!state.availability.days.length) errors.days = t('bk.err.days');
    if (!state.availability.periods.length) errors.periods = t('bk.err.periods');
  }
  if (state.step === 5) {
    if (!state.contact.firstName.trim()) errors.firstName = t('bk.err.firstName');
    if (!state.contact.lastName.trim()) errors.lastName = t('bk.err.lastName');
    if (!state.contact.email.trim()) errors.email = t('bk.err.email');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact.email)) errors.email = t('bk.err.emailInvalid');
    if (MINOR_LEVELS.has(state.education.level) && state.education.under18 === 'yes') {
      if (!state.guardian.name.trim()) errors.guardianName = t('bk.err.guardianName');
      if (!state.guardian.email.trim()) errors.guardianEmail = t('bk.err.guardianEmail');
    }
  }
  return errors;
}

function summaryLines(state, pillars) {
  const lines = [];
  lines.push([t('bk.type'), state.requestCategory ? categoryTitle(state.requestCategory) : '—']);

  if (state.requestCategory === 'learning-path') {
    lines.push([t('bk.pathLabel'), state.learningPath.pillar ? pillarLabel(pillars, state.learningPath.pillar) : '—']);
    const lesson = findLesson(pillars, state.learningPath.pillar, state.learningPath.lessonId, state.learningPath.week);
    if (lesson || state.learningPath.week) {
      const week = lesson?.week || state.learningPath.week;
      lines.push([t('bk.lesson'), `${t('bk.week')} ${String(week).padStart(2, '0')}${lesson ? ` · ${lesson.short}` : ''}`]);
    }
    if (state.learningPath.goal) lines.push([t('bk.goal'), lbl(state.learningPath.goal)]);
  }
  if (state.requestCategory === 'school-university') {
    if (state.education.subject) lines.push([t('bk.subject'), lbl(state.education.subject)]);
    if (state.education.level) lines.push([t('bk.level'), lbl(state.education.level)]);
    if (state.education.goal) lines.push([t('bk.goal'), lbl(state.education.goal)]);
  }
  if (state.requestCategory === 'fle') {
    if (state.fle.level) lines.push([t('bk.level'), lbl(state.fle.level)]);
    if (state.fle.objective) lines.push([t('bk.goal'), lbl(state.fle.objective)]);
  }
  if (state.requestCategory === 'exam-project') {
    if (state.project.type) lines.push([t('bk.subject'), lbl(state.project.type)]);
    if (state.project.title) lines.push([lbl('Title'), state.project.title]);
  }
  if (state.requestCategory === 'other' && state.other.details) {
    lines.push([t('bk.goal'), state.other.details.slice(0, 80) + (state.other.details.length > 80 ? '…' : '')]);
  }

  if (state.learner.currentLevel) lines.push([t('bk.level'), lbl(state.learner.currentLevel)]);
  if (state.step >= 3 && state.lessonPreferences.frequency) lines.push([t('bk.frequency'), lbl(state.lessonPreferences.frequency)]);
  if (state.step >= 3 && state.lessonPreferences.duration) lines.push([t('bk.duration'), state.lessonPreferences.duration]);
  if (state.step >= 3 && state.lessonPreferences.format) lines.push([lbl('Format'), lbl(state.lessonPreferences.format)]);
  if (state.availability.days.length || state.availability.periods.length) {
    const avail = [
      state.availability.days.slice(0, 2).map(lbl).join(', '),
      state.availability.periods.slice(0, 2).map(lbl).join(', ').toLowerCase()
    ].filter(Boolean).join(' · ');
    lines.push([t('bk.availability'), avail || '—']);
  }
  return lines;
}

function renderStepper(state) {
  const steps = t('bk.steps');
  const list = Array.isArray(steps) ? steps : STEP_LABELS;
  return `<ol class="bk-stepper" aria-label="${esc(t('bk.summary'))}">${list.map((stepLabel, i) => {
    const n = i + 1;
    const done = state.step > n;
    const active = state.step === n;
    return `<li class="bk-step ${active ? 'active' : ''} ${done ? 'done' : ''}">
      <span class="bk-step-num" aria-hidden="true">${done ? '✓' : String(n).padStart(2, '0')}</span>
      <span class="bk-step-label">${stepLabel}</span>
    </li>`;
  }).join('')}</ol>`;
}

function renderSummary(state, pillars) {
  const lines = summaryLines(state, pillars);
  return `<aside class="bk-summary" id="request-summary" aria-label="${esc(t('bk.summary'))}">
    <div class="bk-summary-head"><h2>${esc(t('bk.summary'))}</h2></div>
    <div class="bk-summary-body" aria-live="polite">
      ${lines.map(([k, v]) => `<div class="bk-summary-row"><span>${esc(k)}</span><b>${esc(v || '—')}</b></div>`).join('')}
    </div>
    <div class="bk-summary-tutor">
      <div class="avatar-na">NA</div>
      <div><strong>Nathan A.</strong><p>${esc(t('bk.tutorRole'))}</p></div>
    </div>
    <div class="bk-channels">
      <a href="mailto:nathanazoulay.pro@gmail.com"><span>${esc(t('bk.channelEmail'))}</span><b>nathanazoulay.pro@gmail.com</b></a>
      <a href="https://www.linkedin.com/in/nathan-azoulay-0719b4207" target="_blank" rel="noopener noreferrer"><span>${esc(t('bk.channelLinkedin'))}</span><b>linkedin.com/in/nathan-azoulay-0719b4207</b></a>
      <a href="https://github.com/AzoulayNathan" target="_blank" rel="noopener noreferrer"><span>${esc(t('bk.channelGithub'))}</span><b>github.com/AzoulayNathan</b></a>
      <a href="https://calendly.com/nathan-azoulay-na-studio1/30min" target="_blank" rel="noopener noreferrer"><span>${esc(t('bk.channelCalendly'))}</span><b>calendly.com/nathan-azoulay-na-studio1/30min</b></a>
    </div>
  </aside>`;
}

function softPathHint(state, pillars) {
  if (state.requestCategory !== 'learning-path' || !state.learningPath.pillar) return '';
  if (state.source.lessonId || state.learningPath.lessonId) return '';
  const p = pillars.find((x) => x.id === state.learningPath.pillar);
  if (!p?.firstLessonId) return '';
  const first = p.lessons.find((l) => l.id === p.firstLessonId) || p.lessons[0];
  if (!first) return '';
  return `<div class="bk-hint">
    <div><b>${esc(t('bk.hintNew'))}</b><p>${esc(t('bk.hintStart', { name: pillarLabel(pillars, p.id) }))}</p></div>
    <a class="bk-link" href="/classroom/learn/${p.id}?week=1" data-nav>${esc(t('bk.hintView'))}</a>
  </div>`;
}

function articleContext(state, pillars) {
  if (!state.source.articleId && !state.source.lessonId) return '';
  const lesson = findLesson(pillars, state.learningPath.pillar || state.source.pillar, state.source.lessonId || state.learningPath.lessonId, state.source.week);
  const title = state.source.articleId
    ? (lesson ? `${lesson.title}` : `Article ${state.source.articleId}`)
    : (lesson ? lesson.title : '');
  if (!title) return '';
  return `<div class="bk-context" role="status">${esc(t('bk.asking'))} <strong>${esc(title)}</strong></div>`;
}

function step1(state, pillars) {
  const prefilledPillar = Boolean(state.source.pillar && state.learningPath.pillar);
  let body = `<div class="bk-section">
    <h2>${esc(t('bk.q1'))}</h2>
    <p class="bk-lead">${esc(t('bk.lead1'))}</p>
    ${articleContext(state, pillars)}
    <div class="bk-options" role="radiogroup" aria-label="${esc(t('bk.q1'))}">
      ${CATEGORIES.map((c) => { const pair=t(`bk.cats.${c.id}`); const title=Array.isArray(pair)?pair[0]:c.title; const text=Array.isArray(pair)?pair[1]:c.text; return optionRow('requestCategory', c.id, title, text, state.requestCategory === c.id); }).join('')}
    </div>
    ${fieldError(state.errors, 'requestCategory')}
  </div>`;

  if (state.requestCategory === 'learning-path') {
    body += `<div class="bk-section">
      <h3>${esc(t('bk.whichPath'))}</h3>
      ${prefilledPillar ? `<div class="bk-prefill">${esc(t('bk.pathLabel'))}: <strong>${esc(pillarLabel(pillars, state.learningPath.pillar))}</strong>
        ${state.learningPath.week ? ` · ${esc(t('bk.week'))} ${String(state.learningPath.week).padStart(2, '0')}` : ''}
        ${(() => { const l = findLesson(pillars, state.learningPath.pillar, state.learningPath.lessonId, state.learningPath.week); return l ? ` · ${esc(l.short)}` : ''; })()}
        <button type="button" class="bk-text-btn" data-clear-prefill>${esc(t('bk.change'))}</button></div>` : `
      <div class="bk-pillars" role="radiogroup" aria-label="${esc(t('bk.whichPath'))}">
        ${pillars.map((p) => `<label class="bk-pillar ${state.learningPath.pillar === p.id ? 'selected' : ''}" style="--pillar:${p.accent}">
          <input type="radio" name="pillar" value="${p.id}" ${state.learningPath.pillar === p.id ? 'checked' : ''}/>
          <span class="bk-pillar-num">${p.number}</span>
          <span>${esc(pillarLabel(pillars, p.id))}</span>
        </label>`).join('')}
      </div>`}
      ${fieldError(state.errors, 'pillar')}
      <h3>${esc(t('bk.helpWith'))}</h3>
      <div class="bk-options compact">${PATH_HELP.map((g) => optionRow('pathGoal', g, lbl(g), '', state.learningPath.goal === g)).join('')}</div>
      ${fieldError(state.errors, 'pathGoal')}
      ${state.source.lessonId ? '' : `<label class="bk-field">${esc(t('bk.specific'))}
        <input type="search" id="lessonQuery" list="lessonList" placeholder="${escAttr(t('bk.specificPh'))}" value="${escAttr(state.learningPath.lessonQuery || '')}" autocomplete="off"/>
      </label>
      <datalist id="lessonList">${(pillars.find((p) => p.id === state.learningPath.pillar)?.lessons || []).map((l) => `<option value="${escAttr(l.short)}"></option>`).join('')}</datalist>`}
      ${softPathHint(state, pillars)}
    </div>`;
  }

  if (state.requestCategory === 'school-university') {
    body += `<div class="bk-section">
      <h3>${esc(t('bk.yourLevel'))}</h3>
      <div class="bk-chips">${EDU_LEVELS.map((l) => chip('eduLevel', l, lbl(l), state.education.level === l)).join('')}</div>
      ${fieldError(state.errors, 'eduLevel')}
      <h3>${esc(t('bk.subject'))}</h3>
      <div class="bk-chips">${EDU_SUBJECTS.map((s) => chip('eduSubject', s, lbl(s), state.education.subject === s)).join('')}</div>
      ${fieldError(state.errors, 'eduSubject')}
      <label class="bk-field">${esc(t('bk.topic'))}
        <input type="text" id="eduTopic" placeholder="${escAttr(t('bk.topicPh'))}" value="${escAttr(state.education.topic)}"/>
      </label>
      <h3>${esc(t('bk.whatNeed'))}</h3>
      <div class="bk-chips">${EDU_NEEDS.map((n) => chip('eduGoal', n, lbl(n), state.education.goal === n)).join('')}</div>
      ${fieldError(state.errors, 'eduGoal')}
      ${MINOR_LEVELS.has(state.education.level) ? `<h3>${esc(t('bk.under18'))}</h3>
        <div class="bk-chips">${[['yes', t('bk.yes')], ['no', t('bk.no')]].map(([v, l]) => chip('under18', v, l, state.education.under18 === v)).join('')}</div>
        ${fieldError(state.errors, 'under18')}` : ''}
      <label class="bk-field">${esc(t('bk.attachments'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
        <input type="file" id="eduFiles" multiple accept=".pdf,image/*,.doc,.docx,.txt"/>
      </label>
    </div>`;
  }

  if (state.requestCategory === 'fle') {
    body += `<div class="bk-section">
      <h3>${esc(t('bk.fleLevel'))}</h3>
      <div class="bk-chips">${FLE_LEVELS.map((l) => chip('fleLevel', l, lbl(l), state.fle.level === l)).join('')}</div>
      ${fieldError(state.errors, 'fleLevel')}
      <h3>${esc(t('bk.fleImprove'))}</h3>
      <div class="bk-chips">${FLE_GOALS.map((g) => chip('fleObjective', g, lbl(g), state.fle.objective === g)).join('')}</div>
      ${fieldError(state.errors, 'fleObjective')}
      <label class="bk-field">${esc(t('bk.fleMore'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
        <textarea id="fleDetails" placeholder="${escAttr(t('bk.flePh'))}">${esc(state.fle.details)}</textarea>
      </label>
      <h3>${esc(t('bk.supportLang'))}</h3>
      <div class="bk-chips">${['French', 'English'].map((l) => chip('supportLanguage', l, lbl(l), state.fle.supportLanguage === l)).join('')}</div>
    </div>`;
  }

  if (state.requestCategory === 'exam-project') {
    body += `<div class="bk-section">
      <h3>${esc(t('bk.workingOn'))}</h3>
      <div class="bk-options compact">${PROJECT_TYPES.map((pt) => optionRow('projectType', pt, lbl(pt), '', state.project.type === pt)).join('')}</div>
      ${fieldError(state.errors, 'projectType')}
      <div class="bk-grid-2">
        <label class="bk-field">${esc(t('bk.titleSubject'))}
          <input type="text" id="projectTitle" value="${escAttr(state.project.title)}"/>
          ${fieldError(state.errors, 'projectTitle')}
        </label>
        <label class="bk-field">${esc(t('bk.deadline'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
          <input type="date" id="projectDeadline" value="${escAttr(state.project.deadline)}"/>
        </label>
      </div>
      <label class="bk-field">${esc(t('bk.description'))}
        <textarea id="projectDescription" placeholder="${escAttr(t('bk.descPh'))}">${esc(state.project.description)}</textarea>
      </label>
      <label class="bk-field">${esc(t('bk.upload'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
        <input type="file" id="projectFiles" multiple accept=".pdf,image/*,.doc,.docx,.txt"/>
      </label>
    </div>`;
  }

  if (state.requestCategory === 'other') {
    body += `<div class="bk-section">
      <label class="bk-field">${esc(t('bk.otherLabel'))}
        <textarea id="otherDetails" rows="6" placeholder="${escAttr(t('bk.otherPh'))}">${esc(state.other.details)}</textarea>
      </label>
      ${fieldError(state.errors, 'otherDetails')}
    </div>`;
  }

  return body;
}

function step2(state) {
  const skipLevel = knownLevelFromCategory(state);
  return `<div class="bk-section">
    <h2>${esc(t('bk.s2title'))}</h2>
    <p class="bk-lead">${esc(t('bk.s2lead'))}</p>
    ${skipLevel ? '' : `<h3>${esc(t('bk.describe'))}</h3>
    <div class="bk-options compact">${LEARNER_LEVELS.map((l) => optionRow('currentLevel', l, lbl(l), '', state.learner.currentLevel === l)).join('')}</div>
    ${fieldError(state.errors, 'currentLevel')}`}
    <label class="bk-field">${esc(t('bk.difficult'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
      <textarea id="difficulty" placeholder="${escAttr(t('bk.difficultPh'))}">${esc(state.learner.difficulty)}</textarea>
    </label>
    <label class="bk-field">${esc(t('bk.able'))}
      <textarea id="desiredOutcome" placeholder="${escAttr(t('bk.ablePh'))}"${described(state.errors, 'desiredOutcome')}>${esc(state.learner.desiredOutcome)}</textarea>
    </label>
    ${fieldError(state.errors, 'desiredOutcome')}
  </div>`;
}

function step3(state) {
  const formats = ALLOW_IN_PERSON ? ['Online', 'In person'] : ['Online'];
  return `<div class="bk-section">
    <h2>${esc(t('bk.s3title'))}</h2>
    <h3>${esc(t('bk.support'))}</h3>
    <div class="bk-options compact">${FREQUENCIES.map((f) => optionRow('frequency', f, lbl(f), '', state.lessonPreferences.frequency === f)).join('')}</div>
    ${fieldError(state.errors, 'frequency')}
    <h3>${esc(t('bk.length'))}</h3>
    <div class="bk-chips">${DURATIONS.map((d) => chip('duration', d, d, state.lessonPreferences.duration === d)).join('')}</div>
    ${fieldError(state.errors, 'duration')}
    <h3>${esc(t('bk.format'))}</h3>
    <div class="bk-chips">${formats.map((f) => chip('format', f, lbl(f), state.lessonPreferences.format === f)).join('')}</div>
    ${fieldError(state.errors, 'format')}
    <h3>${esc(t('bk.lessonLang'))}</h3>
    <div class="bk-chips">${['French', 'English'].map((l) => chip('language', l, lbl(l), state.lessonPreferences.language === l)).join('')}</div>
    ${fieldError(state.errors, 'language')}
  </div>`;
}

function step4(state) {
  return `<div class="bk-section">
    <h2>${esc(t('bk.s4title'))}</h2>
    <p class="bk-lead">${esc(t('bk.tz'))} <strong id="tzLabel">${esc(state.availability.timezone)}</strong>
      <button type="button" class="bk-text-btn" id="editTz">${esc(t('bk.change'))}</button>
    </p>
    <label class="bk-field bk-tz-edit" hidden>
      <input type="text" id="timezone" value="${escAttr(state.availability.timezone)}" aria-label="${escAttr(t('bk.tz'))}"/>
    </label>
    <h3>${esc(t('bk.days'))}</h3>
    <div class="bk-chips">${DAYS.map((d) => chip('days', d, lbl(d), state.availability.days.includes(d), true)).join('')}</div>
    ${fieldError(state.errors, 'days')}
    <h3>${esc(t('bk.periods'))}</h3>
    <div class="bk-chips">${PERIODS.map((p) => chip('periods', p, lbl(p), state.availability.periods.includes(p), true)).join('')}</div>
    ${fieldError(state.errors, 'periods')}
    <label class="bk-field">${esc(t('bk.moreSpecific'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
      <textarea id="availDetails" placeholder="${escAttr(t('bk.availPh'))}">${esc(state.availability.details)}</textarea>
    </label>
    <div class="bk-calendar-slot" data-calendar="none" hidden></div>
  </div>`;
}

function step5(state) {
  const needGuardian = MINOR_LEVELS.has(state.education.level) && state.education.under18 === 'yes';
  return `<div class="bk-section">
    <h2>${esc(t('bk.s5title'))}</h2>
    <p class="bk-lead">${esc(t('bk.s5lead'))}</p>
    <div class="bk-grid-2">
      <label class="bk-field">${esc(t('bk.first'))}
        <input type="text" id="firstName" autocomplete="given-name" value="${escAttr(state.contact.firstName)}"${described(state.errors, 'firstName')}/>
        ${fieldError(state.errors, 'firstName')}
      </label>
      <label class="bk-field">${esc(t('bk.last'))}
        <input type="text" id="lastName" autocomplete="family-name" value="${escAttr(state.contact.lastName)}"${described(state.errors, 'lastName')}/>
        ${fieldError(state.errors, 'lastName')}
      </label>
    </div>
    <label class="bk-field">${esc(t('bk.email'))}
      <input type="email" id="email" autocomplete="email" value="${escAttr(state.contact.email)}"${described(state.errors, 'email')}/>
      ${fieldError(state.errors, 'email')}
    </label>
    <div class="bk-grid-2">
      <label class="bk-field">${esc(t('bk.phone'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
        <input type="tel" id="phone" autocomplete="tel" value="${escAttr(state.contact.phone)}"/>
      </label>
      <label class="bk-field">${esc(t('bk.country'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
        <input type="text" id="country" autocomplete="country-name" value="${escAttr(state.contact.country)}"/>
      </label>
    </div>
    <h3>${esc(t('bk.prefContact'))}</h3>
    <div class="bk-chips">${['Email', 'WhatsApp'].map((c) => chip('preferredContact', c, lbl(c), state.contact.preferredContact === c)).join('')}</div>
    ${needGuardian ? `<div class="bk-guardian">
      <h3>${esc(t('bk.guardian'))}</h3>
      <p class="bk-lead">${esc(t('bk.guardianLead'))}</p>
      <label class="bk-field">${esc(t('bk.gName'))}
        <input type="text" id="guardianName" value="${escAttr(state.guardian.name)}"/>
        ${fieldError(state.errors, 'guardianName')}
      </label>
      <label class="bk-field">${esc(t('bk.gEmail'))}
        <input type="email" id="guardianEmail" value="${escAttr(state.guardian.email)}"/>
        ${fieldError(state.errors, 'guardianEmail')}
      </label>
      <label class="bk-field">${esc(t('bk.gPhone'))} <span class="bk-opt">${esc(t('bk.optional'))}</span>
        <input type="tel" id="guardianPhone" value="${escAttr(state.guardian.phone)}"/>
      </label>
    </div>` : ''}
  </div>`;
}

function successView(state, pillars) {
  const p = pillars.find((x) => x.id === (state.learningPath.pillar || state.source.pillar));
  const first = p ? (p.lessons.find((l) => l.id === p.firstLessonId) || p.lessons[0]) : null;
  const showRec = p && !state.source.lessonId && !state.learningPath.lessonId && first;
  return `<section class="bk-success" aria-live="polite">
    <div class="bk-success-mark" aria-hidden="true"><span></span><span></span><span></span><i>✓</i></div>
    <h1>${esc(t('bk.successH'))}</h1>
    <p>${esc(t('bk.successP'))}</p>
    <div class="bk-next">
      <h2>${esc(t('bk.nextH'))}</h2>
      <ol>
        <li>${esc(t('bk.n1'))}</li>
        <li>${esc(t('bk.n2'))}</li>
        <li>${esc(t('bk.n3'))}</li>
      </ol>
    </div>
    <div class="bk-success-actions">
      <a href="/classroom" data-nav class="solid-action">${esc(t('bk.backClass'))} <b>→</b></a>
      ${p ? `<a href="/classroom/learn/${p.id}" data-nav class="bk-ghost">${esc(t('bk.continueP', { name: pillarLabel(pillars, p.id) }))}</a>` : ''}
    </div>
    ${showRec ? `<div class="bk-while">
      <h3>${esc(t('bk.while'))}</h3>
      <p>${esc(t('bk.startWith'))} <strong>${esc(first.title)}</strong></p>
      <a href="/classroom/learn/${p.id}?week=1" data-nav class="bk-link">${esc(t('bk.openLesson'))}</a>
    </div>` : ''}
  </section>`;
}

function collectDomInto(state) {
  const q = (id) => document.getElementById(id);
  if (q('lessonQuery')) {
    state.learningPath.lessonQuery = q('lessonQuery').value;
    const pillar = storePillars().find((p) => p.id === state.learningPath.pillar);
    const match = pillar?.lessons.find((l) => l.short === q('lessonQuery').value || l.title === q('lessonQuery').value);
    if (match) {
      state.learningPath.lessonId = match.id;
      state.learningPath.week = String(match.week);
    }
  }
  if (q('eduTopic')) state.education.topic = q('eduTopic').value;
  if (q('fleDetails')) state.fle.details = q('fleDetails').value;
  if (q('projectTitle')) state.project.title = q('projectTitle').value;
  if (q('projectDeadline')) state.project.deadline = q('projectDeadline').value;
  if (q('projectDescription')) state.project.description = q('projectDescription').value;
  if (q('otherDetails')) state.other.details = q('otherDetails').value;
  if (q('difficulty')) state.learner.difficulty = q('difficulty').value;
  if (q('desiredOutcome')) state.learner.desiredOutcome = q('desiredOutcome').value;
  if (q('availDetails')) state.availability.details = q('availDetails').value;
  if (q('timezone')) state.availability.timezone = q('timezone').value;
  if (q('firstName')) state.contact.firstName = q('firstName').value;
  if (q('lastName')) state.contact.lastName = q('lastName').value;
  if (q('email')) state.contact.email = q('email').value;
  if (q('phone')) state.contact.phone = q('phone').value;
  if (q('country')) state.contact.country = q('country').value;
  if (q('guardianName')) state.guardian.name = q('guardianName').value;
  if (q('guardianEmail')) state.guardian.email = q('guardianEmail').value;
  if (q('guardianPhone')) state.guardian.phone = q('guardianPhone').value;
  const files = q('eduFiles') || q('projectFiles');
  if (files?.files?.length) {
    state.attachments = [...files.files].map((f) => ({ name: f.name, type: f.type, size: f.size }));
  }
}

let _pillars = [];
function storePillars() { return _pillars; }

export function createBookALesson({ app, nav, icon, pillars, navigate }) {
  _pillars = pillars;
  let state = applyUrlPrefill(loadDraft() || defaultState(), pillars);
  if (state.requestCategory === 'fle' && !state.lessonPreferences.language) {
    state.lessonPreferences.language = 'French';
  }

  function setRadio(name, value) {
    if (name === 'requestCategory') {
      state.requestCategory = value;
      if (value === 'fle') state.lessonPreferences.language = 'French';
    }
    if (name === 'pillar') {
      state.learningPath.pillar = value;
      state.learningPath.lessonId = '';
      state.learningPath.week = '';
      state.learningPath.lessonQuery = '';
      state.source.pillar = value;
    }
    if (name === 'pathGoal') state.learningPath.goal = value;
    if (name === 'eduLevel') state.education.level = value;
    if (name === 'eduSubject') state.education.subject = value;
    if (name === 'eduGoal') state.education.goal = value;
    if (name === 'under18') state.education.under18 = value;
    if (name === 'fleLevel') state.fle.level = value;
    if (name === 'fleObjective') state.fle.objective = value;
    if (name === 'supportLanguage') state.fle.supportLanguage = value;
    if (name === 'projectType') state.project.type = value;
    if (name === 'currentLevel') state.learner.currentLevel = value;
    if (name === 'frequency') state.lessonPreferences.frequency = value;
    if (name === 'duration') state.lessonPreferences.duration = value;
    if (name === 'format') state.lessonPreferences.format = value;
    if (name === 'language') state.lessonPreferences.language = value;
    if (name === 'preferredContact') state.contact.preferredContact = value;
  }

  function toggleMulti(name, value, checked) {
    const arr = name === 'days' ? state.availability.days : state.availability.periods;
    if (checked) {
      if (!arr.includes(value)) arr.push(value);
    } else {
      const i = arr.indexOf(value);
      if (i >= 0) arr.splice(i, 1);
    }
  }

  async function submit() {
    const payload = buildPayload(state);
    payload.status = 'submitted';
    const res = await fetch('/api/lesson-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      state.errors = { submit: data.error || t('bk.err.submit') };
      render();
      return;
    }
    clearDraft();
    state.submitted = true;
    state.requestId = data.requestId;
    window.dispatchEvent(new CustomEvent('na:booking-ready', { detail: { ...payload, id: data.requestId, status: 'submitted' } }));
    render();
  }

  function render() {
    document.body.className = 'page-booking';
    if (state.submitted) {
      app.innerHTML = `${nav('booking')}<main class="booking-page bk-page">${successView(state, pillars)}</main>`;
      return;
    }

    const body =
      state.step === 1 ? step1(state, pillars) :
      state.step === 2 ? step2(state) :
      state.step === 3 ? step3(state) :
      state.step === 4 ? step4(state) :
      step5(state);

    app.innerHTML = `${nav('booking')}
    <main class="booking-page bk-page">
      <section class="bk-hero">
        <div class="bk-hero-copy">
          <div class="eyebrow dark">${esc(t('bk.contactKicker'))}</div>
          <h1>${esc(t('bk.title'))}</h1>
          <p class="bk-sub">${esc(t('bk.sub'))}</p>
          <p>${esc(t('bk.intro'))}</p>
        </div>
        <div class="bk-hero-photo" aria-hidden="true"><img src="${ASSET_BASE}/assets/teaching-hero.png" alt=""/></div>
      </section>
      ${renderStepper(state)}
      <button type="button" class="bk-mobile-summary" id="toggleSummary" aria-expanded="${state.summaryOpen}" aria-controls="request-summary">${esc(t('bk.summaryMobile'))}</button>
      <div class="bk-layout ${state.summaryOpen ? 'summary-open' : ''}">
        <form class="bk-form" id="lessonRequestForm" novalidate>
          <div class="bk-panel" key="${state.step}">${body}</div>
          ${state.errors.submit ? `<p class="bk-error">${esc(state.errors.submit)}</p>` : ''}
          <div class="bk-nav">
            ${state.step > 1 ? `<button type="button" class="bk-ghost" id="bkBack">${esc(t('bk.back'))}</button>` : `<span></span>`}
            <button type="submit" class="continue-action" id="bkNext">
              ${state.step < 5 ? `${esc(t('bk.continue'))} <b>→</b>` : `${esc(t('bk.send'))} <b>→</b>`}
            </button>
          </div>
        </form>
        ${renderSummary(state, pillars)}
      </div>
    </main>`;

    wire();
  }

  function wire() {
    const form = document.getElementById('lessonRequestForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      collectDomInto(state);
      state.errors = validateStep(state);
      if (Object.keys(state.errors).length) {
        render();
        const first = document.querySelector('.bk-error');
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (state.step < 5) {
        state.step += 1;
        saveDraft(state);
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      await submit();
    });

    document.getElementById('bkBack')?.addEventListener('click', () => {
      collectDomInto(state);
      state.step = Math.max(1, state.step - 1);
      state.errors = {};
      saveDraft(state);
      render();
    });

    document.getElementById('toggleSummary')?.addEventListener('click', () => {
      state.summaryOpen = !state.summaryOpen;
      render();
    });

    document.getElementById('lessonRequestForm')?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.summaryOpen) {
        state.summaryOpen = false;
        render();
      }
    });

    document.querySelector('[data-clear-prefill]')?.addEventListener('click', () => {
      state.source.pillar = '';
      state.source.week = '';
      state.source.lessonId = '';
      state.learningPath.pillar = '';
      state.learningPath.week = '';
      state.learningPath.lessonId = '';
      setClassroomLocation('/classroom/book-a-lesson', { replace: true });
      render();
    });

    document.getElementById('editTz')?.addEventListener('click', () => {
      document.querySelector('.bk-tz-edit')?.removeAttribute('hidden');
    });

    document.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener('change', () => {
        setRadio(input.name, input.value);
        state.errors = {};
        saveDraft(state);
        render();
      });
    });

    document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.addEventListener('change', () => {
        toggleMulti(input.name, input.value, input.checked);
        state.errors = {};
        saveDraft(state);
        render();
      });
    });

    ['lessonQuery', 'eduTopic', 'fleDetails', 'projectTitle', 'projectDeadline', 'projectDescription',
      'otherDetails', 'difficulty', 'desiredOutcome', 'availDetails', 'timezone',
      'firstName', 'lastName', 'email', 'phone', 'country', 'guardianName', 'guardianEmail', 'guardianPhone',
      'eduFiles', 'projectFiles'
    ].forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener('input', () => {
        collectDomInto(state);
        saveDraft(state);
      });
      el?.addEventListener('change', () => {
        collectDomInto(state);
        saveDraft(state);
      });
    });
  }

  render();
}
