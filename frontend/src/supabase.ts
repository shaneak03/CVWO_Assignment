import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("VITE_SUPABASE_URL:", supabaseUrl); // Print the VITE_SUPABASE_URL to check if it's loaded correctly
console.log("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey); // Print the VITE_SUPABASE_ANON_KEY to check if it's loaded correctly

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;