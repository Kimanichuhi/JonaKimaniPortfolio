import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Crown, Target, ChevronDown, ChevronUp, Star, ExternalLink } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { useCounter, useScrollPosition } from '../hooks/useAnimations';
import { useSiteConfig, useStats, usePillars, useTestimonials, useFaqItems, useVentures, useLogoPartners } from '../lib/dataCache';

const iconMap: Record<string, React.ReactNode> = {
  Eye: <Eye size={32} />,
  Crown: <Crown size={32} />,
  Target: <Target size={32} />,
};

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value, 2500);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
        {count}{suffix}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  );
}

function TestimonialCarousel() {
  const { data: testimonials } = useTestimonials();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const t = testimonials[current];

  return (
    <div className="relative max-w-3xl mx-auto">
      <div key={current} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 animate-fade-in">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={16} className="text-accent-500 fill-accent-500" />
          ))}
        </div>
        <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-6 italic">
          "{t.quote}"
        </p>
        <div className="flex items-center gap-4">
          {t.avatar && <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />}
          <div>
            <div className="text-white font-medium">{t.name}</div>
            <div className="text-white/50 text-sm">{t.title}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-accent-500 w-8' : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function FAQAccordion() {
  const { data: faqItems } = useFaqItems();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqItems.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto">
      {faqItems.map((item, i) => (
        <div key={item.id ?? i} className="border-b border-white/10">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-white font-medium pr-4 group-hover:text-accent-400 transition-colors">
              {item.question}
            </span>
            {openIndex === i ? (
              <ChevronUp size={20} className="text-accent-400 shrink-0" />
            ) : (
              <ChevronDown size={20} className="text-white/40 shrink-0" />
            )}
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: openIndex === i ? '300px' : '0',
              opacity: openIndex === i ? 1 : 0,
            }}
          >
            <p className="text-white/60 pb-5 leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroAnim({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const scrollY = useScrollPosition();
  const { data: siteConfig } = useSiteConfig();
  const { data: stats } = useStats();
  const { data: pillars } = usePillars();
  const { data: ventures } = useVentures();
  const { data: logoPartners } = useLogoPartners();
  const featuredVenture = ventures[0];

  return (
    <div className="bg-primary-900 text-white overflow-hidden">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${siteConfig.hero_image ?? 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1920'})`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary-800/70 via-primary-900/80 to-primary-900" />
        </div>

        <div className="absolute top-40 right-20 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-pulse" />

        <div className="container-default relative z-10 pt-20">
          <div className="max-w-3xl">
            <HeroAnim delay={0} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-white/70 text-sm">{siteConfig.title}</span>
            </HeroAnim>

            <HeroAnim delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                {siteConfig.tagline.split(' ').slice(0, -2).join(' ')}{' '}
                <span className="text-gradient">{siteConfig.tagline.split(' ').slice(-2).join(' ')}</span>
              </h1>
            </HeroAnim>

            <HeroAnim delay={0.4}>
              <p className="text-xl md:text-2xl text-white/60 mb-4">{siteConfig.roles}</p>
            </HeroAnim>

            <HeroAnim delay={0.5}>
              <p className="text-lg text-white/40 mb-10 max-w-xl leading-relaxed">{siteConfig.bio}</p>
            </HeroAnim>

            <HeroAnim delay={0.6} className="flex flex-wrap gap-4">
              <Link to="/work" className="btn-primary">
                View My Work <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </HeroAnim>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} className="text-white/30" />
        </div>
      </section>

      {stats.length > 0 && (
        <section className="py-16 bg-primary-800/50 border-y border-white/5">
          <div className="container-default">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {stats.map((stat) => (
                <StatCounter key={stat.id ?? stat.label} {...stat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {pillars.length > 0 && (
        <section className="section-padding">
          <div className="container-default">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built on Three <span className="text-gradient">Core Pillars</span>
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto">Every venture and initiative is anchored in these foundational principles.</p>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, i) => (
                <AnimatedSection key={pillar.id ?? pillar.title} delay={i * 0.15}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center card-hover group">
                    <div className="w-16 h-16 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-500/20 transition-colors">
                      {iconMap[pillar.icon] || <Target size={32} />}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
                    <p className="text-white/50 leading-relaxed">{pillar.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {logoPartners.length > 0 && (
        <section className="py-12 border-y border-white/5 bg-primary-800/30">
          <div className="container-default mb-8">
            <p className="text-center text-white/30 text-sm uppercase tracking-widest">Trusted by leading organizations</p>
          </div>
          <div className="overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...logoPartners, ...logoPartners].map((lp, i) => (
                <div key={`${lp.id}-${i}`} className="mx-8 md:mx-12 flex items-center">
                  <span className="text-white/20 text-xl md:text-2xl font-semibold tracking-wide">{lp.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-default">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What People <span className="text-gradient">Say</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">Hear from leaders and partners who've worked alongside the journey.</p>
          </AnimatedSection>
          <AnimatedSection>
            <TestimonialCarousel />
          </AnimatedSection>
        </div>
      </section>

      {featuredVenture && (
        <section className="section-padding bg-primary-800/30">
          <div className="container-default">
            <AnimatedSection className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured <span className="text-gradient">Venture</span></h2>
                <p className="text-white/50">The flagship company leading Africa's digital charge.</p>
              </div>
              <Link to="/work" className="btn-primary">View All Work <ArrowRight size={18} className="ml-2" /></Link>
            </AnimatedSection>
            <AnimatedSection>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="h-64 md:h-auto">
                    {featuredVenture.image && <img src={featuredVenture.image} alt={featuredVenture.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-400 rounded-full px-3 py-1 text-sm mb-4 w-fit">{featuredVenture.role}</div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">{featuredVenture.name}</h3>
                    <p className="text-white/50 leading-relaxed mb-6">{featuredVenture.description}</p>
                    <div className="flex flex-wrap gap-4 mb-6">
                      {featuredVenture.revenue && <div className="bg-white/5 rounded-lg px-4 py-2"><div className="text-accent-400 font-semibold">{featuredVenture.revenue}</div><div className="text-white/40 text-xs">Revenue</div></div>}
                      {featuredVenture.users && <div className="bg-white/5 rounded-lg px-4 py-2"><div className="text-accent-400 font-semibold">{featuredVenture.users}</div><div className="text-white/40 text-xs">Users</div></div>}
                      {featuredVenture.team && <div className="bg-white/5 rounded-lg px-4 py-2"><div className="text-accent-400 font-semibold">{featuredVenture.team}</div><div className="text-white/40 text-xs">Team</div></div>}
                    </div>
                    {featuredVenture.link && (
                      <a href={featuredVenture.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition-colors text-sm font-medium">
                        Visit Website <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-default">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
            <p className="text-white/50 max-w-2xl mx-auto">Quick answers to common questions about Jonah's work and ventures.</p>
          </AnimatedSection>
          <AnimatedSection>
            <FAQAccordion />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-accent-500/20 to-teal-500/20">
        <div className="container-default">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the <span className="text-gradient">Loop</span></h2>
            <p className="text-white/50 max-w-xl mx-auto mb-8">Get insights on technology, leadership, and Africa's digital transformation delivered to your inbox.</p>
            <Link to="/contact" className="btn-primary text-lg">Subscribe to Newsletter <ArrowRight size={20} className="ml-2" /></Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
