import { createClient } from '@supabase/supabase-js';

// Read from Vite environment variables with resilient fallbacks for cloud deployments (e.g. Vercel)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://xoglcjxnypcvluwhwvke.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ2xjanhueXBjdmx1d2h3dmtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODc4MTksImV4cCI6MjEwNDM2MzgxOX0.E5Nw7Fz2qjoLHS9EbopftLBsDcgRVzIqiJissO4wHgc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
