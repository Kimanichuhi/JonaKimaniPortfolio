import { useState } from 'react';
import { Clock, ArrowRight, Calendar, Tag } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import { useBlogPosts } from '../lib/dataCache';

const categories = ['All', 'Technology & Innovation', 'Leadership', 'African Tech', 'Entrepreneurship', 'Opinion'];

export default function BlogPage() {
  const { data: blogPosts } = useBlogPosts();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  const featured = blogPosts.find((p) => p.featured);

  return (
    <div className="bg-primary-900 text-white">
      <PageHero title="Blog & Thought Leadership" subtitle="Insights on technology, leadership, and building Africa's digital future." />

      <section className="py-8 border-b border-white/5">
        <div className="container-default">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeCategory === c ? 'bg-accent-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {featured && activeCategory === 'All' && (
        <section className="py-12">
          <div className="container-default">
            <AnimatedSection>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden card-hover">
                <div className="grid md:grid-cols-2">
                  <div className="h-56 md:h-auto">
                    {featured.image && <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-accent-500/10 text-accent-400 rounded-full px-3 py-1 text-xs font-medium">Featured</span>
                      <span className="flex items-center gap-1 text-white/40 text-xs"><Tag size={12} /> {featured.category}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{featured.title}</h2>
                    <p className="text-white/50 leading-relaxed mb-4">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-white/30 text-sm mb-6">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {featured.date}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {featured.read_time}</span>
                    </div>
                    <button className="btn-primary w-fit text-sm">Read Article <ArrowRight size={16} className="ml-2" /></button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <section className="section-padding pt-0 md:pt-0">
        <div className="container-default">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <AnimatedSection key={post.id ?? post.title} delay={i * 0.1}>
                <article className="bg-white/5 border border-white/10 rounded-xl overflow-hidden card-hover group h-full flex flex-col">
                  <div className="relative overflow-hidden aspect-video">
                    {post.image && <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-900/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold mb-2 group-hover:text-accent-400 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-white/30 text-xs">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time}</span>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
