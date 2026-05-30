/**
 * Liste unique des projets — archives + carousels home.
 * Les champs textuels traduits (meta, pitch, b1, b2) vivent dans `src/lib/i18n.jsx`
 * sous des cles `projects_<slug_underscored>_*`.
 * Le slug est calcule via `projectSlug(title)` depuis `src/lib/utils.js`,
 * puis les tirets sont remplaces par des underscores pour former la cle i18n.
 * Les libellés de preuve (GitHub / PDF) utilisent `projects_proof_*` dans i18n.jsx.
 */
export const PROJECTS = [
  {
    title: 'FLE Compass',
    stack: ['React', 'Vite', 'Tailwind', 'Supabase'], categories: ['Professional', 'Web', 'Education'],
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6e4247?w=900&q=80', year: '2026',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/FLECompass_FLEDiagnostic',
  },
  {
    title: 'Side A / Side B',
    stack: ['React', 'Vite', 'Tailwind', 'Framer Motion'], categories: ['Personal', 'Web', 'Research'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=80', year: '2026',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/SideASound_VoiceSetup',
  },
  {
    title: 'Patch Your Path',
    stack: ['React', 'Vite', 'Tailwind', 'Product'], categories: ['Personal', 'Web'],
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=900&q=80', year: '2026',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/PatchYourPath_SignalApp',
  },
  {
    title: 'Reach',
    stack: ['Python', 'Scraping', 'Automation', 'B2B'], categories: ['Professional', 'Automation', 'Web', 'Data'],
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80', year: '2025',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/Reach_LC_Paper_B2B',
  },
  {
    title: 'Local Lead OS',
    stack: ['Python', 'Selenium', 'Scraping', 'Automation'], categories: ['Professional', 'Automation', 'Data', 'Web'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80', year: '2025',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/LocalLeadOS_Scrap',
  },
  {
    title: 'Questline',
    stack: ['Product Design', 'Web', 'Automation'], categories: ['Personal', 'Web'],
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=900&q=80', year: '2025',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/Questline_GamifiedDiscipline',
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
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/DilemmaRoyale_Mobile',
  },
  {
    title: 'ML for Insurance Reserving',
    stack: ['Python', 'ML', 'Insurance'], categories: ['School', 'AI', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80', year: '2024',
    proof_type: 'pdf', proof_url: '/projects/ml-for-insurance-reserving/ml-for-insurance-reserving.pdf',
  },
  {
    title: 'Black–Scholes Lab',
    stack: ['Python', 'R', 'Finance'], categories: ['School', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=900&q=80', year: '2023',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/BlackScholesLab_StochasticCalculus',
  },
  {
    title: 'Brent 2023 Econometric Study',
    stack: ['R', 'Econometrics', 'Data'], categories: ['School', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=900&q=80', year: '2023',
    proof_type: 'pdf', proof_url: '/projects/brent-2023-econometric-study/brent-2023-econometric-study.pdf',
  },
  {
    title: 'DominoCalc',
    stack: ['Python', 'Probability'], categories: ['Personal', 'Data', 'Game'],
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=900&q=80', year: '2023',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/DominoCalc_Probability',
  },
  {
    title: 'Blackpot',
    stack: ['Python', 'Probability'], categories: ['Personal', 'Data', 'Game'],
    image: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=900&q=80', year: '2023',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/Blackpot_BlackjackProba',
  },
  {
    title: 'Connect4 Edge',
    stack: ['React', 'Vite', 'Tailwind', 'Game Logic'], categories: ['Personal', 'AI', 'Game', 'Web'],
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=900&q=80', year: '2023',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/Connect4Edge_FunOracle',
  },
  {
    title: 'YTBX',
    stack: ['Video', 'Automation', 'Editing', 'Export'], categories: ['Personal', 'Automation', 'Web'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=900&q=80', year: '2025',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/YTBX_VideoExtractPipeline',
  },
  {
    title: 'Peerless',
    stack: ['React', 'Web'], categories: ['Personal', 'Web'],
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=900&q=80', year: '2024',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/Peerless_TierList',
  },
  {
    title: 'Atlas of Echoes',
    stack: ['React', 'Data', 'Web'], categories: ['Personal', 'Data', 'Web'],
    image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900&q=80', year: '2024',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/AtlasOfEchoes_CultureExplorer',
  },
  {
    title: 'Navier–Stokes 2D Lab',
    stack: ['Python', 'NumPy', 'Scientific computing'], categories: ['School', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80', year: '2024',
    proof_type: 'pdf', proof_url: '/projects/navier-stokes-2d-lab/navier-stokes-2d-lab.pdf',
  },
  {
    title: 'Airtable Supabase ETL',
    stack: ['Python', 'Pandas', 'Automation'], categories: ['School', 'Data', 'Automation'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80', year: '2024',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/School_ETL_Airtable_Supabase',
  },
  {
    title: 'Light Speed Cinema Analytics',
    stack: ['Python', 'Pandas', 'Data'], categories: ['School', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=80', year: '2024',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/CinemaConcessions_DataViz',
  },
  {
    title: 'Big Data CNN Lab',
    stack: ['Python', 'PyTorch', 'AI'], categories: ['School', 'AI', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80', year: '2024',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/BigData_CNN_ImageClassification',
  },
  {
    title: 'MNIST SVM Classifier',
    stack: ['Python', 'Scikit-learn', 'ML'], categories: ['School', 'AI', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80', year: '2024',
    proof_type: 'github', proof_url: 'https://github.com/AzoulayNathan/MNIST_SVM_OneVsAll',
  },
];

const _carouselMid = Math.ceil(PROJECTS.length / 2);
export const CAROUSEL_PROJECTS_A = PROJECTS.slice(0, _carouselMid);
export const CAROUSEL_PROJECTS_B = PROJECTS.slice(_carouselMid);
