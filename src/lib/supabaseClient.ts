import { createClient } from "@supabase/supabase-js";

// Function to safely get environment variables
function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables!");
    console.error("📝 Please check your .env.local file in the project root.");
    console.error("🔧 Required variables:");
    console.error("   - NEXT_PUBLIC_SUPABASE_URL");
    console.error("   - NEXT_PUBLIC_SUPABASE_ANON_KEY");
    console.error("💡 After adding/updating .env.local, RESTART the server (npm run dev)");
    
    // Instead of throwing error, return empty default values
    // so the application doesn't break
    return {
      url: supabaseUrl || "",
      key: supabaseAnonKey || "",
    };
  }

  // Log success in development only
  if (process.env.NODE_ENV === "development") {
    console.log("✅ Supabase environment variables loaded successfully");
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

