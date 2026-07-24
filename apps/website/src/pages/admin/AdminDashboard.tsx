import { useState } from 'react';
import { useAuth } from '../../lib/useAuth';
import {
  Settings, BarChart3, Columns, MessageSquare, Clock, Briefcase,
  FileText, Mic, Newspaper, HelpCircle, FileBadge, Image, Heart,
  Building, LogOut, Menu, X, ChevronRight, Sparkles
} from 'lucide-react';
import SiteConfigEditor from './editors/SiteConfigEditor';
import StatsEditor from './editors/StatsEditor';
import PillarsEditor from './editors/PillarsEditor';
import TestimonialsEditor from './editors/TestimonialsEditor';
import TimelineEditor from './editors/TimelineEditor';
import VenturesEditor from './editors/VenturesEditor';
import BlogEditor from './editors/BlogEditor';
import SpeakingEditor from './editors/SpeakingEditor';
import MediaEditor from './editors/MediaEditor';
import FaqEditor from './editors/FaqEditor';
import ResumeEditor from './editors/ResumeEditor';
import CvBuilderEditor from './editors/CvBuilderEditor';
import GalleryEditor from './editors/GalleryEditor';
import ValuesEditor from './editors/ValuesEditor';
import LogoEditor from './editors/LogoEditor';

const sections = [
  { id: 'site', label: 'Site Config', icon: <Settings size={18} /> },
  { id: 'stats', label: 'Stats', icon: <BarChart3 size={18} /> },
  { id: 'pillars', label: 'Pillars', icon: <Columns size={18} /> },
  { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={18} /> },
  { id: 'timeline', label: 'Timeline', icon: <Clock size={18} /> },
  { id: 'ventures', label: 'Ventures', icon: <Briefcase size={18} /> },
  { id: 'blog', label: 'Blog Posts', icon: <FileText size={18} /> },
  { id: 'speaking', label: 'Speaking', icon: <Mic size={18} /> },
  { id: 'media', label: 'Media', icon: <Newspaper size={18} /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle size={18} /> },
  { id: 'resume', label: 'Resume', icon: <FileBadge size={18} /> },
  { id: 'cv-builder', label: 'CV Builder', icon: <Sparkles size={18} /> },
  { id: 'gallery', label: 'Gallery', icon: <Image size={18} /> },
  { id: 'values', label: 'Values', icon: <Heart size={18} /> },
  { id: 'logos', label: 'Logo Partners', icon: <Building size={18} /> },
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [active, setActive] = useState('site');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderEditor = () => {
    switch (active) {
      case 'site': return <SiteConfigEditor />;
      case 'stats': return <StatsEditor />;
      case 'pillars': return <PillarsEditor />;
      case 'testimonials': return <TestimonialsEditor />;
      case 'timeline': return <TimelineEditor />;
      case 'ventures': return <VenturesEditor />;
      case 'blog': return <BlogEditor />;
      case 'speaking': return <SpeakingEditor />;
      case 'media': return <MediaEditor />;
      case 'faq': return <FaqEditor />;
      case 'resume': return <ResumeEditor />;
      case 'cv-builder': return <CvBuilderEditor />;
      case 'gallery': return <GalleryEditor />;
      case 'values': return <ValuesEditor />;
      case 'logos': return <LogoEditor />;
      default: return <SiteConfigEditor />;
    }
  };

  const currentSection = sections.find(s => s.id === active);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-sm">JK</div>
            <div>
              <div className="font-semibold text-sm">Admin Panel</div>
              <div className="text-gray-500 text-xs truncate">{user?.email}</div>
            </div>
          </div>
        </div>
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-130px)]">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActive(s.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active === s.id
                  ? 'bg-accent-500/15 text-accent-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-800">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="text-white">{currentSection?.label}</span>
            </div>
          </div>
          <a href="/" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
            View Site
          </a>
        </header>

        <div className="p-4 lg:p-8 max-w-4xl">
          {renderEditor()}
        </div>
      </main>
    </div>
  );
}
