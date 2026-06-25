import { useState } from 'react';
import { useCrud, SectionHeader, InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import type { TimelineEvent } from '../../../lib/dataCache';

export default function TimelineEditor() {
  const { items, loading, saving, save, remove } = useCrud<TimelineEvent>('timeline_events');
  const [editing, setEditing] = useState<Partial<TimelineEvent>>({});

  if (loading) return <LoadingState />;

  const startAdd = () => setEditing({ year: '', title: '', description: '', sort_order: items.length + 1 });
  const startEdit = (item: TimelineEvent) => setEditing({ ...item });

  return (
    <div>
      <SectionHeader title="Timeline Events" onAdd={startAdd} />
      {Object.keys(editing).length > 0 && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <div className="grid sm:grid-cols-3 gap-4">
            <InputField label="Year" value={editing.year ?? ''} onChange={v => setEditing(p => ({ ...p, year: v }))} placeholder="2026" />
            <InputField label="Title" value={editing.title ?? ''} onChange={v => setEditing(p => ({ ...p, title: v }))} />
            <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          </div>
          <TextAreaField label="Description" value={editing.description ?? ''} onChange={v => setEditing(p => ({ ...p, description: v }))} rows={3} />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2">
          <div className="bg-accent-500/20 text-accent-400 rounded-lg px-3 py-1 text-sm font-bold">{item.year}</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white">{item.title}</div>
            <div className="text-gray-400 text-sm truncate">{item.description}</div>
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
