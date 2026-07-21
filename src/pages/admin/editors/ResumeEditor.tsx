import { useCrud } from './useCrud';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { SaveButton, InputField, TextAreaField, LoadingState } from './editorUtils';
import type { ResumeExperience, ResumeEducation, ResumeCertification, ResumeSkill, ResumeAward } from '../../../lib/dataCache';

export default function ResumeEditor() {
  const [summary, setSummary] = useState('');
  const [summaryId, setSummaryId] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const experience = useCrud<ResumeExperience>('resume_experience');
  const education = useCrud<ResumeEducation>('resume_education');
  const certifications = useCrud<ResumeCertification>('resume_certifications');
  const skills = useCrud<ResumeSkill>('resume_skills');
  const awards = useCrud<ResumeAward>('resume_awards');

  const [editingExp, setEditingExp] = useState<Partial<ResumeExperience>>({});
  const [editingEdu, setEditingEdu] = useState<Partial<ResumeEducation>>({});
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newAward, setNewAward] = useState('');

  useEffect(() => {
    supabase.from('resume_data').select('*').limit(1).single().then(({ data }) => {
      if (data) { setSummary(data.summary); setSummaryId(data.id); }
      setLoading(false);
    });
  }, []);

  const saveSummary = async () => {
    setSaving(true);
    if (summaryId) await supabase.from('resume_data').update({ summary }).eq('id', summaryId);
    else {
      const { data } = await supabase.from('resume_data').insert([{ summary }]).select().single();
      if (data) setSummaryId(data.id);
    }
    setSaving(false);
  };

  if (loading || experience.loading) return <LoadingState />;

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div>
        <h3 className="text-lg font-bold mb-3">Professional Summary</h3>
        <TextAreaField label="" value={summary} onChange={setSummary} rows={4} />
        <div className="flex justify-end mt-2"><SaveButton saving={saving} onClick={saveSummary} /></div>
      </div>

      {/* Experience */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Experience</h3>
          <button onClick={() => setEditingExp({ title: '', company: '', duration: '', achievements: [], sort_order: experience.items.length + 1 })} className="px-3 py-1.5 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30">+ Add</button>
        </div>
        {Object.keys(editingExp).length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-3 space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <InputField label="Title" value={editingExp.title ?? ''} onChange={v => setEditingExp(p => ({ ...p, title: v }))} />
              <InputField label="Company" value={editingExp.company ?? ''} onChange={v => setEditingExp(p => ({ ...p, company: v }))} />
              <InputField label="Duration" value={editingExp.duration ?? ''} onChange={v => setEditingExp(p => ({ ...p, duration: v }))} />
            </div>
            <TextAreaField label="Achievements (one per line)" value={(editingExp.achievements ?? []).join('\n')} onChange={v => setEditingExp(p => ({ ...p, achievements: v.split('\n').filter(Boolean) }))} rows={3} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingExp({})} className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded text-sm">Cancel</button>
              <SaveButton saving={experience.saving} onClick={() => { experience.save(editingExp as Partial<ResumeExperience>).then(() => setEditingExp({})); }} />
            </div>
          </div>
        )}
        {experience.items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-3 mb-2">
            <div><span className="font-medium">{item.title}</span> <span className="text-gray-400 text-sm">at {item.company}</span></div>
            <div className="flex gap-2">
              <button onClick={() => setEditingExp({ ...item, achievements: item.achievements ?? [] })} className="text-xs text-gray-400 hover:text-white">Edit</button>
              <button onClick={() => experience.remove(item.id!)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Education</h3>
          <button onClick={() => setEditingEdu({ degree: '', institution: '', year: '', sort_order: education.items.length + 1 })} className="px-3 py-1.5 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30">+ Add</button>
        </div>
        {Object.keys(editingEdu).length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <InputField label="Degree" value={editingEdu.degree ?? ''} onChange={v => setEditingEdu(p => ({ ...p, degree: v }))} />
              <InputField label="Institution" value={editingEdu.institution ?? ''} onChange={v => setEditingEdu(p => ({ ...p, institution: v }))} />
              <InputField label="Year" value={editingEdu.year ?? ''} onChange={v => setEditingEdu(p => ({ ...p, year: v }))} />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setEditingEdu({})} className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded text-sm">Cancel</button>
              <SaveButton saving={education.saving} onClick={() => { education.save(editingEdu as Partial<ResumeEducation>).then(() => setEditingEdu({})); }} />
            </div>
          </div>
        )}
        {education.items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-3 mb-2">
            <div><span className="font-medium">{item.degree}</span> <span className="text-gray-400 text-sm">— {item.institution} ({item.year})</span></div>
            <div className="flex gap-2">
              <button onClick={() => setEditingEdu(item)} className="text-xs text-gray-400 hover:text-white">Edit</button>
              <button onClick={() => education.remove(item.id!)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-bold mb-3">Skills</h3>
        <div className="flex gap-2 mb-3">
          <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500" />
          <button onClick={() => { if (newSkill.trim()) { skills.save({ name: newSkill.trim(), sort_order: skills.items.length + 1 }); setNewSkill(''); } }} className="px-4 py-2 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.items.map(item => (
            <span key={item.id} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
              {item.name}
              <button onClick={() => skills.remove(item.id!)} className="text-red-400 hover:text-red-300 text-xs">x</button>
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-lg font-bold mb-3">Certifications</h3>
        <div className="flex gap-2 mb-3">
          <input value={newCert} onChange={e => setNewCert(e.target.value)} placeholder="Add certification..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500" />
          <button onClick={() => { if (newCert.trim()) { certifications.save({ name: newCert.trim(), sort_order: certifications.items.length + 1 }); setNewCert(''); } }} className="px-4 py-2 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30">Add</button>
        </div>
        {certifications.items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-3 mb-2">
            <span className="text-sm">{item.name}</span>
            <button onClick={() => certifications.remove(item.id!)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
          </div>
        ))}
      </div>

      {/* Awards */}
      <div>
        <h3 className="text-lg font-bold mb-3">Awards</h3>
        <div className="flex gap-2 mb-3">
          <input value={newAward} onChange={e => setNewAward(e.target.value)} placeholder="Add award..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500" />
          <button onClick={() => { if (newAward.trim()) { awards.save({ name: newAward.trim(), sort_order: awards.items.length + 1 }); setNewAward(''); } }} className="px-4 py-2 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30">Add</button>
        </div>
        {awards.items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-3 mb-2">
            <span className="text-sm">{item.name}</span>
            <button onClick={() => awards.remove(item.id!)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
