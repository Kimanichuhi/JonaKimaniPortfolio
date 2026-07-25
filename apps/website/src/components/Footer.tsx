import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, Twitter, Linkedin, Github } from 'lucide-react';
import { useSiteConfig } from '../lib/dataCache';
import { useState } from 'react';
import { subscribeNewsletter } from '../lib/supabase';

export default function Footer() {
  const { data: siteConfig } = useSiteConfig();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      const { error: supaError } = await subscribeNewsletter(email);
      if (supaError) {
        if (supaError.code === '23505') { setError('Already subscribed!'); } else { setError('Something went wrong. Please try again.'); }
        return;
      }
      setSubscribed(true); setEmail(''); setError('');
    } catch {
      setSubscribed(true); setEmail(''); setError('');
    }
  };

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-default">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {siteConfig.logo_url ? (
                <img src={siteConfig.logo_url} alt={siteConfig.name} className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-lg">JK</div>
              )}
              <span className="font-semibold text-lg">{siteConfig.name}</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">{siteConfig.tagline}. Building the future of technology from Africa.</p>
            <div className="flex gap-3">
              <a href={siteConfig.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><Twitter size={18} /></a>
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><Linkedin size={18} /></a>
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><Github size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {[{ path: '/', label: 'Home' }, { path: '/about', label: 'About' }, { path: '/work', label: 'Work' }, { path: '/blog', label: 'Blog' }, { path: '/speaking', label: 'Speaking' }, { path: '/contact', label: 'Contact' }, { path: '/resume', label: 'Resume' }].map((link) => (
                <Link key={link.path} to={link.path} className="text-white/60 hover:text-accent-400 text-sm transition-colors">{link.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-white/60 hover:text-accent-400 text-sm transition-colors"><Mail size={16} /> {siteConfig.email}</a>
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-white/60 hover:text-accent-400 text-sm transition-colors"><Phone size={16} /> {siteConfig.phone}</a>
              <div className="flex items-center gap-3 text-white/60 text-sm"><MapPin size={16} /> {siteConfig.address}</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-white/60 text-sm mb-4">Get insights on tech, leadership, and Africa's digital future.</p>
            {subscribed ? (
              <div className="bg-teal-500/20 text-teal-300 rounded-lg px-4 py-3 text-sm">Thanks for subscribing!</div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
                <div className="flex">
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="Enter your email" className="flex-1 bg-white/5 border border-white/10 rounded-l-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent-500 transition-colors" />
                  <button type="submit" className="bg-accent-500 hover:bg-accent-600 px-4 rounded-r-lg transition-colors"><ArrowRight size={18} /></button>
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="text-white/40 text-sm">CEO of <a href="https://qeemlabs.co.ke" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300 transition-colors">Qeem Labs Ltd</a></p>
        </div>
      </div>
    </footer>
  );
}
