import { useState } from 'react';
import { useCrud, SectionHeader, InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import ImageUpload from '../../../components/ImageUpload';
import type { Venture } from '../../../lib/dataCache';

export default function VenturesEditor() {
  const { items, loading, saving, save, remove } = useCrud<Venture>('ventures');
  const [editing, setEditing] = useState<Partial<Venture>>({});

  if (loading) return <LoadingState />;

  const startAdd = () => setEditing({ name: '', role: '', type: 'Founder', duration: '', description: '', revenue: '', users: '', team: '', achievements: [], link: '', image: null, sort_order: items.length + 1 });
  const startEdit = (item: Venture) => setEditing({ ...item, achievements: item.achievements ?? [] });

  const setAch = (val: string) => setEditing(p => ({ ...p, achievements: val.split('\n').filter(Boolean) }));

  return (
    <div>
      <SectionHeader title="Ventures" onAdd={startAdd} />
      {Object.keys(editing).length > 0 && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <div className="grid sm:grid-cols-3 gap-4">
            <InputField label="Name" value={editing.name ?? ''} onChange={v => setEditing(p => ({ ...p, name: v }))} />
            <InputField label="Role" value={editing.role ?? ''} onChange={v => setEditing(p => ({ ...p, role: v }))} />
            <InputField label="Type" value={editing.type ?? 'Founder'} onChange={v => setEditing(p => ({ ...p, type: v }))} placeholder="Founder, CEO, Investor, Advisor" />
            <InputField label="Duration" value={editing.duration ?? ''} onChange={v => setEditing(p => ({ ...p, duration: v }))} placeholder="2016 - Present" />
            <InputField label="Revenue" value={editing.revenue ?? ''} onChange={v => setEditing(p => ({ ...p, revenue: v }))} />
            <InputField label="Users" value={editing.users ?? ''} onChange={v => setEditing(p => ({ ...p, users: v }))} />
            <InputField label="Team Size" value={editing.team ?? ''} onChange={v => setEditing(p => ({ ...p, team: v }))} />
            <InputField label="Link" value={editing.link ?? ''} onChange={v => setEditing(p => ({ ...p, link: v }))} />
            <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          </div>
          <TextAreaField label="Description" value={editing.description ?? ''} onChange={v => setEditing(p => ({ ...p, description: v }))} rows={3} />
          <TextAreaField label="Achievements (one per line)" value={(editing.achievements ?? []).join('\n')} onChange={setAch} rows={4} />
          <ImageUpload label="Image" value={editing.image ?? null} onChange={v => setEditing(p => ({ ...p, image: v }))} />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing as Partial<Venture>).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2">
          {item.image && <img src={item.image} alt={item.name} className="w-16 h-12 rounded object-cover" />}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white">{item.name} <span className="text-accent-400 text-sm">({item.type})</span></div>
            <div className="text-gray-400 text-sm">{item.role} • {item.duration}</div>
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
