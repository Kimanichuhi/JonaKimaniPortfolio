import { useCrud } from './useCrud';
import { useState } from 'react';
import { SectionHeader, InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import ImageUpload from '../../../components/ImageUpload';
import type { BlogPost } from '../../../lib/dataCache';

const categories = ['Technology & Innovation', 'Leadership', 'African Tech', 'Entrepreneurship', 'Opinion'];

export default function BlogEditor() {
  const { items, loading, saving, save, remove } = useCrud<BlogPost>('blog_posts');
  const [editing, setEditing] = useState<Partial<BlogPost>>({});

  if (loading) return <LoadingState />;

  const startAdd = () => setEditing({ title: '', excerpt: '', category: 'Technology & Innovation', read_time: '5 min', date: new Date().toISOString().split('T')[0], image: null, featured: false, content: '', sort_order: items.length + 1 });
  const startEdit = (item: BlogPost) => setEditing({ ...item, date: item.date ? String(item.date).split('T')[0] : '' });

  return (
    <div>
      <SectionHeader title="Blog Posts" onAdd={startAdd} />
      {Object.keys(editing).length > 0 && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <InputField label="Title" value={editing.title ?? ''} onChange={v => setEditing(p => ({ ...p, title: v }))} />
          <TextAreaField label="Excerpt" value={editing.excerpt ?? ''} onChange={v => setEditing(p => ({ ...p, excerpt: v }))} rows={3} />
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
              <select value={editing.category ?? 'Technology & Innovation'} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-500">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <InputField label="Read Time" value={editing.read_time ?? ''} onChange={v => setEditing(p => ({ ...p, read_time: v }))} placeholder="5 min" />
            <InputField label="Date" value={editing.date ?? ''} onChange={v => setEditing(p => ({ ...p, date: v }))} type="date" />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.featured ?? false} onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-accent-500 focus:ring-accent-500" />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
            <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          </div>
          <ImageUpload label="Featured Image" folder="blog" value={editing.image ?? null} onChange={v => setEditing(p => ({ ...p, image: v }))} />
          <TextAreaField label="Full Content" value={editing.content ?? ''} onChange={v => setEditing(p => ({ ...p, content: v }))} rows={8} placeholder="Markdown supported" />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing as Partial<BlogPost>).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2">
          {item.image && <img src={item.image} alt={item.title} className="w-20 h-14 rounded object-cover" />}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white">{item.title} {item.featured && <span className="text-accent-400 text-xs ml-1">[Featured]</span>}</div>
            <div className="text-gray-400 text-sm">{item.category} • {item.read_time} • {item.date}</div>
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
