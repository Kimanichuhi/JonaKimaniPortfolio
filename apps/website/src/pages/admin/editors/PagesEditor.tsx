import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ImageUpload from '../../../components/ImageUpload';
import { InputField, TextAreaField, ItemCard, SaveButton, LoadingState } from './editorUtils';
import { defaultPageHeaders, defaultPageBlocks, type PageHeaderRow, type PageKey, type HomeAboutCard, type PageBlock, type PageBlockId } from '../../../lib/dataCache';

const blockDefs: { id: PageBlockId; label: string }[] = [
  { id: 'home:cta1', label: 'Home — "Build Something Amazing" CTA' },
  { id: 'home:cta2', label: 'Home — Newsletter CTA' },
  { id: 'about:bio', label: 'About — Bio Badge & Heading' },
  { id: 'about:cta', label: 'About — "Let\'s Connect" CTA' },
  { id: 'projects:cta', label: 'Projects — Bottom CTA' },
  { id: 'project_detail:cta', label: 'Project Detail — Sidebar CTA' },
];

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

type Draft = { title: string; subtitle: string; background_image: string | null; saving: boolean };

const emptyHomeCard: HomeAboutCard = {
  image: null, badge_text: '', section_title: '', section_subtitle: '', card_title: '', description: '',
  link_url: '', link_label: '', stat1_value: '', stat1_label: '', stat2_value: '', stat2_label: '',
  stat3_value: '', stat3_label: '', stat4_value: '', stat4_label: '',
};

