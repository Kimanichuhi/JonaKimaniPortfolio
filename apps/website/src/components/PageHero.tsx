import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  background?: string;
}

export default function PageHero({ title, subtitle, background }: PageHeroProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: background
            ? `url(${background})`
            : 'none',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-800/90 via-primary-900/95 to-primary-900" />
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

      <div className="container-default relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/60 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
