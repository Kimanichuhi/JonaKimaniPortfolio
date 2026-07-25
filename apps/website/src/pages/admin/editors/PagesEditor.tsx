import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import { defaultPageHeaders, type PageHeaderRow, type PageKey } from '../../../lib/dataCache';

const pageLabels: Record<PageKey, string> = {
  about: 'About',
  work: 'Work',
  projects: 'Projects',
  blog: 'Blog',
  speaking: 'Speaking',
  contact: 'Contact',
  resume: 'Resume',
  booking: 'Booking',
};

type Draft = { title: string; subtitle: string; saving: boolean };

export default function PagesEditor() {
  const [rows, setRows] = useState<Partial<Record<PageKey, PageHeaderRow>>>({});
  const [drafts, setDrafts] = useState<Record<PageKey, Draft>>(() => {
    const initial = {} as Record<PageKey, Draft>;
    for (const key of Object.keys(defaultPageHeaders) as PageKey[]) {
      initial[key] = { ...defaultPageHeaders[key], saving: false };
    }
    return initial;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('page_headers').select('*').then(({ data }) => {
      const byKey: Partial<Record<PageKey, PageHeaderRow>> = {};
      const nextDrafts = { ...drafts };
      (data as PageHeaderRow[] ?? []).forEach(row => {
        const key = row.page_key as PageKey;
        byKey[key] = row;
        if (key in nextDrafts) nextDrafts[key] = { title: row.title, subtitle: row.subtitle, saving: false };
      });
      setRows(byKey);
      setDrafts(nextDrafts);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingState />;

  const setDraft = (key: PageKey, patch: Partial<Draft>) =>
    setDrafts(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const save = async (key: PageKey) => {
    setDraft(key, { saving: true });
    const { title, subtitle } = drafts[key];
    const { data } = await supabase
      .from('page_headers')
      .upsert({ page_key: key, title, subtitle }, { onConflict: 'page_key' })
      .select()
      .single();
    if (data) setRows(prev => ({ ...prev, [key]: data as PageHeaderRow }));
    setDraft(key, { saving: false });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Pages</h2>
      <p className="text-gray-400 text-sm mb-6">Edit the title and subtitle shown at the top of each page.</p>
      {(Object.keys(pageLabels) as PageKey[]).map(key => (
        <ItemCard key={key} saving={drafts[key].saving}>
          <div className="flex items-center justify-between -mt-1 mb-1">
            <span className="text-sm font-semibold text-white">{pageLabels[key]}</span>
            {!rows[key] && <span className="text-xs text-gray-500">Using default (not yet customized)</span>}
          </div>
          <InputField label="Title" value={drafts[key].title} onChange={v => setDraft(key, { title: v })} />
          <TextAreaField label="Subtitle" value={drafts[key].subtitle} onChange={v => setDraft(key, { subtitle: v })} rows={2} />
          <div className="flex justify-end pt-2">
            <SaveButton saving={drafts[key].saving} onClick={() => save(key)} />
          </div>
        </ItemCard>
      ))}
    </div>
  );
}
