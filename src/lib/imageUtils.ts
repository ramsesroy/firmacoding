import { supabase } from "./supabaseClient";

/**
 * Sube una imagen al bucket de Supabase Storage y retorna la URL pública
 * @param file - Archivo de imagen a subir
 * @returns URL pública de la imagen subida
 */
export async function uploadImage(file: File): Promise<string> {
  // Verificar que el usuario esté autenticado
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error("Debes estar autenticado para subir imágenes. Por favor, inicia sesión.");
  }

  // Validar que sea una imagen
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen");
  }

  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("La imagen no debe exceder 5MB");
  }

  // Generar un nombre único para el archivo
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `signatures/${fileName}`;

  // Subir el archivo al bucket 'demomail'
  const { data, error } = await supabase.storage
    .from("demomail")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    // Si el error es de RLS, proporcionar un mensaje más claro
    if (error.message.includes("row-level security") || error.message.includes("RLS")) {
      throw new Error("Error de permisos: Por favor, contacta al administrador. Las políticas de almacenamiento pueden necesitar configuración.");
    }
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }

  // Obtener la URL pública del archivo
  const {
    data: { publicUrl },
  } = supabase.storage.from("demomail").getPublicUrl(filePath);

  return publicUrl;
}
