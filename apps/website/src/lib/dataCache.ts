import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import * as fallback from '../data/content';

type CacheEntry = { data: unknown; timestamp: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60_000; // 1 minute

function isFresh(entry: CacheEntry | undefined): boolean {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL;
}

async function fetchTable<T>(table: string): Promise<T[] | null> {
  const cached = cache.get(table);
  if (isFresh(cached)) return cached!.data as T[] | null;

  try {
    const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) {
      cache.set(table, { data: null, timestamp: Date.now() });
      return null;
    }
    const result = data as T[];
    cache.set(table, { data: result, timestamp: Date.now() });
    return result;
  } catch {
    cache.set(table, { data: null, timestamp: Date.now() });
    return null;
  }
}

async function fetchSingle<T>(table: string): Promise<T | null> {
  const cached = cache.get(table);
  if (isFresh(cached)) return cached!.data as T | null;

  try {
    const { data, error } = await supabase.from(table).select('*').limit(1).single();
    if (error || !data) {
      cache.set(table, { data: null, timestamp: Date.now() });
      return null;
    }
    const result = data as T;
    cache.set(table, { data: result, timestamp: Date.now() });
    return result;
  } catch {
    cache.set(table, { data: null, timestamp: Date.now() });
    return null;
  }
}

export function invalidateCache(table?: string) {
  if (table) cache.delete(table);
  else cache.clear();
}

function parseAchievements(a: unknown): string[] {
  if (Array.isArray(a)) return a.map(String);
  return [];
}

function convertVenture(v: Record<string, unknown>): Venture {
  return { ...v, achievements: parseAchievements(v.achievements) } as Venture;
}

function convertExperience(e: Record<string, unknown>): ResumeExperience {
  return { ...e, achievements: parseAchievements(e.achievements) } as ResumeExperience;
}

