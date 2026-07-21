import { useState } from 'react';
import { Sparkles, Download, Loader2 } from 'lucide-react';
import { TextAreaField } from './editorUtils';
import { supabase } from '../../../lib/supabase';
import {
  useResumeSummary,
  useResumeExperience,
  useResumeEducation,
  useResumeCertifications,
  useResumeSkills,
  useResumeAwards,
} from '../../../lib/dataCache';

interface TailoredExperience {
  title: string;
  company: string;
  duration: string;
  achievements: string[];
}

interface TailoredCv {
  summary: string;
  matchedKeywords: string[];
  experience: TailoredExperience[];
  skills: string[];
  provider?: 'anthropic' | 'openai';
}

export default function CvBuilderEditor() {
  const { data: summary } = useResumeSummary();
  const { data: experience } = useResumeExperience();
  const { data: education } = useResumeEducation();
  const { data: certifications } = useResumeCertifications();
  const { data: skills } = useResumeSkills();
  const { data: awards } = useResumeAwards();

  const [jobDescription, setJobDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [tailored, setTailored] = useState<TailoredCv | null>(null);

  const generate = async () => {
    if (!jobDescription.trim()) return;
    setGenerating(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/tailor-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({
          jobDescription,
          resume: {
            summary: summary.summary,
            experience: experience.map(({ title, company, duration, achievements }) => ({
              title, company, duration, achievements,
            })),
            education: education.map(({ degree, institution, year }) => ({ degree, institution, year })),
            certifications: certifications.map((c) => c.name),
            skills: skills.map((s) => s.name),
            awards: awards.map((a) => a.name),
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to generate tailored CV');
      }
      setTailored((await res.json()) as TailoredCv);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate tailored CV');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-1">CV Builder</h3>
        <p className="text-gray-400 text-sm mb-4">
          Paste a job description to generate a tailored version of your resume — rewritten summary, reordered
          experience, and the most relevant skills, all grounded in your real resume data.
        </p>
        <TextAreaField
          label="Job description"
          value={jobDescription}
          onChange={setJobDescription}
          rows={10}
          placeholder="Paste the job posting here..."
        />
        <div className="flex items-center justify-between mt-3">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={generate}
            disabled={generating || !jobDescription.trim()}
            className="ml-auto flex items-center gap-2 px-5 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {generating ? 'Generating...' : 'Generate Tailored CV'}
          </button>
        </div>
      </div>

      {tailored && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">Preview</h3>
              {tailored.provider === 'openai' && (
                <span className="text-xs bg-amber-500/15 text-amber-400 rounded px-2 py-0.5">
                  via OpenAI fallback
                </span>
              )}
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm transition-colors"
            >
              <Download size={14} /> Download PDF
            </button>
          </div>

          <div id="tailored-cv-print" className="bg-white text-gray-900 rounded-xl p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Tailored Resume</h1>

            <section className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Summary</h2>
              <p className="text-sm leading-relaxed">{tailored.summary}</p>
            </section>

            {tailored.matchedKeywords.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Matched Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {tailored.matchedKeywords.map((kw) => (
                    <span key={kw} className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-1">{kw}</span>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Experience</h2>
              <div className="space-y-4">
                {tailored.experience.map((exp) => (
                  <div key={`${exp.company}-${exp.title}`}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-semibold text-sm">{exp.title} — {exp.company}</h3>
                      <span className="text-xs text-gray-500 shrink-0">{exp.duration}</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {exp.achievements.map((a) => (
                        <li key={a} className="text-sm text-gray-700 flex gap-2">
                          <span>•</span><span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {tailored.skills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Skills</h2>
                <p className="text-sm">{tailored.skills.join(' · ')}</p>
              </section>
            )}

            {education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Education</h2>
                {education.map((edu) => (
                  <p key={`${edu.degree}-${edu.institution}`} className="text-sm">
                    {edu.degree} — {edu.institution} ({edu.year})
                  </p>
                ))}
              </section>
            )}

            {certifications.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Certifications</h2>
                <p className="text-sm">{certifications.map((c) => c.name).join(' · ')}</p>
              </section>
            )}

            {awards.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Awards</h2>
                <p className="text-sm">{awards.map((a) => a.name).join(' · ')}</p>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
