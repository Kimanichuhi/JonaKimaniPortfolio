import { useCallback, useEffect, useState } from 'react';
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