export default function PagesEditor() {
  const [rows, setRows] = useState<Partial<Record<PageKey, PageHeaderRow>>>({});
  const [drafts, setDrafts] = useState<Record<PageKey, Draft>>(() => {
    const initial = {} as Record<PageKey, Draft>;
    for (const key of Object.keys(defaultPageHeaders) as PageKey[]) {
      initial[key] = { ...defaultPageHeaders[key], saving: false };
    }
    return initial;
  });
  const [homeCard, setHomeCard] = useState<HomeAboutCard>(emptyHomeCard);
  const [homeCardSaving, setHomeCardSaving] = useState(false);
  const [blockRows, setBlockRows] = useState<Partial<Record<PageBlockId, PageBlock>>>({});
  const [blockDrafts, setBlockDrafts] = useState<Record<PageBlockId, PageBlock & { saving: boolean }>>(() => {
    const initial = {} as Record<PageBlockId, PageBlock & { saving: boolean }>;
    for (const { id } of blockDefs) {
      const [page_key, block_key] = id.split(':');
      initial[id] = { page_key, block_key, ...defaultPageBlocks[id], saving: false };
    }
    return initial;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('page_headers').select('*'),
      supabase.from('home_about_card').select('*').limit(1).maybeSingle(),
      supabase.from('page_blocks').select('*'),
    ]).then(([headersRes, homeRes, blocksRes]) => {
      const byKey: Partial<Record<PageKey, PageHeaderRow>> = {};
      const nextDrafts = { ...drafts };
      (headersRes.data as PageHeaderRow[] ?? []).forEach(row => {
        const key = row.page_key as PageKey;
        byKey[key] = row;
        if (key in nextDrafts) nextDrafts[key] = { title: row.title, subtitle: row.subtitle, background_image: row.background_image ?? null, saving: false };
      });
      setRows(byKey);
      setDrafts(nextDrafts);
      if (homeRes.data) setHomeCard(homeRes.data as HomeAboutCard);

      const byBlockId: Partial<Record<PageBlockId, PageBlock>> = {};
      const nextBlockDrafts = { ...blockDrafts };
      (blocksRes.data as PageBlock[] ?? []).forEach(row => {
        const id = `${row.page_key}:${row.block_key}` as PageBlockId;
        byBlockId[id] = row;
        if (id in nextBlockDrafts) nextBlockDrafts[id] = { ...row, saving: false };
      });
      setBlockRows(byBlockId);
      setBlockDrafts(nextBlockDrafts);

      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingState />;

  const setDraft = (key: PageKey, patch: Partial<Draft>) =>
    setDrafts(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const save = async (key: PageKey) => {
    setDraft(key, { saving: true });
    const { title, subtitle, background_image } = drafts[key];
    const { data } = await supabase
      .from('page_headers')
      .upsert({ page_key: key, title, subtitle, background_image }, { onConflict: 'page_key' })
      .select()
      .single();
    if (data) setRows(prev => ({ ...prev, [key]: data as PageHeaderRow }));
    setDraft(key, { saving: false });
  };

  const setBlockField = (id: PageBlockId, patch: Partial<PageBlock>) =>
    setBlockDrafts(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const saveBlock = async (id: PageBlockId) => {
    setBlockDrafts(prev => ({ ...prev, [id]: { ...prev[id], saving: true } }));
    const { page_key, block_key, badge_text, title, subtitle, link_label } = blockDrafts[id];
    const { data } = await supabase
      .from('page_blocks')
      .upsert({ page_key, block_key, badge_text, title, subtitle, link_label }, { onConflict: 'page_key,block_key' })
      .select()
      .single();
    if (data) setBlockRows(prev => ({ ...prev, [id]: data as PageBlock }));
    setBlockDrafts(prev => ({ ...prev, [id]: { ...prev[id], saving: false } }));
  };

  const setHomeField = (key: keyof HomeAboutCard, value: string | null) => setHomeCard(prev => ({ ...prev, [key]: value }));

  const saveHomeCard = async () => {
    setHomeCardSaving(true);
    if (homeCard.id) {
      const { id, ...rest } = homeCard;
      await supabase.from('home_about_card').update(rest).eq('id', id);
    } else {
      const { data } = await supabase.from('home_about_card').insert([homeCard]).select().single();
      if (data) setHomeCard(data as HomeAboutCard);
    }
    setHomeCardSaving(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Pages</h2>
      <p className="text-gray-400 text-sm mb-6">Edit the title, subtitle, and background image shown at the top of each page, plus the Home page's About card.</p>

      <ItemCard saving={homeCardSaving}>
        <div className="flex items-center justify-between -mt-1 mb-1">
          <span className="text-sm font-semibold text-white">Home — About Card</span>
          {!homeCard.id && <span className="text-xs text-gray-500">Using default (not yet customized)</span>}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label={'Section Title (shown after "About ")'} value={homeCard.section_title} onChange={v => setHomeField('section_title', v)} />
          <InputField label="Badge Text" value={homeCard.badge_text} onChange={v => setHomeField('badge_text', v)} placeholder="Est. 2016" />
        </div>
        <TextAreaField label="Section Subtitle" value={homeCard.section_subtitle} onChange={v => setHomeField('section_subtitle', v)} rows={2} />
        <ImageUpload label="Card Image" folder="site" value={homeCard.image} onChange={v => setHomeField('image', v)} />
        <InputField label="Card Title" value={homeCard.card_title} onChange={v => setHomeField('card_title', v)} />
        <TextAreaField label="Card Description" value={homeCard.description} onChange={v => setHomeField('description', v)} rows={4} />
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Link URL" value={homeCard.link_url} onChange={v => setHomeField('link_url', v)} />
          <InputField label="Link Label" value={homeCard.link_label} onChange={v => setHomeField('link_label', v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800">
          {([1, 2, 3, 4] as const).map(n => (
            <div key={n} className="flex gap-2">
              <InputField label={`Stat ${n} Value`} value={homeCard[`stat${n}_value`]} onChange={v => setHomeField(`stat${n}_value`, v)} />
              <InputField label={`Stat ${n} Label`} value={homeCard[`stat${n}_label`]} onChange={v => setHomeField(`stat${n}_label`, v)} />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <SaveButton saving={homeCardSaving} onClick={saveHomeCard} />
        </div>
      </ItemCard>

      {(Object.keys(pageLabels) as PageKey[]).map(key => (
        <ItemCard key={key} saving={drafts[key].saving}>
          <div className="flex items-center justify-between -mt-1 mb-1">
            <span className="text-sm font-semibold text-white">{pageLabels[key]}</span>
            {!rows[key] && <span className="text-xs text-gray-500">Using default (not yet customized)</span>}
          </div>
          <InputField label="Title" value={drafts[key].title} onChange={v => setDraft(key, { title: v })} />
          <TextAreaField label="Subtitle" value={drafts[key].subtitle} onChange={v => setDraft(key, { subtitle: v })} rows={2} />
          <ImageUpload label="Header Background Image (optional)" folder="site" value={drafts[key].background_image} onChange={v => setDraft(key, { background_image: v })} />
          <div className="flex justify-end pt-2">
            <SaveButton saving={drafts[key].saving} onClick={() => save(key)} />
          </div>
        </ItemCard>
      ))}

      <h3 className="text-lg font-bold mt-8 mb-2">Content Blocks</h3>
      <p className="text-gray-400 text-sm mb-6">Recurring sections (call-to-action blocks, the About bio badge) that appear inline within a page's content.</p>
      {blockDefs.map(({ id, label }) => (
        <ItemCard key={id} saving={blockDrafts[id].saving}>
          <div className="flex items-center justify-between -mt-1 mb-1">
            <span className="text-sm font-semibold text-white">{label}</span>
            {!blockRows[id] && <span className="text-xs text-gray-500">Using default (not yet customized)</span>}
          </div>
          <InputField label="Badge / Small Label (optional)" value={blockDrafts[id].badge_text} onChange={v => setBlockField(id, { badge_text: v })} />
          <InputField label="Title" value={blockDrafts[id].title} onChange={v => setBlockField(id, { title: v })} />
          <TextAreaField label="Subtitle" value={blockDrafts[id].subtitle} onChange={v => setBlockField(id, { subtitle: v })} rows={2} />
          <InputField label="Button Label (optional)" value={blockDrafts[id].link_label} onChange={v => setBlockField(id, { link_label: v })} />
          <div className="flex justify-end pt-2">
            <SaveButton saving={blockDrafts[id].saving} onClick={() => saveBlock(id)} />
          </div>
        </ItemCard>
      ))}
    </div>
  );
}
