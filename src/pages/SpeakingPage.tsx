import { useState } from 'react';
import { Mic, Tv, Video, BookOpen, ExternalLink, Calendar, MapPin } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import { useSpeakingEvents, useMediaAppearances } from '../lib/dataCache';

function Users2(props: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="4"/><path d="M22 21a8 8 0 0 0-2-6"/><path d="M15 5a4 4 0 0 1 0 6"/>
    </svg>
  );
}

const typeIcons: Record<string, React.ReactNode> = {
  Keynote: <Mic size={20} />,
  Panel: <Users2 size={20} />,
  Talk: <Mic size={20} />,
  Workshop: <BookOpen size={20} />,
  'Fireside Chat': <Video size={20} />,
};

const mediaTypeIcons: Record<string, React.ReactNode> = {
  Podcast: <Mic size={16} />,
  Interview: <Tv size={16} />,
  Article: <BookOpen size={16} />,
  Video: <Video size={16} />,
};

export default function SpeakingPage() {
  const { data: speakingEvents } = useSpeakingEvents();
  const { data: mediaAppearances } = useMediaAppearances();
  const [activeMediaType, setActiveMediaType] = useState('All');

  const mediaTypes = ['All', 'Podcast', 'Interview', 'Article', 'Video'];
  const filteredMedia = activeMediaType === 'All'
    ? mediaAppearances
    : mediaAppearances.filter((m) => m.type === activeMediaType);

  return (
    <div className="bg-primary-900 text-white">
      <PageHero title="Speaking & Media" subtitle="Sharing insights on stages and in publications across the globe." />

      <section className="section-padding">
        <div className="container-default">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Speaking <span className="text-gradient">Engagements</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">Keynotes, panels, and workshops at leading tech conferences worldwide.</p>
          </AnimatedSection>

          <div className="space-y-4 max-w-4xl mx-auto">
            {speakingEvents.map((event, i) => (
              <AnimatedSection key={event.id ?? event.title} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 card-hover group">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0 group-hover:bg-accent-500/20 transition-colors">
                      {typeIcons[event.type] || <Mic size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="bg-teal-500/10 text-teal-400 rounded-full px-2.5 py-0.5 text-xs font-medium">{event.type}</span>
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-accent-400 transition-colors">{event.title}</h3>
                      <p className="text-white/50 text-sm mb-2">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-white/30 text-xs">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                      </div>
                    </div>
                    {event.video_url && (
                      <a href={event.video_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm !py-2 !px-4 shrink-0">
                        Watch <ExternalLink size={14} className="ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-800/30">
        <div className="container-default">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Media <span className="text-gradient">Appearances</span>
            </h2>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {mediaTypes.map((t) => (
              <button key={t} onClick={() => setActiveMediaType(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeMediaType === t ? 'bg-accent-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {filteredMedia.map((media, i) => (
              <AnimatedSection key={media.id ?? media.title} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 card-hover group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-accent-400">{mediaTypeIcons[media.type] || <BookOpen size={16} />}</span>
                    <span className="bg-white/5 rounded-full px-2.5 py-0.5 text-xs text-white/40">{media.type}</span>
                  </div>
                  <h3 className="font-medium mb-1 group-hover:text-accent-400 transition-colors text-sm">{media.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-xs">{media.publication} • {media.date}</span>
                    {media.link && <a href={media.link} className="text-accent-400 hover:text-accent-300 transition-colors"><ExternalLink size={14} /></a>}
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
