import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Usar variáveis de ambiente para configuração do Supabase
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const SUPABASE_URL = isNode
  ? process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://vxqknjttcshkcikdhnaq.supabase.co"
  : import.meta.env.VITE_SUPABASE_URL || "https://vxqknjttcshkcikdhnaq.supabase.co";

const SUPABASE_ANON_KEY = isNode
  ? process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cWtuanR0Y3Noa2Npa2RobmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDc5MTEsImV4cCI6MjA2ODU4MzkxMX0.kYD8YcGXyehhqJJfC2bAkcMNmAhVS7guA_-Gf9eBw_k"
  : import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cWtuanR0Y3Noa2Npa2RobmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDc5MTEsImV4cCI6MjA2ODU4MzkxMX0.kYD8YcGXyehhqJJfC2bAkcMNmAhVS7guA_-Gf9eBw_k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: (typeof window !== 'undefined' && typeof localStorage !== 'undefined') ? localStorage : undefined,
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  }
});