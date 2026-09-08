import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables: Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Project Settings > Environment Variables.'
  );
}

// Initialize Supabase using environment variables configured in Vercel or local .env
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
