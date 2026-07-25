import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { LoadingState } from './editorUtils';
import { Mail, Trash2, Copy, Check } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function NewsletterEditor() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as Subscriber[]) ?? []);
      setLoading(false);
    });
  };

  useEffect(fetchItems, []);

  const remove = async (id: string) => {
    setItems(prev => prev.filter(s => s.id !== id));
    await supabase.from('newsletter_subscribers').delete().eq('id', id);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(items.map(s => s.email).join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Newsletter Subscribers ({items.length})</h2>
        {items.length > 0 && (
          <button onClick={copyAll} className="flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-lg text-sm hover:bg-accent-500/30 transition-colors">
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy All Emails'}
          </button>
        )}
      </div>
      {items.length === 0 && <p className="text-gray-400 text-sm">No subscribers yet.</p>}
      {items.map(s => (
        <div key={s.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg p-3 mb-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-500" />
            <span className="text-white">{s.email}</span>
            <span className="text-gray-500 text-xs">— {new Date(s.created_at).toLocaleDateString()}</span>
          </div>
          <button onClick={() => remove(s.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
