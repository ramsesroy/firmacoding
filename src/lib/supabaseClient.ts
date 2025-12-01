import { createClient } from "@supabase/supabase-js";

// Función para obtener las variables de entorno de manera segura
function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Please check your .env.local file.");
    
    // En lugar de lanzar error, retornamos valores por defecto vacíos
    // para que la aplicación no se rompa
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

// Crear el cliente de Supabase
// Si no hay URL o key, aún creamos el cliente para evitar errores
// pero mostrará errores más claros cuando se intente usar
export const supabase = createClient(url || "https://placeholder.supabase.co", key || "placeholder-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

