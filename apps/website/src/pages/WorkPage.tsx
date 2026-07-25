import { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import { useVentures, usePageHeader } from '../lib/dataCache';

const filters = ['All', 'Founder', 'CEO', 'Investor', 'Advisor'];

export default function WorkPage() {
  const { data: ventures } = useVentures();
  const { data: header } = usePageHeader('work');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? ventures
    : ventures.filter((v) => v.type === activeFilter);

  return (
    <div className="bg-primary-900 text-white">
      <PageHero title={header.title} subtitle={header.subtitle} />

      <section className="py-8 border-b border-white/5">
        <div className="container-default">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeFilter === f ? 'bg-accent-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-default">
          <div className="space-y-8">
            {filtered.map((venture, i) => (
              <AnimatedSection key={venture.id ?? venture.name} delay={i * 0.15}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden card-hover">
                  <div className="grid md:grid-cols-5">
                    <div className="md:col-span-2 h-56 md:h-auto">
                      {venture.image && <img src={venture.image} alt={venture.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-6 md:p-8 md:col-span-3 flex flex-col">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="bg-accent-500/10 text-accent-400 rounded-full px-3 py-1 text-xs font-medium">{venture.type}</span>
                        <span className="text-white/40 text-sm">{venture.duration}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{venture.name}</h3>
                      <p className="text-accent-400 text-sm font-medium mb-3">{venture.role}</p>
                      <p className="text-white/50 leading-relaxed mb-4">{venture.description}</p>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {venture.revenue && <div className="bg-white/5 rounded-lg px-3 py-1.5"><span className="text-accent-400 font-semibold text-sm">{venture.revenue}</span><span className="text-white/30 text-xs ml-1">revenue</span></div>}
                        {venture.users && <div className="bg-white/5 rounded-lg px-3 py-1.5"><span className="text-accent-400 font-semibold text-sm">{venture.users}</span><span className="text-white/30 text-xs ml-1">users</span></div>}
                        {venture.team && <div className="bg-white/5 rounded-lg px-3 py-1.5"><span className="text-accent-400 font-semibold text-sm">{venture.team}</span><span className="text-white/30 text-xs ml-1">team</span></div>}
                      </div>
                      {venture.achievements.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {venture.achievements.map((a) => (
                            <li key={a} className="flex items-start gap-2 text-sm text-white/50">
                              <ArrowRight size={14} className="text-teal-400 shrink-0 mt-0.5" />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                      {venture.link && (
                        <a href={venture.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition-colors text-sm font-medium mt-auto">
                          Visit Website <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
