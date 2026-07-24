import { useCrud } from './useCrud';
import { useState } from 'react';
import { SectionHeader, InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import type { Pillar } from '../../../lib/dataCache';

export default function PillarsEditor() {
  const { items, loading, saving, save, remove } = useCrud<Pillar>('pillars');
  const [editing, setEditing] = useState<Partial<Pillar>>({});

  if (loading) return <LoadingState />;

  const startAdd = () => setEditing({ title: '', description: '', icon: 'Eye', sort_order: items.length + 1 });
  const startEdit = (item: Pillar) => setEditing({ ...item });

  return (
    <div>
      <SectionHeader title="Pillars" onAdd={startAdd} />
      {Object.keys(editing).length > 0 && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <div className="grid sm:grid-cols-3 gap-4">
            <InputField label="Title" value={editing.title ?? ''} onChange={v => setEditing(p => ({ ...p, title: v }))} placeholder="Vision" />
            <InputField label="Icon" value={editing.icon ?? 'Eye'} onChange={v => setEditing(p => ({ ...p, icon: v }))} placeholder="Eye, Crown, Target" />
            <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          </div>
          <TextAreaField label="Description" value={editing.description ?? ''} onChange={v => setEditing(p => ({ ...p, description: v }))} rows={2} />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2">
          <div><span className="font-medium text-white">{item.title}</span> <span className="text-gray-500 text-sm ml-2">({item.icon})</span><p className="text-gray-400 text-sm mt-1">{item.description}</p></div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => startEdit(item)} className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 transition-colors">Edit</button>
            <button onClick={() => remove(item.id!)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded text-xs hover:bg-red-500/20 transition-colors">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
