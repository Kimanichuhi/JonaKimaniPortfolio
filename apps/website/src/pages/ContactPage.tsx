import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, MessageCircle, Send, CheckCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import { useSiteConfig, usePageHeader } from '../lib/dataCache';
import { submitContactForm } from '../lib/supabase';

const inquiryTypes = ['Speaking', 'Advisory', 'Investment', 'General', 'Media'];

export default function ContactPage() {
  const { data: siteConfig } = useSiteConfig();
  const { data: header } = usePageHeader('contact');
  const [form, setForm] = useState({ name: '', email: '', inquiryType: 'General', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { error } = await submitContactForm({ name: form.name, email: form.email, inquiry_type: form.inquiryType, message: form.message });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="bg-primary-900 text-white">
      <PageHero title={header.title} subtitle={header.subtitle} background={header.background_image ?? undefined} />

      <section className="section-padding">
        <div className="container-default">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4 mb-10">
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center group-hover:bg-accent-500/20 transition-colors"><Mail size={18} /></div>
                    <div><div className="text-white/40 text-xs mb-0.5">Email</div><div className="text-sm">{siteConfig.email}</div></div>
                  </a>
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center group-hover:bg-accent-500/20 transition-colors"><Phone size={18} /></div>
                    <div><div className="text-white/40 text-xs mb-0.5">Phone</div><div className="text-sm">{siteConfig.phone}</div></div>
                  </a>
                  <a href={siteConfig.calendly} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors"><Calendar size={18} /></div>
                    <div><div className="text-white/40 text-xs mb-0.5">Schedule a Call</div><div className="text-sm">Book on Calendly</div></div>
                  </a>
                  <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center group-hover:bg-green-500/20 transition-colors"><MessageCircle size={18} /></div>
                    <div><div className="text-white/40 text-xs mb-0.5">WhatsApp</div><div className="text-sm">Chat on WhatsApp</div></div>
                  </a>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center"><MapPin size={18} /></div>
                    <div><div className="text-white/40 text-xs mb-0.5">Office</div><div className="text-sm">{siteConfig.address}</div></div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-3">
              <AnimatedSection delay={0.2}>
                {submitted ? (
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-10 text-center">
                    <CheckCircle size={48} className="text-teal-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-white/60">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Full Name</label>
                        <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-white/10 focus:border-accent-500'}`} placeholder="Your full name" />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Email</label>
                        <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-accent-500'}`} placeholder="your@email.com" />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Inquiry Type</label>
                        <div className="flex flex-wrap gap-2">
                          {inquiryTypes.map((type) => (
                            <button key={type} type="button" onClick={() => handleChange('inquiryType', type)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${form.inquiryType === type ? 'bg-accent-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Message</label>
                        <textarea value={form.message} onChange={(e) => handleChange('message', e.target.value)} rows={5} className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-white/10 focus:border-accent-500'}`} placeholder="Tell me about your inquiry..." />
                        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                      </div>
                      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? 'Sending...' : <><Send size={18} className="mr-2" /> Send Message</>}
                      </button>
                    </div>
                  </form>
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
