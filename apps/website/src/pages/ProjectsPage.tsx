import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, ArrowRight, Calendar, Tag, Sparkles, Briefcase, Building2, Tractor, Heart, GraduationCap, DollarSign, Home, Users, Palette, BarChart3, X, SortAsc, SortDesc, Grid, List, Copy, Check, Star } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import { categories } from '../data/projects';
import { useProjects, usePageHeader, type ProjectRow } from '../lib/dataCache';

const categoryIcons: Record<string, React.ReactNode> = {
  ai: <Sparkles size={16} />,
  agriculture: <Tractor size={16} />,
  government: <Building2 size={16} />,
  education: <GraduationCap size={16} />,
  finance: <DollarSign size={16} />,
  'real-estate': <Home size={16} />,
  healthcare: <Heart size={16} />,
  creative: <Palette size={16} />,
  operations: <BarChart3 size={16} />,
  community: <Users size={16} />,
};

function StatCounter({ value, suffix, label, delay = 0 }: { value: number; suffix?: string; label: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    let startTime: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [started, value]);

  return (
    <div ref={ref} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
        {count}{suffix}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: ProjectRow; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(project.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatedSection delay={index * 0.08}>
      <div
        className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent-400/50 hover:shadow-2xl hover:shadow-accent-500/10"
        style={{
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
            <div className="text-center">
              <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-2" />
              <span className="text-white/30 text-sm">Project Preview</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/30 to-transparent" />

          {project.featured && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-accent-500/90 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Star size={12} className="fill-current" />
              Featured
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
              title="Copy link"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Calendar size={12} />
              {new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-accent-500/15 text-accent-400 px-3 py-1 rounded-full text-xs font-medium">
              {categoryIcons[project.category.toLowerCase().replace('-', '')] || <Tag size={12} />}
              {project.category}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">
            {project.name}
          </h3>

          <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
            {project.short_description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/60 border border-white/10">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/40 border border-white/10">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="text-xs text-teal-400/80">
                #{tag.toLowerCase().replace(/\s/g, '')}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent-500/20 text-accent-400 font-medium text-sm hover:bg-accent-500 hover:text-white transition-all duration-300 border border-accent-500/30"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
            <Link
              to={`/projects/${project.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              View Details
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function ProjectsPage() {
  const { data: projects } = useProjects();
  const { data: header } = usePageHeader('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'alpha'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const projectStats = useMemo(() => ({
    total: projects.length,
    industries: new Set(projects.map(p => p.category)).size,
    aiProjects: projects.filter(p => p.category === 'AI').length,
    enterprise: projects.filter(p => p.category === 'Operations').length,
    government: projects.filter(p => p.category === 'Government').length,
    agriculture: projects.filter(p => p.category === 'Agriculture').length,
  }), [projects]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase().replace('-', '') === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        p.technologies.some(t => t.toLowerCase().includes(query))
      );
    }

    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [projects, searchQuery, activeCategory, sortOrder]);

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="bg-primary-900 text-white min-h-screen">
      <PageHero title={header.title} subtitle={header.subtitle} />

      <section className="py-12 bg-primary-800/30 border-b border-white/5">
        <div className="container-default">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCounter value={projectStats.total} label="Total Projects" delay={0} />
            <StatCounter value={projectStats.industries} label="Industries Served" delay={0.1} />
            <StatCounter value={projectStats.aiProjects} label="AI Projects" delay={0.2} />
            <StatCounter value={projectStats.enterprise} label="Enterprise Systems" delay={0.3} />
            <StatCounter value={projectStats.government} label="Government Solutions" delay={0.4} />
            <StatCounter value={projectStats.agriculture} label="Agriculture Platforms" delay={0.5} />
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-accent-500/10 to-teal-500/10 border-b border-white/5">
          <div className="container-default">
            <AnimatedSection className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Star className="text-accent-400" size={24} />
                <h2 className="text-2xl font-bold">Featured Projects</h2>
              </div>
              <Link to="/projects" className="text-accent-400 hover:text-accent-300 text-sm flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 border-b border-white/5 sticky top-16 md:top-20 bg-primary-900/95 backdrop-blur-md z-30">
        <div className="container-default">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search projects by name, technology, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setSortOrder('newest')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all ${sortOrder === 'newest' ? 'bg-accent-500/20 text-accent-400' : 'text-white/60 hover:text-white'}`}
                >
                  <SortDesc size={14} /> Newest
                </button>
                <button
                  onClick={() => setSortOrder('alpha')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all ${sortOrder === 'alpha' ? 'bg-accent-500/20 text-accent-400' : 'text-white/60 hover:text-white'}`}
                >
                  <SortAsc size={14} /> A-Z
                </button>
              </div>

              <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-accent-500/20 text-accent-400' : 'text-white/60 hover:text-white'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-accent-500/20 text-accent-400' : 'text-white/60 hover:text-white'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.id !== 'all' && categoryIcons[cat.id]}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-default">
          {filteredProjects.length === 0 ? (
            <AnimatedSection className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-white/30" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-white/50 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
              >
                Clear Filters
              </button>
            </AnimatedSection>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/50 text-sm">
                  Showing <span className="text-white font-medium">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className={viewMode === 'grid'
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {filteredProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-accent-500/20 to-teal-500/20">
        <div className="container-default">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Interested in working together?</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Let's build something amazing together. Whether you need a full-stack application, AI integration, or digital transformation consulting.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking" className="btn-primary">
                <Calendar size={18} className="mr-2" /> Book a Consultation
              </Link>
              <Link to="/contact" className="btn-secondary">
                Let's Build Something Amazing
              </Link>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                LinkedIn
              </a>
              <Link to="/contact" className="text-white/40 hover:text-white transition-colors">
                Email
              </Link>
              <Link to="/resume" className="text-white/40 hover:text-white transition-colors">
                Download CV
              </Link>
              <a href="https://qeemlabs.co.ke" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                Qeem Labs
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
