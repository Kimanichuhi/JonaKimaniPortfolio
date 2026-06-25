import { useState } from 'react';
import { useCrud, SectionHeader, InputField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import type { MediaAppearance } from '../../../lib/dataCache';

export default function MediaEditor() {
  const { items, loading, saving, save, remove } = useCrud<MediaAppearance>('media_appearances');
  const [editing, setEditing] = useState<Partial<MediaAppearance>>({});

  if (loading) return <LoadingState />;

  const startAdd = () => setEditing({ title: '', publication: '', date: '', type: 'Article', link: '', sort_order: items.length + 1 });
  const startEdit = (item: MediaAppearance) => setEditing({ ...item });

  return (
    <div>
      <SectionHeader title="Media Appearances" onAdd={startAdd} />
      {Object.keys(editing).length > 0 && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <div className="grid sm:grid-cols-3 gap-4">
            <InputField label="Title" value={editing.title ?? ''} onChange={v => setEditing(p => ({ ...p, title: v }))} />
            <InputField label="Publication" value={editing.publication ?? ''} onChange={v => setEditing(p => ({ ...p, publication: v }))} />
            <InputField label="Date" value={editing.date ?? ''} onChange={v => setEditing(p => ({ ...p, date: v }))} placeholder="May 2026" />
            <InputField label="Type" value={editing.type ?? 'Article'} onChange={v => setEditing(p => ({ ...p, type: v }))} placeholder="Podcast, Interview, Article, Video" />
            <InputField label="Link" value={editing.link ?? ''} onChange={v => setEditing(p => ({ ...p, link: v }))} />
            <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white">{item.title}</div>
            <div className="text-gray-400 text-sm">{item.publication} • {item.date} • {item.type}</div>
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
