import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

// Only create a dummy client if keys are missing to prevent immediate crash
// createClient will throw if url is empty string, so we guard it
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get: () => {
        throw new Error('Supabase client not initialized. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      }
    }) as ReturnType<typeof createClient>;
