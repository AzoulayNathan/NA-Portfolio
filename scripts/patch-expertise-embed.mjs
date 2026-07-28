import fs from 'fs';

const appPath = 'public/expertise/assets/js/app.js';
let app = fs.readFileSync(appPath, 'utf8');

const topNavRe = /function topNav\(\{dark=false,field=null\}=\{\}\)\{[\s\S]*?return `<header class="site-nav[\s\S]*?<\/header>`;\s*\}/;
if (!topNavRe.test(app)) throw new Error('topNav not found');
app = app.replace(topNavRe, "function topNav(){ return ''; }");

app = app.replace(
  '<a class="sidebar-logo" href="${esc(CONFIG.naStudioHome)}">',
  '<a class="sidebar-logo" href="${esc(CONFIG.naStudioHome)}" target="_top">',
);

if (!app.includes('na-expertise-route')) {
  const marker = "if(!initial) window.scrollTo({top:0,behavior:'instant'});\n    lastRoute=path;";
  if (!app.includes(marker)) throw new Error('render marker not found');
  app = app.replace(
    marker,
    `if(!initial) window.scrollTo({top:0,behavior:'instant'});
    lastRoute=path;
    try {
      const qs=Object.fromEntries(params.entries());
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type:'na-expertise-route', path, params: qs }, '*');
      }
    } catch (e) {}`,
  );
}

fs.writeFileSync(appPath, app);

const cssPath = 'public/expertise/assets/css/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('/* NA Studio embed */')) {
  css = `/* NA Studio embed — SiteNav from NA-Portfolio replaces local navbar */
.site-nav,.mobile-nav-button{display:none!important}
` + css;
}
css = css.replace(
  '.expertise-hub{--hub-accent:#8d8a54;min-height:100vh;position:relative;padding:116px max(6vw,48px) 42px;',
  '.expertise-hub{--hub-accent:#8d8a54;min-height:100vh;position:relative;padding:42px max(6vw,48px) 42px;',
);
css = css.replace('.expertise-hub{padding:92px 14px 25px}', '.expertise-hub{padding:28px 14px 25px}');
fs.writeFileSync(cssPath, css);

fs.writeFileSync(
  'public/expertise/assets/js/config.js',
  `window.NA_CONFIG = {
  contactEmail: "nathanazoulay.pro@gmail.com",
  formspreeEndpoint: "",
  linkedIn: "https://www.linkedin.com/in/nathan-azoulay-0719b4207",
  github: "https://github.com/AzoulayNathan",
  naStudioHome: "/",
  workUrl: "/projects",
  aboutUrl: "/experience",
  cvUrl: "documents/Nathan-Azoulay-CV.pdf",
  embedInNaStudio: true
};
`,
);

console.log('NA Studio expertise embed ready');
