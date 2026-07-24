import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function subscribeNewsletter(email: string) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email }]);
  return { error };
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  inquiry_type: string;
  message: string;
}) {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([data]);
  return { error };
}
