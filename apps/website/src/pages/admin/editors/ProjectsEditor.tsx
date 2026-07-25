import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ImageUpload from '../../../components/ImageUpload';
import { SectionHeader, InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import type { ProjectRow } from '../../../lib/dataCache';
import { categories as categoryOptions } from '../../../data/projects';

const categoryLabels = categoryOptions.filter(c => c.id !== 'all').map(c => c.label);

function linesToArray(text: string): string[] {
  return text.split('\n').map(s => s.trim()).filter(Boolean);
}

function arrayToLines(arr: string[] | undefined): string {
  return (arr ?? []).join('\n');
}

function csvToArray(text: string): string[] {
  return text.split(',').map(s => s.trim()).filter(Boolean);
}

function arrayToCsv(arr: string[] | undefined): string {
  return (arr ?? []).join(', ');
}

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const emptyDetails = {
  overview: '', problem: '', objectives: [] as string[], features: [] as string[],
  architecture: '', challenges: [] as string[], solutions: [] as string[],
  lessons: [] as string[], futureImprovements: [] as string[],
};

export default function ProjectsEditor() {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<ProjectRow> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    supabase.from('projects').select('*').order('sort_order', { ascending: true }).then(({ data }) => {
      setItems((data as ProjectRow[]) ?? []);
      setLoading(false);
    });
  };

  useEffect(fetchItems, []);

  if (loading) return <LoadingState />;

  const startAdd = () => {
    setIsNew(true);
    setEditing({
      id: '', name: '', url: '', category: categoryLabels[0] ?? '', description: '', short_description: '',
      tags: [], technologies: [], featured: false, date: new Date().toISOString().split('T')[0],
      image: null, details: { ...emptyDetails }, sort_order: items.length + 1,
    });
  };

  const startEdit = (item: ProjectRow) => {
    setIsNew(false);
    setEditing({ ...item, date: item.date ? String(item.date).split('T')[0] : '' });
  };

  const cancel = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    const slug = (editing.id ?? '').trim();
    if (!slug || !editing.name) return;
    setSaving(true);
    const row = { ...editing, id: slug };
    if (isNew) {
      await supabase.from('projects').insert([row]);
    } else {
      const { id, ...rest } = row;
      await supabase.from('projects').update(rest).eq('id', id);
    }
    setSaving(false);
    setEditing(null);
    fetchItems();
  };

  const remove = async (id: string) => {
    setSaving(true);
    await supabase.from('projects').delete().eq('id', id);
    setSaving(false);
    fetchItems();
  };

  return (
    <div>
      <SectionHeader title="Projects" onAdd={startAdd} />

      {editing && (
        <ItemCard onDelete={!isNew ? () => remove(editing.id!) : undefined} saving={saving}>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField
              label="Slug (URL) *"
              value={editing.id ?? ''}
              onChange={v => setEditing(p => ({ ...p, id: isNew ? slugify(v) : p?.id }))}
              placeholder="fleet-manager-os"
            />
            <InputField label="Name *" value={editing.name ?? ''} onChange={v => setEditing(p => ({ ...p, name: v, id: isNew && !p?.id ? slugify(v) : p?.id }))} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Live URL" value={editing.url ?? ''} onChange={v => setEditing(p => ({ ...p, url: v }))} placeholder="https://example.com" />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
              <select
                value={editing.category ?? categoryLabels[0]}
                onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-500"
              >
                {categoryLabels.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Date" value={editing.date ?? ''} onChange={v => setEditing(p => ({ ...p, date: v }))} type="date" />
            <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.featured ?? false} onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-accent-500 focus:ring-accent-500" />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
          </div>
          <TextAreaField label="Short Description" value={editing.short_description ?? ''} onChange={v => setEditing(p => ({ ...p, short_description: v }))} rows={2} />
          <TextAreaField label="Full Description" value={editing.description ?? ''} onChange={v => setEditing(p => ({ ...p, description: v }))} rows={3} />
          <InputField label="Tags (comma-separated)" value={arrayToCsv(editing.tags)} onChange={v => setEditing(p => ({ ...p, tags: csvToArray(v) }))} placeholder="AI, Agriculture, Analytics" />
          <InputField label="Technologies (comma-separated)" value={arrayToCsv(editing.technologies)} onChange={v => setEditing(p => ({ ...p, technologies: csvToArray(v) }))} placeholder="React, TypeScript, Supabase" />
          <ImageUpload label="Preview Image" value={editing.image ?? null} onChange={v => setEditing(p => ({ ...p, image: v }))} />

          <div className="pt-2 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 mt-3">Case Study Details</h3>
            <div className="space-y-4">
              <TextAreaField label="Overview" value={editing.details?.overview ?? ''} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, overview: v } }))} rows={3} />
              <TextAreaField label="Problem Solved" value={editing.details?.problem ?? ''} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, problem: v } }))} rows={3} />
              <TextAreaField label="Objectives (one per line)" value={arrayToLines(editing.details?.objectives)} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, objectives: linesToArray(v) } }))} rows={4} />
              <TextAreaField label="Key Features (one per line)" value={arrayToLines(editing.details?.features)} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, features: linesToArray(v) } }))} rows={4} />
              <TextAreaField label="System Architecture" value={editing.details?.architecture ?? ''} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, architecture: v } }))} rows={3} />
              <TextAreaField label="Challenges (one per line, paired by order with Solutions)" value={arrayToLines(editing.details?.challenges)} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, challenges: linesToArray(v) } }))} rows={4} />
              <TextAreaField label="Solutions (one per line, paired by order with Challenges)" value={arrayToLines(editing.details?.solutions)} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, solutions: linesToArray(v) } }))} rows={4} />
              <TextAreaField label="Lessons Learned (one per line)" value={arrayToLines(editing.details?.lessons)} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, lessons: linesToArray(v) } }))} rows={3} />
              <TextAreaField label="Future Improvements (one per line)" value={arrayToLines(editing.details?.futureImprovements)} onChange={v => setEditing(p => ({ ...p, details: { ...emptyDetails, ...p?.details, futureImprovements: linesToArray(v) } }))} rows={3} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={cancel} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={save} />
          </div>
        </ItemCard>
      )}

      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2">
          {item.image && <img src={item.image} alt={item.name} className="w-20 h-14 rounded object-cover" />}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white">{item.name} {item.featured && <span className="text-accent-400 text-xs ml-1">[Featured]</span>}</div>
            <div className="text-gray-400 text-sm">{item.category} • {item.date} • /projects/{item.id}</div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => startEdit(item)} className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 transition-colors">Edit</button>
            <button onClick={() => remove(item.id!)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded text-xs hover:bg-red-500/20 transition-colors">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
