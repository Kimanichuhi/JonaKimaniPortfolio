import { useCrud } from './useCrud';
import { useState } from 'react';
import { SectionHeader, InputField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import ImageUpload from '../../../components/ImageUpload';
import type { GalleryImage } from '../../../lib/dataCache';

export default function GalleryEditor() {
  const { items, loading, saving, save, remove } = useCrud<GalleryImage>('gallery_images');
  const [editing, setEditing] = useState<Partial<GalleryImage>>({});

  if (loading) return <LoadingState />;

  const startAdd = () => setEditing({ url: '', alt: '', sort_order: items.length + 1 });

  return (
    <div>
      <SectionHeader title="Gallery Images" onAdd={startAdd} />
      {Object.keys(editing).length > 0 && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <ImageUpload label="Image" value={editing.url ?? null} onChange={v => setEditing(p => ({ ...p, url: v ?? '' }))} />
          <InputField label="Alt Text" value={editing.alt ?? ''} onChange={v => setEditing(p => ({ ...p, alt: v }))} />
          <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing as Partial<GalleryImage>).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        {items.map(item => (
          <div key={item.id} className="relative group">
            <img src={item.url} alt={item.alt} className="w-full aspect-square object-cover rounded-lg border border-gray-800" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button onClick={() => setEditing({ ...item })} className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600">Edit</button>
              <button onClick={() => remove(item.id!)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded text-xs hover:bg-red-500/20">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
