/**
 * Liste unique des projets — archives + carousels home.
 * Les champs textuels traduits (meta, pitch, b1, b2) vivent dans `src/lib/i18n.jsx`
 * sous des cles `projects_<slug_underscored>_*`.
 * Le slug est calcule via `projectSlug(title)` depuis `src/lib/utils.js`,
 * puis les tirets sont remplaces par des underscores pour former la cle i18n.
 */
export const PROJECTS = [
  {
    title: 'Reach',
    stack: ['Python', 'Scraping', 'Automation', 'B2B'], categories: ['Professional', 'Automation', 'Web', 'Data'],
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80', year: '2025',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/Reach_LC_Paper_B2B', cta_label: 'View code',
  },
  {
    title: 'Questline',
    stack: ['Product Design', 'Web', 'Automation'], categories: ['Personal', 'Web'],
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=900&q=80', year: '2025',
  },
  {
    title: 'Onepager Studio',
    stack: ['React', 'Automation', 'Generation'], categories: ['Personal', 'Web', 'Automation'],
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80', year: '2025',
  },
  {
    title: 'RL Crypto Trader',
    stack: ['Python', 'RL', 'Data'], categories: ['Personal', 'AI', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80', year: '2024',
  },
  {
    title: 'LiliBot',
    stack: ['Playwright', 'Python', 'Automation'], categories: ['Personal', 'Automation', 'Web', 'AI'],
    image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=900&q=80', year: '2024',
  },
  {
    title: 'Dilemma Royale',
    stack: ['React', 'Web', 'Research'], categories: ['Personal', 'Web', 'Research', 'Game'],
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&q=80', year: '2025',
  },
  {
    title: 'ML for Insurance Reserving',
    stack: ['Python', 'ML', 'Insurance'], categories: ['School', 'AI', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80', year: '2024',
    proof_type: 'pdf', proof_url: '/projects/ml-for-insurance-reserving/ml-for-insurance-reserving.pdf', cta_label: 'View PDF',
  },
  {
    title: 'Black–Scholes Lab',
    stack: ['Python', 'R', 'Finance'], categories: ['School', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=900&q=80', year: '2023',
  },
  {
    title: 'Brent 2023 Econometric Study',
    stack: ['R', 'Econometrics', 'Data'], categories: ['School', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=900&q=80', year: '2023',
    proof_type: 'pdf', proof_url: '/projects/brent-2023-econometric-study/brent-2023-econometric-study.pdf', cta_label: 'View PDF',
  },
  {
    title: 'DominoCalc',
    stack: ['Python', 'Probability'], categories: ['Personal', 'Data', 'Game'],
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=900&q=80', year: '2023',
  },
  {
    title: 'Blackpot',
    stack: ['Python', 'Probability'], categories: ['Personal', 'Data', 'Game'],
    image: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=900&q=80', year: '2023',
  },
  {
    title: 'Connect4 Edge',
    stack: ['Python', 'AI', 'Game Logic'], categories: ['Personal', 'AI', 'Game'],
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=900&q=80', year: '2023',
  },
  {
    title: 'YTBX',
    stack: ['Video', 'Automation', 'Editing', 'Export'], categories: ['Personal', 'Automation', 'Web'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=900&q=80', year: '2025',
  },
  {
    title: 'Peerless',
    stack: ['React', 'Web'], categories: ['Personal', 'Web'],
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=900&q=80', year: '2024',
  },
  {
    title: 'Atlas of Echoes',
    stack: ['React', 'Data', 'Web'], categories: ['Personal', 'Data', 'Web'],
    image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900&q=80', year: '2024',
  },
];

/** Deux carousels home : 6 + 6 sans chevauchement. */
export const CAROUSEL_PROJECTS_A = PROJECTS.slice(0, 6);
export const CAROUSEL_PROJECTS_B = PROJECTS.slice(6, 12);
