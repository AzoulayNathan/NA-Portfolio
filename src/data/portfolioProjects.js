/** Liste unique des projets — archives + carousels home (12 sans doublon). */
export const PROJECTS = [
  {
    title: 'Reach', meta: 'Outreach Intelligence Platform',
    pitch: 'A structured outreach platform designed to identify, qualify and contact potential collaborators, suppliers or clients with minimal manual effort.',
    bullets: ['Combines lead discovery, structured contact data and automated outreach logic', 'Built around a real use case for LC Paper Girona'],
    stack: ['Python', 'Scraping', 'Automation', 'B2B'], categories: ['Professional', 'Automation', 'Web', 'Data'],
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80', year: '2025',
  },
  {
    title: 'Questline', meta: 'Gamified Discipline System',
    pitch: 'A discipline and task system that turns personal execution into a motivating loop through streaks, progress, journaling and measurable outcomes.',
    bullets: ['Combines task management, habit momentum and personal tracking', 'Designed as a motivating system rather than a static productivity app'],
    stack: ['Product Design', 'Web', 'Automation'], categories: ['Personal', 'Web'],
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=900&q=80', year: '2025',
  },
  {
    title: 'Onepager Studio', meta: 'Structured Site Generation System',
    pitch: 'A structured system for generating clean, premium one-page websites from clear inputs and reusable logic.',
    bullets: ['Focused on transforming structured inputs into usable web outputs', 'Combines content logic, generation flow and front-end quality'],
    stack: ['React', 'Automation', 'Generation'], categories: ['Personal', 'Web', 'Automation'],
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80', year: '2025',
  },
  {
    title: 'RL Crypto Trader', meta: 'Reinforcement Learning / Trading',
    pitch: 'A trading project exploring reinforcement learning, technical analysis and automated decision-making in crypto environments.',
    bullets: ['Combines market analysis with learning-based strategy experimentation', 'Built to test how autonomous agents behave under trading constraints'],
    stack: ['Python', 'RL', 'Data'], categories: ['Personal', 'AI', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=80', year: '2024',
  },
  {
    title: 'TheoForge', meta: 'Verified-Source Summarization Engine',
    pitch: 'A research assistant that extracts sources, verifies material and builds clean summaries around a given topic.',
    bullets: ['Structured around verified sources before synthesis', 'Designed to reduce noise and improve traceability'],
    stack: ['AI', 'Research', 'Python'], categories: ['Personal', 'AI', 'Research'],
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900&q=80', year: '2025',
  },
  {
    title: 'LiliBot', meta: 'LinkedIn Application Automation Bot',
    pitch: 'A job application bot designed to automate parts of the LinkedIn application process while keeping the workflow structured and trackable.',
    bullets: ['Built around repeatable application logic and answer reuse', 'Focused on speed, consistency and automation quality'],
    stack: ['Playwright', 'Python', 'Automation'], categories: ['Personal', 'Automation', 'Web', 'AI'],
    image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=900&q=80', year: '2024',
  },
  {
    title: 'Dilemma Royale', meta: 'Game Theory / Simulation',
    pitch: "An interactive game theory app built around the iterated prisoner's dilemma, with agent profiles, strategy tuning and replayable simulations.",
    bullets: ['Turns an abstract theory problem into a more visual and playable system', 'Designed to explore strategies, tension and emergent behavior'],
    stack: ['React', 'Web', 'Research'], categories: ['Personal', 'Web', 'Research', 'Game'],
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&q=80', year: '2025',
  },
  {
    title: 'ML for Insurance Reserving', meta: 'Thesis / Machine Learning',
    pitch: 'A thesis exploring the application of machine learning methods to insurance reserving and provisioning problems.',
    bullets: ['Connects predictive modelling with a concrete actuarial context', 'Bridges analytical rigor and practical business use'],
    stack: ['Python', 'ML', 'Insurance'], categories: ['School', 'AI', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80', year: '2024',
  },
  {
    title: 'Black–Scholes Lab', meta: 'Finance / Option Pricing',
    pitch: 'A school project exploring Black–Scholes logic, market assumptions and trading-oriented interpretation.',
    bullets: ['Focused on financial modelling and pricing logic', 'Built as a bridge between theory and application'],
    stack: ['Python', 'R', 'Finance'], categories: ['School', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=900&q=80', year: '2023',
  },
  {
    title: 'Brent 2023 Econometric Study', meta: 'Econometrics / Oil Markets',
    pitch: 'An econometric analysis of Brent oil dynamics in 2023 through a structured data and modelling approach.',
    bullets: ['Focused on real market behavior and analytical interpretation', 'Built as a concrete applied-econometrics case'],
    stack: ['R', 'Econometrics', 'Data'], categories: ['School', 'Data', 'Research'],
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=900&q=80', year: '2023',
  },
  {
    title: 'DominoCalc', meta: 'Probability / Game Logic',
    pitch: 'A fun prediction tool that estimates the best domino move through probability and decision logic.',
    bullets: ['Built around probability-based move evaluation', 'Designed as a lightweight strategy assistant'],
    stack: ['Python', 'Probability'], categories: ['Personal', 'Data', 'Game'],
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=900&q=80', year: '2023',
  },
  {
    title: 'Blackpot', meta: 'Blackjack Decision Assistant',
    pitch: 'A blackjack helper exploring live decision support through probabilities and best-move logic.',
    bullets: ['Focused on decision quality under uncertainty', 'Built as a clean and playful probability tool'],
    stack: ['Python', 'Probability'], categories: ['Personal', 'Data', 'Game'],
    image: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=900&q=80', year: '2023',
  },
  {
    title: 'Connect4 Edge', meta: 'AI / Game Predictor',
    pitch: 'A Connect Four predictor that evaluates positions and suggests the strongest move using probability and game logic.',
    bullets: ['Built to make move quality visible in real time', 'Turns a classic game into a readable decision engine'],
    stack: ['Python', 'AI', 'Game Logic'], categories: ['Personal', 'AI', 'Game'],
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=900&q=80', year: '2023',
  },
  {
    title: 'YTBX', meta: 'YouTube Extract & Recut Tool',
    pitch: 'A lightweight tool to extract video segments, apply simple automated edits, and export ready-to-use clips with minimal manual work.',
    bullets: ['Built for fast extraction, light editing and export-ready output.', 'Focused on simple workflow automation rather than heavy editing complexity.'],
    stack: ['Video', 'Automation', 'Editing', 'Export'], categories: ['Personal', 'Automation', 'Web'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=900&q=80', year: '2025',
  },
  {
    title: 'Peerless', meta: 'Tier List Playground',
    pitch: 'A playful tier-list app designed to rank anything quickly, visually and with a bit more personality than a generic list tool.',
    bullets: ['Built as a lightweight ranking playground', 'Focused on speed, clarity and fun interaction'],
    stack: ['React', 'Web'], categories: ['Personal', 'Web'],
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=900&q=80', year: '2024',
  },
  {
    title: 'Atlas of Echoes', meta: 'Geography / Culture Explorer',
    pitch: 'An exploration app centered on countries, flags and cultural discovery through a more playful and visual interface.',
    bullets: ['Built as an exploratory world interface', 'Mixes learning, browsing and visual discovery'],
    stack: ['React', 'Data', 'Web'], categories: ['Personal', 'Data', 'Web'],
    image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900&q=80', year: '2024',
  },
];

/** Deux carousels home : 6 + 6 sans chevauchement. */
export const CAROUSEL_PROJECTS_A = PROJECTS.slice(0, 6);
export const CAROUSEL_PROJECTS_B = PROJECTS.slice(6, 12);
