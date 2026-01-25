import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("Check Key Type:", typeof supabaseAnonKey, supabaseAnonKey?.substring(0, 3));

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',           // ✅ PKCE flow instead of implicit
    autoRefreshToken: true,     // Keep session fresh
    persistSession: true,       // Persist session in localStorage
    detectSessionInUrl: true,   // Automatically detect OAuth redirect
  },
})
