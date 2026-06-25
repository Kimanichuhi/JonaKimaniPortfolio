import { useState } from 'react';
import { useCrud, SectionHeader, InputField, LoadingState } from './editorUtils';
import type { LogoPartner } from '../../../lib/dataCache';

export default function LogoEditor() {
  const { items, loading, saving, save, remove } = useCrud<LogoPartner>('logo_partners');
  const [newName, setNewName] = useState('');

  if (loading) return <LoadingState />;

  return (
    <div>
      <SectionHeader title="Logo Partners" />
      <div className="flex gap-2 mb-4">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Partner name..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500" />
        <button onClick={() => { if (newName.trim()) { save({ name: newName.trim(), sort_order: items.length + 1 }); setNewName(''); } }} disabled={saving} className="px-4 py-2 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30 disabled:opacity-50">Add</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-3">
            <span className="font-medium text-sm">{item.name}</span>
            <div className="flex items-center gap-2">
              <InputField label="" value={item.sort_order ?? 0} onChange={v => save({ ...item, sort_order: Number(v) })} type="number" />
              <button onClick={() => remove(item.id!)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
