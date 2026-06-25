import { useState } from 'react';
import { useCrud, SectionHeader, InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import ImageUpload from '../../../components/ImageUpload';
import type { Testimonial } from '../../../lib/dataCache';

export default function TestimonialsEditor() {
  const { items, loading, saving, save, remove } = useCrud<Testimonial>('testimonials');
  const [editing, setEditing] = useState<Partial<Testimonial>>({});

  if (loading) return <LoadingState />;

  const startAdd = () => setEditing({ name: '', title: '', quote: '', rating: 5, avatar: null, sort_order: items.length + 1 });
  const startEdit = (item: Testimonial) => setEditing({ ...item });

  return (
    <div>
      <SectionHeader title="Testimonials" onAdd={startAdd} />
      {Object.keys(editing).length > 0 && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Name" value={editing.name ?? ''} onChange={v => setEditing(p => ({ ...p, name: v }))} />
            <InputField label="Title" value={editing.title ?? ''} onChange={v => setEditing(p => ({ ...p, title: v }))} placeholder="CTO, Company" />
            <InputField label="Rating" value={editing.rating ?? 5} onChange={v => setEditing(p => ({ ...p, rating: Number(v) }))} type="number" />
            <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          </div>
          <TextAreaField label="Quote" value={editing.quote ?? ''} onChange={v => setEditing(p => ({ ...p, quote: v }))} rows={3} />
          <ImageUpload label="Avatar" value={editing.avatar ?? null} onChange={v => setEditing(p => ({ ...p, avatar: v }))} />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2">
          {item.avatar && <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white">{item.name}</div>
            <div className="text-gray-400 text-sm truncate">{item.quote}</div>
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
