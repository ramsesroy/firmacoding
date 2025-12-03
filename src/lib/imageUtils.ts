import { supabase } from "./supabaseClient";

/**
 * Uploads an image to Supabase Storage bucket and returns the public URL
 * @param file - Image file to upload
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
  // Verify that the user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error("You must be authenticated to upload images. Please sign in.");
  }

  // Validate that it's an image
  if (!file.type.startsWith("image/")) {
    throw new Error("The file must be an image");
  }

  // Validate size (maximum 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("The image must not exceed 5MB");
  }

  // Generate a unique name for the file
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `signatures/${fileName}`;

  // Upload the file to the 'demomail' bucket
  const { data, error } = await supabase.storage
    .from("demomail")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    // If the error is RLS-related, provide a clearer message
    if (error.message.includes("row-level security") || error.message.includes("RLS")) {
      throw new Error("Permission error: Please contact the administrator. Storage policies may need configuration.");
    }
    throw new Error(`Error uploading image: ${error.message}`);
  }

  // Get the public URL of the file
  const {
    data: { publicUrl },
  } = supabase.storage.from("demomail").getPublicUrl(filePath);

  return publicUrl;
}
