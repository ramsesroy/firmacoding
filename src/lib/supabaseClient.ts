import { createClient } from "@supabase/supabase-js";

// Function to safely get environment variables
function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Please check your .env.local file.");
    
    // Instead of throwing error, return empty default values
    // so the application doesn't break
    return {
      url: supabaseUrl || "",
      key: supabaseAnonKey || "",
    };
  }

  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
  };
}

const { url, key } = getSupabaseEnv();

// Create Supabase client
// If no URL or key, still create client to avoid errors
// but will show clearer errors when trying to use it
export const supabase = createClient(url || "https://placeholder.supabase.co", key || "placeholder-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

