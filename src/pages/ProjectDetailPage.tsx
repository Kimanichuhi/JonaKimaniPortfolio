import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Tag, CheckCircle, Target, Lightbulb, AlertTriangle, Rocket, Star, ArrowRight, Copy, Check, Zap, Shield, Users, Globe } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { projects, Project } from '../data/projects';
import { useEffect, useState } from 'react';

function DetailSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <AnimatedSection className="mb-8">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center text-accent-400">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        {children}
      </div>
    </AnimatedSection>
  );
}

function RelatedProjects({ currentId }: { currentId: string }) {
  const currentProject = projects.find(p => p.id === currentId);
  if (!currentProject) return null;

  const related = projects
    .filter(p => p.id !== currentId && p.category === currentProject.category)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <AnimatedSection className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Related Projects</h3>
        <Link to="/projects" className="text-accent-400 hover:text-accent-300 text-sm flex items-center gap-1">
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {related.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-accent-500/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-accent-400 bg-accent-500/15 px-2 py-1 rounded-full">
                {project.category}
              </span>
            </div>
            <h4 className="text-white font-medium group-hover:text-accent-400 transition-colors">
              {project.name}
            </h4>
            <p className="text-white/50 text-sm mt-1 line-clamp-2">{project.shortDescription}</p>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const project = projects.find((p: Project) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="bg-primary-900 min-h-screen text-white">
        <div className="container-default py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="text-white/60 mb-8">The project you're looking for doesn't exist or has been moved.</p>
          <Link to="/projects" className="btn-primary">
            <ArrowLeft size={18} className="mr-2" /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(project.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-primary-900 text-white min-h-screen">
      <header className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-12 h-12 text-white/30" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container-default pb-8 md:pb-12 pt-20">
            <AnimatedSection>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={18} /> Back to Projects
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent-500/20 text-accent-400 text-sm font-medium border border-accent-500/30">
                  <Tag size={14} />
                  {project.category}
                </span>
                {project.featured && (
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium border border-teal-500/30">
                    <Star size={14} className="fill-current" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{project.name}</h1>
              <p className="text-lg md:text-xl text-white/60 max-w-3xl leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Calendar size={16} />
                  {new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs text-teal-400/80">
                      #{tag.toLowerCase().replace(/\s/g, '')}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </header>

      <section className="py-6 border-b border-white/5 bg-primary-800/30">
        <div className="container-default">
          <div className="flex flex-wrap gap-3">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <ExternalLink size={18} className="mr-2" />
              Visit Live Demo
            </a>
            <button
              onClick={handleCopy}
              className="btn-secondary"
            >
              {copied ? (
                <>
                  <Check size={18} className="mr-2" />
                  Link Copied
                </>
              ) : (
                <>
                  <Copy size={18} className="mr-2" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <main className="py-12 md:py-16">
        <div className="container-default">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DetailSection title="Overview" icon={<Globe size={20} />}>
                <p className="text-white/70 leading-relaxed">{project.details.overview}</p>
              </DetailSection>

              <DetailSection title="Problem Solved" icon={<AlertTriangle size={20} />}>
                <p className="text-white/70 leading-relaxed">{project.details.problem}</p>
              </DetailSection>

              <DetailSection title="Objectives" icon={<Target size={20} />}>
                <ul className="space-y-3">
                  {project.details.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-accent-400 shrink-0 mt-1" />
                      <span className="text-white/70">{obj}</span>
                    </li>
                  ))}
                </ul>
              </DetailSection>

              <DetailSection title="Key Features" icon={<Zap size={20} />}>
                <div className="grid md:grid-cols-2 gap-3">
                  {project.details.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                      <CheckCircle size={16} className="text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="System Architecture" icon={<Shield size={20} />}>
                <p className="text-white/70 leading-relaxed">{project.details.architecture}</p>
              </DetailSection>

              <DetailSection title="Challenges & Solutions" icon={<Lightbulb size={20} />}>
                <div className="space-y-6">
                  {project.details.challenges.map((challenge, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-white/10">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent-500/20 border-2 border-accent-500" />
                      <div className="mb-2">
                        <span className="text-sm text-white/40">Challenge</span>
                        <p className="text-white/80">{challenge}</p>
                      </div>
                      {project.details.solutions[i] && (
                        <div className="ml-4 mt-2 p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
                          <span className="text-xs text-teal-400 mb-1 block">Solution</span>
                          <p className="text-white/70 text-sm">{project.details.solutions[i]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection title="Lessons Learned" icon={<Users size={20} />}>
                <ul className="space-y-3">
                  {project.details.lessons.map((lesson, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Star size={16} className="text-yellow-400 shrink-0 mt-1 fill-current" />
                      <span className="text-white/70">{lesson}</span>
                    </li>
                  ))}
                </ul>
              </DetailSection>

              <DetailSection title="Future Improvements" icon={<Rocket size={20} />}>
                <div className="flex flex-wrap gap-2">
                  {project.details.futureImprovements.map((improvement, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-accent-500/10 to-teal-500/10 rounded-lg border border-white/10 text-white/70 text-sm"
                    >
                      {improvement}
                    </span>
                  ))}
                </div>
              </DetailSection>
            </div>

            <aside className="lg:col-span-1">
              <AnimatedSection delay={0.2}>
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Quick Info</h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-white/40 text-xs uppercase tracking-wider">Category</span>
                        <p className="text-white font-medium">{project.category}</p>
                      </div>
                      <div>
                        <span className="text-white/40 text-xs uppercase tracking-wider">Date</span>
                        <p className="text-white font-medium">
                          {new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/40 text-xs uppercase tracking-wider">Status</span>
                        <p className="text-accent-400 font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                          Live & Active
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-white/70 text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-accent-500/20 to-teal-500/20 backdrop-blur-sm border border-accent-500/20 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Like what you see?</h4>
                    <p className="text-white/60 text-sm mb-4">
                      Let's collaborate on your next project and build something amazing together.
                    </p>
                    <Link to="/contact" className="btn-primary w-full justify-center text-sm">
                      Get in Touch <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </aside>
          </div>

          <RelatedProjects currentId={project.id} />
        </div>
      </main>
    </div>
  );
}
