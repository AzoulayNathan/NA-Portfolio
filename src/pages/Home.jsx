import { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import OpeningCinematic from '../components/home/OpeningCinematic';
import HeroSection from '../components/home/HeroSection';
import SelectedWork from '../components/home/SelectedWork';
import AboutPreview from '../components/home/AboutPreview';
import MindsetStrip from '../components/home/MindsetStrip';
import FocusedRooms from '../components/home/FocusedRooms';
import ContactClose from '../components/home/ContactClose';

export default function Home() {
  const [cinematicDone, setCinematicDone] = useState(false);
  const [isReturningVisitor] = useState(() => {
    if (typeof window === 'undefined') return false;
    const seenCount = Number(window.localStorage.getItem('na-open-count') || '0');
    window.localStorage.setItem('na-open-count', String(seenCount + 1));
    return seenCount >= 1;
  });

  useEffect(() => {
    const t = setTimeout(() => setCinematicDone(true), isReturningVisitor ? 1600 : 3200);
    return () => clearTimeout(t);
  }, [isReturningVisitor]);

  return (
    <>
      {!cinematicDone && <OpeningCinematic slowMode={isReturningVisitor} onComplete={() => setCinematicDone(true)} />}
      <PageLayout>
        <HeroSection revealed={cinematicDone} />
        <SelectedWork />
        <AboutPreview />
        <MindsetStrip />
        <FocusedRooms />
        <ContactClose />
      </PageLayout>
    </>
  );
}