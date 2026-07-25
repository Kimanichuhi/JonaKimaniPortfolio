import { Download, Award, Briefcase, GraduationCap, Shield, Zap } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import { useResumeSummary, useResumeExperience, useResumeEducation, useResumeCertifications, useResumeSkills, useResumeAwards, usePageHeader } from '../lib/dataCache';

export default function ResumePage() {
  const { data: summary } = useResumeSummary();
  const { data: experience } = useResumeExperience();
  const { data: education } = useResumeEducation();
  const { data: certifications } = useResumeCertifications();
  const { data: skills } = useResumeSkills();
  const { data: awards } = useResumeAwards();
  const { data: header } = usePageHeader('resume');

  return (
    <div className="bg-primary-900 text-white">
      <PageHero title={header.title} subtitle={header.subtitle} background={header.background_image ?? undefined} />

      <section className="section-padding">
        <div className="container-default">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="mb-12">
              <div className="bg-gradient-to-r from-accent-500/20 to-teal-500/20 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Download Resume</h3>
                  <p className="text-white/50 text-sm">Get a PDF copy of the full resume</p>
                </div>
                <button className="btn-primary"><Download size={18} className="mr-2" /> Download PDF</button>
              </div>
            </AnimatedSection>

            {summary && (
              <AnimatedSection className="mb-12">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-3">Professional Summary</h2>
                  <p className="text-white/60 leading-relaxed">{summary.summary}</p>
                </div>
              </AnimatedSection>
            )}

            {experience.length > 0 && (
              <AnimatedSection className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Briefcase size={24} className="text-accent-400" /> Key Experience</h2>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id ?? exp.company} className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{exp.title}</h3>
                          <p className="text-accent-400 text-sm">{exp.company}</p>
                        </div>
                        <span className="text-white/30 text-sm">{exp.duration}</span>
                      </div>
                      <ul className="space-y-2">
                        {exp.achievements.map((a) => (
                          <li key={a} className="flex items-start gap-2 text-white/50 text-sm"><Zap size={14} className="text-teal-400 shrink-0 mt-0.5" />{a}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {education.length > 0 && (
              <AnimatedSection className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><GraduationCap size={24} className="text-accent-400" /> Education</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {education.map((edu) => (
                    <div key={edu.id ?? edu.degree} className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <div className="text-accent-400 text-sm mb-1">{edu.year}</div>
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-white/50 text-sm">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {certifications.length > 0 && (
              <AnimatedSection className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Shield size={24} className="text-accent-400" /> Certifications</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {certifications.map((cert) => (
                    <div key={cert.id ?? cert.name} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-3">
                      <Shield size={18} className="text-teal-400 shrink-0" />
                      <span className="text-sm text-white/70">{cert.name}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {skills.length > 0 && (
              <AnimatedSection className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Zap size={24} className="text-accent-400" /> Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <span key={skill.id ?? skill.name} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-default">{skill.name}</span>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {awards.length > 0 && (
              <AnimatedSection>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Award size={24} className="text-accent-400" /> Awards & Recognition</h2>
                <div className="space-y-4">
                  {awards.map((award) => (
                    <div key={award.id ?? award.name} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-3">
                      <Award size={18} className="text-accent-400 shrink-0" />
                      <span className="text-sm text-white/70">{award.name}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
