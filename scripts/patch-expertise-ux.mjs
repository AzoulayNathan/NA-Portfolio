import fs from 'fs';

const appPath = 'public/expertise/assets/js/app.js';
let app = fs.readFileSync(appPath, 'utf8');

// Remove hub footer block ("View full profile")
app = app.replace(
  /\s*<footer class="hub-footer">[\s\S]*?<\/footer>/,
  '',
);

// Sidebar always starts collapsed; hover expands (no persisted click state)
app = app.replace(
  /function sidebar\(field\)\{\s*const collapsed=localStorage\.getItem\('na-sidebar-collapsed'\)==='1';\s*return `<aside class="field-sidebar \$\{collapsed\?'is-collapsed':''\}" data-sidebar>/,
  `function sidebar(field){
    return \`<aside class="field-sidebar is-collapsed" data-sidebar>`,
);

app = app.replace(
  '${icon(collapsed?\'arrow\':\'back\')}',
  "${icon('arrow')}",
);

app = app.replace(
  '<div class="sidebar-meta"><span>${icon(\'pin\')} France</span>',
  '<div class="sidebar-meta"><span>${icon(\'pin\')} Europe</span>',
);

// Replace sidebar toggle click with hover expand/collapse
const oldSidebarBind = `const sidebar=document.querySelector('[data-sidebar]');
    const toggle=document.querySelector('[data-sidebar-toggle]');
    if(sidebar&&toggle){
      toggle.addEventListener('click',()=>{
        sidebar.classList.toggle('is-collapsed');
        localStorage.setItem('na-sidebar-collapsed',sidebar.classList.contains('is-collapsed')?'1':'0');
      });
    }`;

const newSidebarBind = `const sidebar=document.querySelector('[data-sidebar]');
    if(sidebar){
      const collapse=()=>sidebar.classList.add('is-collapsed');
      const expand=()=>sidebar.classList.remove('is-collapsed');
      collapse();
      sidebar.addEventListener('mouseenter',expand);
      sidebar.addEventListener('mouseleave',collapse);
      sidebar.addEventListener('focusin',expand);
      sidebar.addEventListener('focusout',(e)=>{
        if(!sidebar.contains(e.relatedTarget)) collapse();
      });
      const toggle=document.querySelector('[data-sidebar-toggle]');
      if(toggle){
        toggle.addEventListener('click',()=>{
          if(window.matchMedia('(max-width:980px)').matches){
            sidebar.classList.toggle('mobile-open');
          } else {
            sidebar.classList.toggle('is-collapsed');
          }
        });
      }
    }`;

if (!app.includes(oldSidebarBind)) {
  // try looser match if whitespace differs
  if (!app.includes("localStorage.setItem('na-sidebar-collapsed'")) {
    console.warn('sidebar bind already patched or missing');
  } else {
    app = app.replace(
      /const sidebar=document\.querySelector\('\[data-sidebar\]'\);\s*const toggle=document\.querySelector\('\[data-sidebar-toggle\]'\);\s*if\(sidebar&&toggle\)\{\s*toggle\.addEventListener\('click',\(\)=>\{\s*sidebar\.classList\.toggle\('is-collapsed'\);\s*localStorage\.setItem\('na-sidebar-collapsed',sidebar\.classList\.contains\('is-collapsed'\)\?'1':'0'\);\s*\}\);\s*\}/,
      newSidebarBind,
    );
  }
} else {
  app = app.replace(oldSidebarBind, newSidebarBind);
}

// Forward scroll to parent for SiteNav color change
if (!app.includes('na-expertise-scroll')) {
  const scrollHook = `
  function bindScrollRelay(){
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
`;
  app = app.replace(
    "function bindAll(){",
    scrollHook + "\n  function bindAll(){\n    bindScrollRelay();",
  );
}

fs.writeFileSync(appPath, app);

// data.js France -> Europe
const dataPath = 'public/expertise/assets/js/data.js';
let data = fs.readFileSync(dataPath, 'utf8');
data = data.replace('base: "France"', 'base: "Europe"');
fs.writeFileSync(dataPath, data);

// CSS: hide hub-footer if leftover, hide desktop toggle (hover handles it)
const cssPath = 'public/expertise/assets/css/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('/* hover sidebar */')) {
  css += `
/* hover sidebar */
@media (min-width:981px){
  .field-sidebar .sidebar-toggle{display:none!important}
  .field-sidebar.is-collapsed:hover{width:278px}
  .field-sidebar.is-collapsed:hover .sidebar-logo small,
  .field-sidebar.is-collapsed:hover .overview-link span,
  .field-sidebar.is-collapsed:hover .sidebar-label,
  .field-sidebar.is-collapsed:hover .field-nav-index,
  .field-sidebar.is-collapsed:hover .field-nav-name,
  .field-sidebar.is-collapsed:hover .sidebar-profile div,
  .field-sidebar.is-collapsed:hover .sidebar-meta,
  .field-sidebar.is-collapsed:hover .sidebar-links{display:revert}
  .field-sidebar.is-collapsed:hover .sidebar-meta{display:flex}
  .field-sidebar.is-collapsed:hover .sidebar-links{display:flex}
  .field-sidebar.is-collapsed:hover .sidebar-head{display:flex;justify-content:space-between}
  .field-sidebar.is-collapsed:hover~.profile-stage{margin-left:278px}
}
.hub-footer{display:none!important}
`;
}
fs.writeFileSync(cssPath, css);

console.log('patched expertise UX');
console.log('hub-footer removed', !fs.readFileSync(appPath,'utf8').includes('View full profile'));
console.log('Europe', fs.readFileSync(dataPath,'utf8').includes('base: "Europe"'));
console.log('scroll relay', fs.readFileSync(appPath,'utf8').includes('na-expertise-scroll'));
