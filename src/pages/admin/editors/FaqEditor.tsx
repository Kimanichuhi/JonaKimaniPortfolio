import { useState } from 'react';
import { useCrud, SectionHeader, InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import type { FaqItem } from '../../../lib/dataCache';

export default function FaqEditor() {
  const { items, loading, saving, save, remove } = useCrud<FaqItem>('faq_items');
  const [editing, setEditing] = useState<Partial<FaqItem>>({});

  if (loading) return <LoadingState />;

  const startAdd = () => setEditing({ question: '', answer: '', sort_order: items.length + 1 });
  const startEdit = (item: FaqItem) => setEditing({ ...item });

  return (
    <div>
      <SectionHeader title="FAQ Items" onAdd={startAdd} />
      {Object.keys(editing).length > 0 && (
        <ItemCard onDelete={editing.id ? () => { remove(editing.id!); setEditing({}); } : undefined} saving={saving}>
          <InputField label="Question" value={editing.question ?? ''} onChange={v => setEditing(p => ({ ...p, question: v }))} />
          <TextAreaField label="Answer" value={editing.answer ?? ''} onChange={v => setEditing(p => ({ ...p, answer: v }))} rows={4} />
          <InputField label="Sort Order" value={editing.sort_order ?? 0} onChange={v => setEditing(p => ({ ...p, sort_order: Number(v) }))} type="number" />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing({})} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">Cancel</button>
            <SaveButton saving={saving} onClick={() => { save(editing).then(() => setEditing({})); }} />
          </div>
        </ItemCard>
      )}
      {items.map(item => (
        <div key={item.id} className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white">{item.question}</div>
            <div className="text-gray-400 text-sm mt-1">{item.answer}</div>
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