function orderBySort<T extends { sort_order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

// --- Interfaces ---
interface SiteConfig { id?: string; name: string; title: string; tagline: string; roles: string; email: string; phone: string; whatsapp: string; calendly: string; address: string; twitter: string; linkedin: string; github: string; hero_image: string | null; about_image: string | null; philosophy_quote: string; bio: string; }
interface Stat { id?: string; value: number; suffix: string; label: string; sort_order?: number; }
interface Pillar { id?: string; title: string; description: string; icon: string; sort_order?: number; }
interface Testimonial { id?: string; name: string; title: string; quote: string; rating: number; avatar: string | null; sort_order?: number; }
interface TimelineEvent { id?: string; year: string; title: string; description: string; sort_order?: number; }
interface Venture { id?: string; name: string; role: string; type: string; duration: string; description: string; revenue: string; users: string; team: string; achievements: string[]; link: string; image: string | null; sort_order?: number; }
interface BlogPost { id?: string; title: string; excerpt: string; category: string; read_time: string; date: string; image: string | null; featured: boolean; content: string; sort_order?: number; }
interface SpeakingEvent { id?: string; title: string; date: string; location: string; type: string; description: string; video_url: string; sort_order?: number; }
interface MediaAppearance { id?: string; title: string; publication: string; date: string; type: string; link: string; sort_order?: number; }
interface FaqItem { id?: string; question: string; answer: string; sort_order?: number; }
interface ResumeDatum { id?: string; summary: string; }
interface ResumeExperience { id?: string; title: string; company: string; duration: string; achievements: string[]; sort_order?: number; }
interface ResumeEducation { id?: string; degree: string; institution: string; year: string; sort_order?: number; }
interface ResumeCertification { id?: string; name: string; sort_order?: number; }
interface ResumeSkill { id?: string; name: string; sort_order?: number; }
interface ResumeAward { id?: string; name: string; sort_order?: number; }
interface GalleryImage { id?: string; url: string; alt: string; sort_order?: number; }
interface Value { id?: string; title: string; description: string; icon: string; sort_order?: number; }
interface LogoPartner { id?: string; name: string; sort_order?: number; }

// --- Fallback data ---
const defaultSiteConfig: SiteConfig = {
  name: fallback.siteConfig.name, title: fallback.siteConfig.title, tagline: fallback.siteConfig.tagline,
  roles: fallback.siteConfig.roles, email: fallback.siteConfig.email, phone: fallback.siteConfig.phone,
  whatsapp: fallback.siteConfig.whatsapp, calendly: fallback.siteConfig.calendly,
  address: fallback.siteConfig.address, twitter: fallback.siteConfig.social.twitter,
  linkedin: fallback.siteConfig.social.linkedin, github: fallback.siteConfig.social.github,
  hero_image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1920',
  about_image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800',
  philosophy_quote: "Africa doesn't just need technology — it needs technology built for its reality. When we design from the continent, for the continent, we create solutions that the world learns from.",
  bio: "Jonah Kimani is a Kenyan tech entrepreneur and the CEO of Qeem Labs, one of Africa's fastest-growing digital agencies. With over 15 years in the technology sector, he has built and scaled multiple ventures that are shaping the continent's digital landscape.",
};
const fbStats: Stat[] = fallback.stats.map((s, i) => ({ ...s, sort_order: i + 1 }));
const fbPillars: Pillar[] = fallback.pillars.map((p, i) => ({ ...p, sort_order: i + 1 }));
const fbTestimonials: Testimonial[] = fallback.testimonials.map((t, i) => ({ ...t, avatar: t.avatar ?? null, sort_order: i + 1 }));
const fbTimeline: TimelineEvent[] = fallback.timelineEvents.map((t, i) => ({ ...t, sort_order: i + 1 }));
const fbVentures: Venture[] = fallback.ventures.map((v, i) => ({ name: v.name, role: v.role, type: v.type, duration: v.duration, description: v.description, revenue: v.metrics.revenue, users: v.metrics.users, team: v.metrics.team, achievements: v.achievements, link: v.link, image: v.image ?? null, sort_order: i + 1 }));
const fbBlog: BlogPost[] = fallback.blogPosts.map((p, i) => ({ title: p.title, excerpt: p.excerpt, category: p.category, read_time: p.readTime, date: p.date, image: p.image ?? null, featured: p.featured, content: '', sort_order: i + 1 }));
const fbSpeaking: SpeakingEvent[] = fallback.speakingEvents.map((s, i) => ({ title: s.title, date: s.date, location: s.location, type: s.type, description: s.description, video_url: s.videoUrl ?? '', sort_order: i + 1 }));
const fbMedia: MediaAppearance[] = fallback.mediaAppearances.map((m, i) => ({ ...m, sort_order: i + 1 }));
const fbFaq: FaqItem[] = fallback.faqItems.map((f, i) => ({ ...f, sort_order: i + 1 }));
const fbGallery: GalleryImage[] = [
  { url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Gallery 1', sort_order: 1 },
  { url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Gallery 2', sort_order: 2 },
  { url: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Gallery 3', sort_order: 3 },
  { url: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Gallery 4', sort_order: 4 },
];
const fbValues: Value[] = [
  { title: 'Innovation', description: 'Pushing boundaries and embracing new technologies to solve real problems.', icon: 'Lightbulb', sort_order: 1 },
  { title: 'Integrity', description: 'Operating with transparency, honesty, and accountability in everything.', icon: 'Heart', sort_order: 2 },
  { title: 'Impact', description: "Creating solutions that make a measurable difference in people's lives.", icon: 'Globe', sort_order: 3 },
  { title: 'Community', description: 'Building ecosystems that uplift teams, partners, and the broader tech community.', icon: 'Users', sort_order: 4 },
  { title: 'Learning', description: 'Committed to continuous growth and sharing knowledge with the next generation.', icon: 'BookOpen', sort_order: 5 },
  { title: 'Excellence', description: 'Delivering world-class quality that competes on the global stage.', icon: 'Award', sort_order: 6 },
];
const fbLogos: LogoPartner[] = fallback.logoPartners.map((n, i) => ({ name: n, sort_order: i + 1 }));

// --- Hooks with caching ---
export function useSiteConfig() {
  const [data, setData] = useState<SiteConfig>(defaultSiteConfig);
  useEffect(() => {
    fetchSingle<SiteConfig>('site_config').then(r => { if (r) setData(r); });
  }, []);
  return { data, refetch: () => { invalidateCache('site_config'); fetchSingle<SiteConfig>('site_config').then(d => { if (d) setData(d); }); } };
}

export function useStats() {
  const [data, setData] = useState<Stat[]>(fbStats);
  useEffect(() => { fetchTable<Stat>('stats').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('stats'); fetchTable<Stat>('stats').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function usePillars() {
  const [data, setData] = useState<Pillar[]>(fbPillars);
  useEffect(() => { fetchTable<Pillar>('pillars').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('pillars'); fetchTable<Pillar>('pillars').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useTestimonials() {
  const [data, setData] = useState<Testimonial[]>(fbTestimonials);
  useEffect(() => { fetchTable<Testimonial>('testimonials').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('testimonials'); fetchTable<Testimonial>('testimonials').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useTimeline() {
  const [data, setData] = useState<TimelineEvent[]>(fbTimeline);
  useEffect(() => { fetchTable<TimelineEvent>('timeline_events').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('timeline_events'); fetchTable<TimelineEvent>('timeline_events').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useVentures() {
  const [data, setData] = useState<Venture[]>(fbVentures);
  useEffect(() => { fetchTable<Record<string, unknown>>('ventures').then(r => { if (r?.length) setData(orderBySort(r.map(convertVenture))); }); }, []);
  return { data, refetch: () => { invalidateCache('ventures'); fetchTable<Record<string, unknown>>('ventures').then(r => { if (r) setData(orderBySort(r.map(convertVenture))); }); } };
}

export function useBlogPosts() {
  const [data, setData] = useState<BlogPost[]>(fbBlog);
  useEffect(() => { fetchTable<BlogPost>('blog_posts').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('blog_posts'); fetchTable<BlogPost>('blog_posts').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useSpeakingEvents() {
  const [data, setData] = useState<SpeakingEvent[]>(fbSpeaking);
  useEffect(() => { fetchTable<SpeakingEvent>('speaking_events').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('speaking_events'); fetchTable<SpeakingEvent>('speaking_events').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useMediaAppearances() {
  const [data, setData] = useState<MediaAppearance[]>(fbMedia);
  useEffect(() => { fetchTable<MediaAppearance>('media_appearances').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('media_appearances'); fetchTable<MediaAppearance>('media_appearances').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useFaqItems() {
  const [data, setData] = useState<FaqItem[]>(fbFaq);
  useEffect(() => { fetchTable<FaqItem>('faq_items').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('faq_items'); fetchTable<FaqItem>('faq_items').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useResumeSummary() {
  const [data, setData] = useState<ResumeDatum>({ summary: fallback.resumeData.summary });
  useEffect(() => { fetchSingle<ResumeDatum>('resume_data').then(r => { if (r) setData(r); }); }, []);
  return { data, refetch: () => { invalidateCache('resume_data'); fetchSingle<ResumeDatum>('resume_data').then(d => { if (d) setData(d); }); } };
}

export function useResumeExperience() {
  const [data, setData] = useState<ResumeExperience[]>(fallback.resumeData.experience.map((e, i) => ({ ...e, sort_order: i + 1 })));
  useEffect(() => { fetchTable<Record<string, unknown>>('resume_experience').then(r => { if (r?.length) setData(orderBySort(r.map(convertExperience))); }); }, []);
  return { data, refetch: () => { invalidateCache('resume_experience'); fetchTable<Record<string, unknown>>('resume_experience').then(r => { if (r) setData(orderBySort(r.map(convertExperience))); }); } };
}

export function useResumeEducation() {
  const [data, setData] = useState<ResumeEducation[]>(fallback.resumeData.education.map((e, i) => ({ ...e, sort_order: i + 1 })));
  useEffect(() => { fetchTable<ResumeEducation>('resume_education').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('resume_education'); fetchTable<ResumeEducation>('resume_education').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useResumeCertifications() {
  const [data, setData] = useState<ResumeCertification[]>(fallback.resumeData.certifications.map((c, i) => ({ name: c, sort_order: i + 1 })));
  useEffect(() => { fetchTable<ResumeCertification>('resume_certifications').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('resume_certifications'); fetchTable<ResumeCertification>('resume_certifications').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useResumeSkills() {
  const [data, setData] = useState<ResumeSkill[]>(fallback.resumeData.skills.map((s, i) => ({ name: s, sort_order: i + 1 })));
  useEffect(() => { fetchTable<ResumeSkill>('resume_skills').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('resume_skills'); fetchTable<ResumeSkill>('resume_skills').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useResumeAwards() {
  const [data, setData] = useState<ResumeAward[]>(fallback.resumeData.awards.map((a, i) => ({ name: a, sort_order: i + 1 })));
  useEffect(() => { fetchTable<ResumeAward>('resume_awards').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('resume_awards'); fetchTable<ResumeAward>('resume_awards').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useGalleryImages() {
  const [data, setData] = useState<GalleryImage[]>(fbGallery);
  useEffect(() => { fetchTable<GalleryImage>('gallery_images').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('gallery_images'); fetchTable<GalleryImage>('gallery_images').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useValues() {
  const [data, setData] = useState<Value[]>(fbValues);
  useEffect(() => { fetchTable<Value>('values').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('values'); fetchTable<Value>('values').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export function useLogoPartners() {
  const [data, setData] = useState<LogoPartner[]>(fbLogos);
  useEffect(() => { fetchTable<LogoPartner>('logo_partners').then(r => { if (r?.length) setData(orderBySort(r)); }); }, []);
  return { data, refetch: () => { invalidateCache('logo_partners'); fetchTable<LogoPartner>('logo_partners').then(r => { if (r) setData(orderBySort(r)); }); } };
}

export type { SiteConfig, Stat, Pillar, Testimonial, TimelineEvent, Venture, BlogPost, SpeakingEvent, MediaAppearance, FaqItem, ResumeDatum, ResumeExperience, ResumeEducation, ResumeCertification, ResumeSkill, ResumeAward, GalleryImage, Value, LogoPartner };
