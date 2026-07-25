import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { LoadingState } from './editorUtils';
import { Mail, Trash2, CheckCircle, Circle } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  inquiry_type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesEditor() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    setLoading(true);
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as ContactSubmission[]) ?? []);
      setLoading(false);
    });
  };

  useEffect(fetchItems, []);

  const toggleRead = async (id: string, read: boolean) => {
    setItems(prev => prev.map(m => (m.id === id ? { ...m, read } : m)));
    await supabase.from('contact_submissions').update({ read }).eq('id', id);
  };

  const remove = async (id: string) => {
    setItems(prev => prev.filter(m => m.id !== id));
    await supabase.from('contact_submissions').delete().eq('id', id);
  };

  if (loading) return <LoadingState />;

  const unreadCount = items.filter(m => !m.read).length;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Messages ({items.length}{unreadCount > 0 ? `, ${unreadCount} unread` : ''})</h2>
      {items.length === 0 && <p className="text-gray-400 text-sm">No messages yet.</p>}
      {items.map(m => (
        <div key={m.id} className={`border rounded-xl p-5 mb-3 ${m.read ? 'bg-gray-900 border-gray-800' : 'bg-accent-500/5 border-accent-500/30'}`}>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="font-semibold text-white flex items-center gap-2">
                {m.name}
                <span className="text-xs font-normal text-accent-400 bg-accent-500/15 px-2 py-0.5 rounded-full">{m.inquiry_type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs mt-0.5">
                <Mail size={12} /> {m.email} • {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleRead(m.id, !m.read)}
                title={m.read ? 'Mark as unread' : 'Mark as read'}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {m.read ? <Circle size={14} /> : <CheckCircle size={14} />}
              </button>
              <button onClick={() => remove(m.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <p className="text-gray-300 text-sm bg-gray-800/50 rounded-lg p-3">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
