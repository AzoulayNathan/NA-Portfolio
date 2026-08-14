/** Inline cover art — always renders (no external asset dependency). */
export default function FormulaBuilderCoverArt({ className = '', compact = false }) {
  return (
    <svg
      className={className}
      viewBox={compact ? '0 0 400 280' : '0 0 900 520'}
      role="img"
      aria-label="Formula Builder"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="fb-art-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F6F3ED" />
          <stop offset="45%" stopColor="#E8DFC9" />
          <stop offset="100%" stopColor="#c8ddd6" />
        </linearGradient>
        <linearGradient id="fb-art-panel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#fb-art-bg)" />
      <circle cx={compact ? 340 : 760} cy={compact ? 48 : 88} r={compact ? 70 : 118} fill="#AFC8D1" fillOpacity="0.38" />
      <circle cx={compact ? 48 : 110} cy={compact ? 230 : 430} r={compact ? 52 : 88} fill="#3F5A4F" fillOpacity="0.07" />

      <rect
        x={compact ? 24 : 52}
        y={compact ? 24 : 48}
        width={compact ? 352 : 796}
        height={compact ? 232 : 424}
        rx={compact ? 10 : 14}
        fill="url(#fb-art-panel)"
        stroke="#3F5A4F"
        strokeOpacity="0.24"
        strokeWidth="1.5"
      />

      <text
        x={compact ? 44 : 84}
        y={compact ? 68 : 118}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={compact ? 26 : 42}
        fontWeight="500"
        fill="#1A1A18"
      >
        Formula Builder
      </text>
      <text
        x={compact ? 44 : 84}
        y={compact ? 96 : 156}
        fontFamily="system-ui, sans-serif"
        fontSize={compact ? 11 : 14}
        fill="#3F5A4F"
        fillOpacity="0.82"
      >
        Understand · build · test · practice
      </text>

      <g fontFamily="ui-monospace, monospace" fill="#3F5A4F">
        <text x={compact ? 44 : 100} y={compact ? 148 : 268} fontSize={compact ? 22 : 34}>
          v = d / t
        </text>
        <text x={compact ? 44 : 100} y={compact ? 178 : 318} fontSize={compact ? 16 : 26} fill="#5a7a6a">
          x&#772; = &#931;x / n
        </text>
        <text x={compact ? 44 : 100} y={compact ? 204 : 358} fontSize={compact ? 16 : 26} fill="#5a7a6a">
          A = &#960;r&#178;
        </text>
      </g>

      <g transform={compact ? 'translate(44, 218)' : 'translate(100, 388)'}>
        {[0, 18, 36, 54, 72].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={28 - [10, 16, 12, 20, 8][i]}
            width={12}
            height={[18, 24, 20, 28, 16][i]}
            rx={2}
            fill={i === 3 ? '#B5523B' : '#3F5A4F'}
            fillOpacity={i === 3 ? 0.55 : 0.35 + i * 0.05}
          />
        ))}
      </g>

      {!compact && (
        <g>
          <rect x="500" y="228" width="320" height="168" rx="10" fill="#3F5A4F" fillOpacity="0.08" stroke="#3F5A4F" strokeOpacity="0.18" />
          <text x="524" y="262" fontFamily="system-ui, sans-serif" fontSize="13" fill="#1F3D33" fontWeight="600">
            Live builder
          </text>
          <text x="524" y="298" fontFamily="ui-monospace, monospace" fontSize="24" fill="#1A1A18">
            v = 12 m/s
          </text>
          <text x="524" y="328" fontFamily="system-ui, sans-serif" fontSize="12" fill="#1A1A18" fillOpacity="0.65">
            d = 60 m · t = 5 s
          </text>
          <rect x="524" y="372" width="88" height="6" rx="3" fill="#3F5A4F" fillOpacity="0.25" />
          <rect x="524" y="372" width="58" height="6" rx="3" fill="#B5523B" fillOpacity="0.55" />
        </g>
      )}

      <text
        x={compact ? 44 : 84}
        y={compact ? 258 : 478}
        fontFamily="system-ui, sans-serif"
        fontSize={compact ? 9 : 12}
        fill="#3F5A4F"
        fillOpacity="0.55"
      >
        na-formula-builder.pages.dev
      </text>
    </svg>
  );
}

export function isFormulaBuilderProject(project) {
  if (!project) return false;
  return (
    project.slug === 'formula-builder' ||
    project.title === 'Formula Builder' ||
    project.image?.includes('formula-builder')
  );
}

export function isFormulaBuilderToolId(id) {
  return id === 'formula-builder';
}
