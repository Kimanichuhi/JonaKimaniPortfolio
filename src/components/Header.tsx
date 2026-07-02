import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSiteConfig } from '../lib/dataCache';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/work', label: 'Work' },
  { path: '/blog', label: 'Blog' },
  { path: '/speaking', label: 'Speaking' },
  { path: '/contact', label: 'Contact' },
];

export default function Header() {
  const { data: siteConfig } = useSiteConfig();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-primary-800/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container-default">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110">JK</div>
            <span className="text-white font-semibold text-lg hidden sm:block">{siteConfig.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === link.path ? 'text-accent-400 bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </Link>
            ))}
            <Link to="/resume" className="btn-primary ml-4 !py-2 !px-5 text-sm">Resume</Link>
          </nav>

          <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-primary-800/98 backdrop-blur-lg border-t border-white/10 animate-slide-down">
          <nav className="container-default py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === link.path ? 'text-accent-400 bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </Link>
            ))}
            <Link to="/resume" className="btn-primary mt-3 text-sm">Resume</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
