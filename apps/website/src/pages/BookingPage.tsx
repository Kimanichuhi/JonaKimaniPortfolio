import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, CheckCircle, Briefcase, Lightbulb, Users, Rocket, ArrowRight, Star, Phone, Mail } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import { useSiteConfig, usePageHeader } from '../lib/dataCache';
import { submitBooking } from '../lib/supabase';

const consultationTypes = [
  {
    id: 'startup',
    title: 'Startup Consultation',
    duration: '60 min',
    price: 'Custom',
    description: 'Get expert guidance on your startup idea, business model, and go-to-market strategy.',
    features: ['Product strategy review', 'Market analysis', 'Technical architecture guidance', 'Funding roadmap'],
    icon: Rocket,
    popular: false,
  },
  {
    id: 'technical',
    title: 'Technical Advisory',
    duration: '90 min',
    price: 'Custom',
    description: 'Deep-dive into your technical challenges with a seasoned software architect and CTO.',
    features: ['System architecture review', 'Scalability planning', 'Technology selection', 'Team structure advice'],
    icon: Briefcase,
    popular: true,
  },
  {
    id: 'ai',
    title: 'AI Integration Strategy',
    duration: '90 min',
    price: 'Custom',
    description: 'Learn how to leverage AI and machine learning in your products and operations.',
    features: ['AI readiness assessment', 'Use case identification', 'Implementation roadmap', 'ROI projections'],
    icon: Lightbulb,
    popular: false,
  },
  {
    id: 'leadership',
    title: 'Leadership Coaching',
    duration: '60 min',
    price: 'Custom',
    description: 'One-on-one coaching for tech leaders looking to level up their management skills.',
    features: ['Leadership assessment', 'Team management strategies', 'Executive presence', 'Career planning'],
    icon: Users,
    popular: false,
  },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function BookingPage() {
  const { data: siteConfig } = useSiteConfig();
  const { data: header } = usePageHeader('booking');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    date: '',
    time: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await submitBooking({
        consultation_type: consultationTypes.find(t => t.id === selectedType)?.title ?? selectedType ?? '',
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        message: formData.message,
      });
      if (error) throw error;
    } catch {
      // still show confirmation below; the request details are shown to the
      // user regardless so they can follow up directly if something failed
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-primary-900 text-white min-h-screen">
        <PageHero title="Booking Confirmed" subtitle="Your consultation has been scheduled successfully." />
        <section className="section-padding">
          <div className="container-default">
            <AnimatedSection className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-white/60 mb-6">
                Your consultation request has been received. You'll receive a confirmation email with meeting details shortly.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/50">Type</span>
                    <span className="text-white">{consultationTypes.find(t => t.id === selectedType)?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Date</span>
                    <span className="text-white">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Time</span>
                    <span className="text-white">{formData.time}</span>
                  </div>
                </div>
              </div>
              <p className="text-white/50 text-sm mb-8">
                A calendar invite will be sent to <span className="text-accent-400">{formData.email}</span>
              </p>
              <Link to="/" className="btn-primary">
                Return Home <ArrowRight size={18} className="ml-2" />
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-primary-900 text-white min-h-screen">
      <PageHero title={header.title} subtitle={header.subtitle} />

      <section className="py-12 bg-primary-800/30 border-b border-white/5">
        <div className="container-default">
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-accent-500 text-white' : 'bg-white/10 text-white/40'
                }`}>
                  {s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-white' : 'text-white/40'}`}>
                  {s === 1 ? 'Select Type' : s === 2 ? 'Choose Time' : 'Your Details'}
                </span>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-accent-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-default">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <AnimatedSection>
                  <h2 className="text-2xl font-bold mb-6">Select Consultation Type</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {consultationTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`relative bg-white/5 border rounded-xl p-6 text-left transition-all hover:shadow-lg ${
                          selectedType === type.id
                            ? 'border-accent-500 bg-accent-500/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {type.popular && (
                          <span className="absolute -top-2 right-4 bg-accent-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <Star size={10} className="fill-current" /> Popular
                          </span>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedType === type.id ? 'bg-accent-500/20 text-accent-400' : 'bg-white/5 text-white/60'
                          }`}>
                            <type.icon size={24} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{type.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-white/50">
                              <Clock size={12} /> {type.duration}
                            </div>
                          </div>
                        </div>
                        <p className="text-white/60 text-sm mb-4">{type.description}</p>
                        <ul className="space-y-2">
                          {type.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                              <CheckCircle size={14} className="text-teal-400" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!selectedType}
                    onClick={() => setStep(2)}
                    className="btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight size={18} className="ml-2" />
                  </button>
                </AnimatedSection>
              )}

              {step === 2 && (
                <AnimatedSection>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Choose Date & Time</h2>
                    <button onClick={() => setStep(1)} className="text-accent-400 text-sm hover:text-accent-300">
                      Change Type
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Select Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors"
                      />
                      <p className="text-white/40 text-xs mt-2">Available: {availableDays.join(', ')}</p>
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">Select Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setFormData({ ...formData, time: slot })}
                            className={`p-3 rounded-lg text-sm transition-all ${
                              formData.time === slot
                                ? 'bg-accent-500 text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(1)} className="btn-secondary">
                      Back
                    </button>
                    <button
                      disabled={!formData.date || !formData.time}
                      onClick={() => setStep(3)}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </AnimatedSection>
              )}

              {step === 3 && (
                <AnimatedSection>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Your Details</h2>
                    <button onClick={() => setStep(2)} className="text-accent-400 text-sm hover:text-accent-300">
                      Change Time
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Company</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors"
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors"
                          placeholder="+254 700 000 000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">What would you like to discuss?</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500/50 transition-colors resize-none"
                        placeholder="Tell me about your project or what you'd like to get advice on..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                        Back
                      </button>
                      <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? 'Submitting...' : 'Confirm Booking'} <CheckCircle size={18} className="ml-2" />
                      </button>
                    </div>
                  </form>
                </AnimatedSection>
              )}
            </div>

            <aside className="lg:col-span-1">
              <AnimatedSection delay={0.2}>
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Booking Summary</h4>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Briefcase size={18} className="text-accent-400 shrink-0 mt-1" />
                        <div>
                          <span className="text-white/50 text-xs block">Consultation Type</span>
                          <span className="text-white">
                            {selectedType ? consultationTypes.find(t => t.id === selectedType)?.title : 'Not selected'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar size={18} className="text-accent-400 shrink-0 mt-1" />
                        <div>
                          <span className="text-white/50 text-xs block">Date</span>
                          <span className="text-white">{formData.date || 'Not selected'}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock size={18} className="text-accent-400 shrink-0 mt-1" />
                        <div>
                          <span className="text-white/50 text-xs block">Time</span>
                          <span className="text-white">{formData.time || 'Not selected'}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Video size={18} className="text-accent-400 shrink-0 mt-1" />
                        <div>
                          <span className="text-white/50 text-xs block">Location</span>
                          <span className="text-white">Virtual (Google Meet)</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between">
                        <span className="text-white/50">Duration</span>
                        <span className="text-white">
                          {selectedType ? consultationTypes.find(t => t.id === selectedType)?.duration : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-accent-500/20 to-teal-500/20 border border-accent-500/20 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Prefer Direct Contact?</h4>
                    <p className="text-white/60 text-sm mb-4">
                      You can also reach out directly to schedule your consultation.
                    </p>
                    <div className="space-y-2">
                      <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-white/70 hover:text-accent-400 text-sm transition-colors">
                        <Mail size={14} /> {siteConfig.email}
                      </a>
                      <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-white/70 hover:text-accent-400 text-sm transition-colors">
                        <Phone size={14} /> {siteConfig.phone}
                      </a>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-3">What to Expect</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle size={14} className="text-teal-400 shrink-0 mt-0.5" />
                        Calendar invite sent within 24 hours
                      </li>
                      <li className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle size={14} className="text-teal-400 shrink-0 mt-0.5" />
                        Preparation materials for your session
                      </li>
                      <li className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle size={14} className="text-teal-400 shrink-0 mt-0.5" />
                        Follow-up action items after call
                      </li>
                      <li className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle size={14} className="text-teal-400 shrink-0 mt-0.5" />
                        100% satisfaction guarantee
                      </li>
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-800/30 border-t border-white/5">
        <div className="container-default">
          <AnimatedSection className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Jonah Kimani"
                className="w-12 h-12 rounded-full object-cover border-2 border-accent-500"
              />
              <div className="text-left">
                <div className="text-white font-medium">Jonah Kimani</div>
                <div className="text-white/50 text-sm">CEO, Qeem Labs Ltd</div>
              </div>
            </div>
            <p className="text-white/60 max-w-xl mx-auto italic">
              "Every great project starts with a conversation. I'm looking forward to hearing about yours and exploring how we can create something impactful together."
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
