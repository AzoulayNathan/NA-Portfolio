import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import SandRain from '../home/SandRain';
import { useSandRain } from '@/lib/SandRainContext';

export default function PageLayout({ children, showFooter = true }) {
  const { enabled } = useSandRain();

  return (
    <div className="min-h-screen bg-sand">
      {enabled && <SandRain />}
      <SiteNav />
      <main className="pb-10">{children}</main>
      {showFooter && <SiteFooter />}
    </div>
  );
}