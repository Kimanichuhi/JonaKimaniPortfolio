import { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../../../lib/supabase';
import { LoadingState } from './editorUtils';
import { FileText, Briefcase, MessageSquare, Rocket, Mic, HelpCircle, Image, Mail, Users, Calendar } from 'lucide-react';

const countTargets = [
  { table: 'projects', label: 'Projects', icon: <Rocket size={18} /> },
  { table: 'blog_posts', label: 'Blog Posts', icon: <FileText size={18} /> },
  { table: 'ventures', label: 'Ventures', icon: <Briefcase size={18} /> },
  { table: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={18} /> },
  { table: 'speaking_events', label: 'Speaking Events', icon: <Mic size={18} /> },
  { table: 'faq_items', label: 'FAQ Items', icon: <HelpCircle size={18} /> },
  { table: 'gallery_images', label: 'Gallery Images', icon: <Image size={18} /> },
];

interface RecentMessage { id: string; name: string; inquiry_type: string; created_at: string }
interface RecentBooking { id: string; name: string; consultation_type: string; created_at: string }

function StatCard({ icon, label, value, highlight }: { icon: ReactNode; label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`border rounded-xl p-4 ${highlight ? 'bg-accent-500/10 border-accent-500/30' : 'bg-gray-900 border-gray-800'}`}>
      <div className={`mb-2 ${highlight ? 'text-accent-400' : 'text-gray-500'}`}>{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-gray-400 text-xs">{label}</div>
    </div>
  );
}

export default function OverviewPanel() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [contentCounts, contactRes, newsletterRes, bookingsRes, recentMsgRes, recentBookingRes] = await Promise.all([
        Promise.all(countTargets.map(t => supabase.from(t.table).select('*', { count: 'exact', head: true }))),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('read', false),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_submissions').select('id, name, inquiry_type, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('bookings').select('id, name, consultation_type, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      const nextCounts: Record<string, number> = {};
      countTargets.forEach((t, i) => { nextCounts[t.table] = contentCounts[i].count ?? 0; });
      setCounts(nextCounts);
      setUnreadMessages(contactRes.count ?? 0);
      setSubscriberCount(newsletterRes.count ?? 0);
      setPendingBookings(bookingsRes.count ?? 0);
      setRecentMessages((recentMsgRes.data as RecentMessage[]) ?? []);
      setRecentBookings((recentBookingRes.data as RecentBooking[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Overview</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <StatCard icon={<Mail size={18} />} label="Unread Messages" value={unreadMessages} highlight={unreadMessages > 0} />
        <StatCard icon={<Calendar size={18} />} label="Pending Bookings" value={pendingBookings} highlight={pendingBookings > 0} />
        <StatCard icon={<Users size={18} />} label="Newsletter Subscribers" value={subscriberCount} />
        {countTargets.map(t => (
          <StatCard key={t.table} icon={t.icon} label={t.label} value={counts[t.table] ?? 0} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Messages</h3>
          {recentMessages.length === 0 && <p className="text-gray-500 text-sm">None yet.</p>}
          {recentMessages.map(m => (
            <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 mb-2 text-sm">
              <div className="text-white font-medium">{m.name} <span className="text-gray-500 font-normal">— {m.inquiry_type}</span></div>
              <div className="text-gray-500 text-xs">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Bookings</h3>
          {recentBookings.length === 0 && <p className="text-gray-500 text-sm">None yet.</p>}
          {recentBookings.map(b => (
            <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 mb-2 text-sm">
              <div className="text-white font-medium">{b.name} <span className="text-gray-500 font-normal">— {b.consultation_type}</span></div>
              <div className="text-gray-500 text-xs">{new Date(b.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
