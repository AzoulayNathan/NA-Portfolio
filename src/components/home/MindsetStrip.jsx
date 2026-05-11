import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
const BRANCH_SRC = '/olive-branch.png';
const OLIVE_RGB = { r: 63, g: 90, b: 79 };
const BEIGE_RGB = { r: 232, g: 223, b: 201 };

function useMonochromeBranch(source, color) {
  const [processedSource, setProcessedSource] = useState(source);

  useEffect(() => {
    let isCancelled = false;
    const image = new Image();
    image.src = source;

    image.onload = () => {
      if (isCancelled) return;

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        setProcessedSource(source);
        return;
      }

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a === 0) continue;

        // Remove white background while preserving anti-aliased edges.
        const nearWhite = r > 236 && g > 236 && b > 236;
        if (nearWhite) {
          data[i + 3] = 0;
          continue;
        }

        const darkness = 1 - (r + g + b) / (255 * 3);
        const alphaScale = Math.min(1, 0.6 + darkness * 0.7);

        data[i] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
        data[i + 3] = Math.round(a * alphaScale);
      }

      context.putImageData(imageData, 0, 0);
      setProcessedSource(canvas.toDataURL('image/png'));
    };

    image.onerror = () => {
      if (!isCancelled) setProcessedSource(source);
    };

    return () => {
      isCancelled = true;
    };
  }, [source, color.r, color.g, color.b]);

  return processedSource;
}

export default function MindsetStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-40px' });
  const oliveBranchSource = useMonochromeBranch(BRANCH_SRC, OLIVE_RGB);
  const beigeBranchSource = useMonochromeBranch(BRANCH_SRC, BEIGE_RGB);
  return (
    <section ref={ref} className="relative bg-olive py-20 px-6 md:px-10 overflow-visible">
      {/* Continuation beige en bas pour prolonger la branche sur la carte verte */}
      <motion.img
        src={beigeBranchSource}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute z-0
          right-[-8%] md:right-[-2%] -top-[min(42vh,320px)] md:-top-[min(46vh,360px)]
          w-[min(74.5vw,492px)] md:w-[min(45.4vw,596px)] max-w-none
          translate-y-[18%] opacity-55"
        style={{ clipPath: 'inset(58% 0 0 0)', transformOrigin: 'bottom right' }}
        animate={{ rotate: [-8, -7.1, -8.4, -8], y: [0, -2, 1, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Branche décorative mono olive, orientée vers la section "Explore my path" au-dessus */}
      <motion.img
        src={oliveBranchSource}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute z-0
          right-[-8%] md:right-[-2%] -top-[min(42vh,320px)] md:-top-[min(46vh,360px)]
          w-[min(74.5vw,492px)] md:w-[min(45.4vw,596px)] max-w-none
          opacity-90"
        style={{ transformOrigin: 'bottom right' }}
        animate={{ rotate: [-8, -6.9, -8.5, -8], y: [0, -3, 2, 0] }}
        transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-serif font-light text-center leading-tight md:text-[60px] text-[40px] relative px-2"
        >
          <span style={{ color: '#E8DFC9' }}>Not just building.</span>{' '}
          <span style={{ color: '#1F3D33' }}>Structuring.</span>
        </motion.h2>
      </div>
    </section>
  );
}
