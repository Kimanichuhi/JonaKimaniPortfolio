import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ImageUpload from '../../../components/ImageUpload';
import { SaveButton, InputField, TextAreaField, LoadingState } from './editorUtils';
import type { SiteConfig } from '../../../lib/dataCache';

export default function SiteConfigEditor() {
  const [config, setConfig] = useState<Partial<SiteConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('site_config').select('*').limit(1).single().then(({ data }) => {
      setConfig(data ?? {});
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    if ('id' in config && config.id) {
      const { id, ...rest } = config as SiteConfig;
      await supabase.from('site_config').update(rest).eq('id', id);
    } else {
      await supabase.from('site_config').insert([config]);
    }
    setSaving(false);
  };

  const set = (key: keyof SiteConfig, value: string | number | null) => setConfig(prev => ({ ...prev, [key]: value }));

  if (loading) return <LoadingState />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Site Configuration</h2>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Name" value={config.name ?? ''} onChange={v => set('name', v)} />
          <InputField label="Title" value={config.title ?? ''} onChange={v => set('title', v)} />
          <InputField label="Tagline" value={config.tagline ?? ''} onChange={v => set('tagline', v)} />
          <InputField label="Roles" value={config.roles ?? ''} onChange={v => set('roles', v)} />
          <InputField label="Email" value={config.email ?? ''} onChange={v => set('email', v)} />
          <InputField label="Phone" value={config.phone ?? ''} onChange={v => set('phone', v)} />
          <InputField label="WhatsApp" value={config.whatsapp ?? ''} onChange={v => set('whatsapp', v)} />
          <InputField label="Calendly" value={config.calendly ?? ''} onChange={v => set('calendly', v)} />
          <InputField label="Address" value={config.address ?? ''} onChange={v => set('address', v)} />
          <InputField label="Twitter" value={config.twitter ?? ''} onChange={v => set('twitter', v)} />
          <InputField label="LinkedIn" value={config.linkedin ?? ''} onChange={v => set('linkedin', v)} />
          <InputField label="GitHub" value={config.github ?? ''} onChange={v => set('github', v)} />
        </div>
        <TextAreaField label="Philosophy Quote" value={config.philosophy_quote ?? ''} onChange={v => set('philosophy_quote', v)} rows={3} />
        <TextAreaField label="Bio" value={config.bio ?? ''} onChange={v => set('bio', v)} rows={5} />
        <ImageUpload label="Site Logo (replaces the JK badge in the header/footer if set)" folder="site" value={config.logo_url ?? null} onChange={v => set('logo_url', v)} />
        <ImageUpload label="Hero Background Image" folder="site" value={config.hero_image ?? null} onChange={v => set('hero_image', v)} />
        <ImageUpload label="About Page Portrait" folder="site" value={config.about_image ?? null} onChange={v => set('about_image', v)} />
        <div className="flex justify-end pt-2">
          <SaveButton saving={saving} onClick={save} />
        </div>
      </div>
    </div>
  );
}
