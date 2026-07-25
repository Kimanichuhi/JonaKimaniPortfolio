import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { LoadingState } from './editorUtils';
import { Calendar, Clock, Mail, Phone, Building2, Trash2 } from 'lucide-react';

interface Booking {
  id: string;
  consultation_type: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  date: string;
  time: string;
  message: string;
  status: string;
  created_at: string;
}

const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
  completed: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function BookingsEditor() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    setLoading(true);
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems((data as Booking[]) ?? []);
      setLoading(false);
    });
  };

  useEffect(fetchItems, []);

  const setStatus = async (id: string, status: string) => {
    setItems(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
    await supabase.from('bookings').update({ status }).eq('id', id);
  };

  const remove = async (id: string) => {
    setItems(prev => prev.filter(b => b.id !== id));
    await supabase.from('bookings').delete().eq('id', id);
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Bookings ({items.length})</h2>
      {items.length === 0 && <p className="text-gray-400 text-sm">No consultation bookings yet.</p>}
      {items.map(b => (
        <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-3">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="font-semibold text-white">{b.name} <span className="text-gray-500 text-sm font-normal">— {b.consultation_type}</span></div>
              <div className="text-gray-500 text-xs">{new Date(b.created_at).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={b.status}
                onChange={e => setStatus(b.id, e.target.value)}
                className={`border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none ${statusColors[b.status] ?? statusColors.pending}`}
              >
                {statuses.map(s => <option key={s} value={s} className="bg-gray-900 text-white">{s}</option>)}
              </select>
              <button onClick={() => remove(b.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-gray-300 mb-3">
            <div className="flex items-center gap-2"><Mail size={13} className="text-gray-500" /> {b.email}</div>
            {b.phone && <div className="flex items-center gap-2"><Phone size={13} className="text-gray-500" /> {b.phone}</div>}
            {b.company && <div className="flex items-center gap-2"><Building2 size={13} className="text-gray-500" /> {b.company}</div>}
            <div className="flex items-center gap-2"><Calendar size={13} className="text-gray-500" /> {b.date || '—'}</div>
            <div className="flex items-center gap-2"><Clock size={13} className="text-gray-500" /> {b.time || '—'}</div>
          </div>
          {b.message && <p className="text-gray-400 text-sm bg-gray-800/50 rounded-lg p-3">{b.message}</p>}
        </div>
      ))}
    </div>
  );
}
