import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export function useCrud<T extends { id?: string }>(table: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
    setItems((data as T[]) ?? []);
    setLoading(false);
  }, [table]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (item: Partial<T> & { id?: string }) => {
    setSaving(true);
    if (item.id) {
      const { id, ...rest } = item;
      await supabase.from(table).update(rest).eq('id', id);
    } else {
      await supabase.from(table).insert([item]);
    }
    await fetch();
    setSaving(false);
  };

  const remove = async (id: string) => {
    setSaving(true);
    await supabase.from(table).delete().eq('id', id);
    await fetch();
    setSaving(false);
  };

  return { items, loading, saving, save, remove, refetch: fetch };
}

export function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    >
      {saving && <Loader2 size={14} className="animate-spin" />}
      {saving ? 'Saving...' : 'Save'}
    </button>
  );
}

export function DeleteButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-colors disabled:opacity-50"
    >
      Delete
    </button>
  );
}

export function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold">{title}</h2>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30 transition-colors">
          + Add New
        </button>
      )}
    </div>
  );
}

export function InputField({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500 transition-colors"
      />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, rows = 4, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-500 transition-colors resize-none"
      />
    </div>
  );
}

export function ItemCard({ children, onDelete, saving }: { children: React.ReactNode; onDelete?: () => void; saving?: boolean }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
      <div className="space-y-4">
        {children}
      </div>
      {onDelete && (
        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-end">
          <DeleteButton saving={saving ?? false} onClick={onDelete} />
        </div>
      )}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={24} className="animate-spin text-accent-400" />
    </div>
  );
}
