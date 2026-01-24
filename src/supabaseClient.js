import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
console.log("Check Key Type:", typeof supabaseAnonKey, supabaseAnonKey?.substring(0, 3));

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
