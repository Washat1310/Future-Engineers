import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zkzwxohdiorqpzdgeywj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_j63EkC7v5szcZT82yZ_tmQ__Q6F29Xj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
