import { Lightbulb, Heart, Globe, Users, BookOpen, Award, ExternalLink, Calendar } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import { useSiteConfig, useTimeline, useGalleryImages, useValues, usePageHeader, usePageBlock } from '../lib/dataCache';
import { Link } from 'react-router-dom';

const iconComponents: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb size={24} />,
  Heart: <Heart size={24} />,
  Globe: <Globe size={24} />,
  Users: <Users size={24} />,
  BookOpen: <BookOpen size={24} />,
  Award: <Award size={24} />,
};

export default function AboutPage() {
  const { data: siteConfig } = useSiteConfig();
  const { data: timeline } = useTimeline();
  const { data: values } = useValues();
  const { data: gallery } = useGalleryImages();
  const { data: header } = usePageHeader('about');
  const { data: bio } = usePageBlock('about:bio');
  const { data: cta } = usePageBlock('about:cta');

  return (
    <div className="bg-primary-900 text-white">
      <PageHero title={header.title} subtitle={header.subtitle} background={header.background_image ?? undefined} />

      {/* Bio Section */}
      <section className="section-padding">
        <div className="container-default">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative">
                <img
                  src={siteConfig.about_image ?? 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt="Jonah Kimani"
                  className="w-full rounded-2xl object-cover aspect-[4/5]"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary-900/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="text-accent-400 font-semibold text-sm">{bio.badge_text}</div>
                    <div className="text-white font-bold text-lg">{bio.subtitle}</div>
                    <a
                      href="https://qeemlabs.co.ke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/60 hover:text-accent-400 transition-colors flex items-center gap-1 mt-1"
                    >
                      qeemlabs.co.ke <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {bio.title}
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>{siteConfig.bio}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-primary-800/30">
        <div className="container-default">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Philosophy & <span className="text-gradient">Vision</span>
            </h2>
            <blockquote className="text-xl md:text-2xl text-white/70 leading-relaxed italic mb-6">
              "{siteConfig.philosophy_quote}"
            </blockquote>
            <p className="text-white/40">— {siteConfig.name}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="section-padding">
          <div className="container-default">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Career <span className="text-gradient">Journey</span>
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">
                From software developer to CEO — a decade and a half of building, learning, and leading.
              </p>
            </AnimatedSection>

            <div className="max-w-3xl mx-auto">
              {timeline.map((event, i) => (
                <AnimatedSection key={event.id ?? event.year} delay={i * 0.1}>
                  <div className="flex gap-6 mb-8 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-accent-500/20 border-2 border-accent-500 flex items-center justify-center text-accent-400 font-bold text-sm shrink-0">
                        {event.year.slice(-2)}
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="w-px h-full bg-white/10 my-2" />
                      )}
                    </div>
                    <div className="pb-8">
                      <div className="text-accent-400 text-sm font-medium mb-1">{event.year}</div>
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-white/50 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {values.length > 0 && (
        <section className="section-padding">
          <div className="container-default">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Core <span className="text-gradient">Values</span>
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">
                The principles that guide every decision and venture.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <AnimatedSection key={v.id ?? v.title} delay={i * 0.1}>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 card-hover group">
                    <div className="w-12 h-12 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center mb-4 group-hover:bg-accent-500/20 transition-colors">
                      {iconComponents[v.icon] || <Lightbulb size={24} />}
                    </div>
                    <h3 className="font-semibold mb-2">{v.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-16 bg-primary-800/30">
          <div className="container-default">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Media <span className="text-gradient">Gallery</span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <AnimatedSection key={img.id ?? i} delay={i * 0.1}>
                  <div className="relative group overflow-hidden rounded-xl aspect-square">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/40 transition-colors duration-300" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-gradient-to-r from-accent-500/20 to-teal-500/20">
        <div className="container-default">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{cta.title}</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              {cta.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking" className="btn-primary">
                <Calendar size={18} className="mr-2" /> Book a Consultation
              </Link>
              <a
                href="https://qeemlabs.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Visit Qeem Labs <ExternalLink size={18} className="ml-2" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
