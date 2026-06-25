import { useState } from 'react';
import { useCrud, SectionHeader, InputField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import type { Stat } from '../../../lib/dataCache';

export default function StatsEditor() {
  const { items, loading, saving, save, remove } = useCrud<Stat>('stats');
  const [editing, setEditing] = useState<Partial<Stat>>({});
  const [isAdding, setIsAdding] = useState(false);

  if (loading) return <LoadingState />;

  const startAdd = () => { setEditing({ value: 0, suffix: '+', label: '', sort_order: items.length + 1 }); setIsAdding(true); };
  const startEdit = (item: Stat) => { setEditing({ ...item }); setIsAdding(false); };

  return (
    <div>
      <SectionHeader title="Stats" onAdd={startAdd} />
      {(isAdding || editing.id) && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <div className="grid sm:grid-cols-4 gap-4">
            <InputField label="Value" value={editing.value ?? 0} onChange={v => setEditing(p => ({ ...p, value: Number(v) }))} type="number" />
            <InputField label="Suffix" value={editing.suffix ?? '+'} onChange={v => setEditing(p => ({ ...p, suffix: v }))} />
            <InputField label="Label" value={editing.label ?? ''} onChange={v => setEditing(p => ({ ...p, label: v }))} placeholder="Years in Tech" />
            <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2 hover:border-gray-600 transition-colors">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-accent-400">{item.value}{item.suffix}</span>
            <span className="text-gray-300">{item.label}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => startEdit(item)} className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 transition-colors">Edit</button>
            <button onClick={() => remove(item.id!)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded text-xs hover:bg-red-500/20 transition-colors">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
