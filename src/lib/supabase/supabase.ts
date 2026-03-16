import { createClient } from "@supabase/supabase-js";

const _url = process.env.SUPABASE_URL;
const supabaseUrl = _url?.startsWith("http") ? _url : "https://placeholder-url.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "placeholder-key";

// Graceful fallback for local dev when secrets are missing
export const supabase = createClient(supabaseUrl, supabaseKey);

export const hasSupabaseConfig = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY;
