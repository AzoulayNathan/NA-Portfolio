import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-sand">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light font-serif text-ink/30">404</h1>
        <div className="h-px w-16 bg-olive/30 mx-auto" />
        <h2 className="text-2xl font-serif font-light text-ink">Page introuvable</h2>
        <p className="text-ink/55 text-sm">
          La page « {pageName || '/'} » n&apos;existe pas.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-sans text-sm text-tropical border-b border-tropical pb-0.5 hover:opacity-70"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
