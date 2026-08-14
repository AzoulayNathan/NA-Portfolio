import FormulaBuilderCoverArt from '@/components/projects/FormulaBuilderCoverArt';

/** Local /projects/* SVG covers — avoid photo overlays that wash out light artwork. */
export function isLocalPortfolioAsset(src) {
  return typeof src === 'string' && src.startsWith('/projects/');
}

export function isFormulaBuilderSrc(src) {
  return typeof src === 'string' && src.includes('formula-builder');
}

export function ProjectCoverImage({ src, alt, className = '', imgClassName = '' }) {
  const local = isLocalPortfolioAsset(src) || isFormulaBuilderSrc(src);
  return (
    <div className={`relative overflow-hidden ${local ? 'bg-sand' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={
          local
            ? `absolute inset-0 w-full h-full object-contain p-3 md:p-5 ${imgClassName}`
            : `absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-[1.04] transition-all duration-500 ${imgClassName}`
        }
      />
      {!local && (
        <div className="absolute inset-0 bg-tropical/20 mix-blend-multiply group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
      )}
      {local && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(135deg, rgba(246,243,237,0.12) 0%, transparent 55%)' }}
        />
      )}
    </div>
  );
}

export function ProjectCarouselImage({ src, alt }) {
  const local = isLocalPortfolioAsset(src) || isFormulaBuilderSrc(src);
  return (
    <>
      <img
        src={src}
        alt={alt}
        className={
          local
            ? 'absolute inset-0 w-full h-full object-contain p-2 md:p-4 bg-sand opacity-100 transition-transform duration-700 group-hover:scale-[1.03]'
            : 'absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.24]'
        }
      />
      {local ? (
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-tropical/35 to-transparent pointer-events-none" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-tropical/80 via-transparent to-transparent pointer-events-none" />
      )}
    </>
  );
}

export function ProjectFocusImage({ src, alt, className = '' }) {
  const local = isLocalPortfolioAsset(src) || isFormulaBuilderSrc(src);
  return (
    <div className={`relative overflow-hidden ${local ? 'bg-sand' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={
          local
            ? 'absolute inset-0 w-full h-full object-contain p-4 md:p-6'
            : 'absolute inset-0 w-full h-full object-cover scale-[1.12]'
        }
      />
      <div className={`absolute inset-0 pointer-events-none ${local ? 'bg-gradient-to-t from-tropical/45 via-transparent to-transparent' : 'bg-gradient-to-t from-tropical/78 via-transparent to-transparent'}`} />
    </div>
  );
}

export function TeachingToolImage({ src, alt, large, featured = false, toolId }) {
  const isFeatured = large || featured;
  const h = isFeatured ? 'min-h-[11rem] sm:min-h-[13rem] md:min-h-[15rem]' : 'min-h-[5.5rem]';

  if (toolId === 'formula-builder' || isFormulaBuilderSrc(src)) {
    return (
      <div
        className={`${h} w-full mb-3 overflow-hidden rounded-sm border border-olive/15 bg-sand shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]`}
      >
        <FormulaBuilderCoverArt className="w-full h-full" compact={!isFeatured} />
      </div>
    );
  }

  const local = isLocalPortfolioAsset(src);
  return (
    <div
      className={`${h} w-full mb-3 overflow-hidden rounded-sm border ${
        local ? 'border-olive/15 bg-sand shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]' : 'border-transparent'
      }`}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${local ? 'object-contain p-2 sm:p-3' : 'object-cover'}`}
        loading="lazy"
      />
    </div>
  );
}
