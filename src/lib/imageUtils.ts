import { supabase } from "./supabaseClient";
import { logger } from "./logger";

// ============================================
// RATE LIMITING
// ============================================

const RATE_LIMIT_KEY = "upload_rate_limit";
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hora
const RATE_LIMIT_MAX_UPLOADS = 10; // 10 uploads por hora para usuarios no autenticados
const RATE_LIMIT_MAX_UPLOADS_AUTH = 50; // 50 uploads por hora para usuarios autenticados

// Session-based upload limit (resets on browser close)
const SESSION_LIMIT_KEY = "upload_session_limit";
const SESSION_LIMIT_MAX_UPLOADS = 20; // 20 uploads por sesión para usuarios no autenticados
const SESSION_LIMIT_MAX_UPLOADS_AUTH = 1000; // Sin límite práctico para usuarios autenticados

/**
 * Checks if user has exceeded rate limit for uploads
 * @param isAuthenticated - Whether user is authenticated
 * @returns true if upload is allowed, false if rate limit exceeded
 */
function checkRateLimit(isAuthenticated: boolean): boolean {
  if (typeof window === "undefined") return true; // Server-side, allow

  const limit = isAuthenticated ? RATE_LIMIT_MAX_UPLOADS_AUTH : RATE_LIMIT_MAX_UPLOADS;
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();

  if (!stored) {
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ count: 1, reset: now + RATE_LIMIT_WINDOW })
    );
    return true;
  }

  const data = JSON.parse(stored);

  // Reset if window expired
  if (now > data.reset) {
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ count: 1, reset: now + RATE_LIMIT_WINDOW })
    );
    return true;
  }

  // Check if limit exceeded
  if (data.count >= limit) {
    return false;
  }

  // Increment count
  data.count++;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  return true;
}

/**
 * Gets remaining uploads in current window
 * @param isAuthenticated - Whether user is authenticated
 * @returns Number of remaining uploads
 */
export function getRemainingUploads(isAuthenticated: boolean): number {
  if (typeof window === "undefined") return RATE_LIMIT_MAX_UPLOADS;

  const limit = isAuthenticated ? RATE_LIMIT_MAX_UPLOADS_AUTH : RATE_LIMIT_MAX_UPLOADS;
  const stored = localStorage.getItem(RATE_LIMIT_KEY);

  if (!stored) return limit;

  const data = JSON.parse(stored);
  const now = Date.now();

  if (now > data.reset) return limit;

  return Math.max(0, limit - data.count);
}

/**
 * Checks if user has exceeded session-based upload limit
 * @param isAuthenticated - Whether user is authenticated
 * @returns true if upload is allowed, false if session limit exceeded
 */
function checkSessionLimit(isAuthenticated: boolean): boolean {
  if (typeof window === "undefined") return true; // Server-side, allow

  const limit = isAuthenticated ? SESSION_LIMIT_MAX_UPLOADS_AUTH : SESSION_LIMIT_MAX_UPLOADS;
  const stored = sessionStorage.getItem(SESSION_LIMIT_KEY);

  if (!stored) {
    sessionStorage.setItem(SESSION_LIMIT_KEY, "1");
    return true;
  }

  const count = parseInt(stored, 10);

  if (count >= limit) {
    return false;
  }

  sessionStorage.setItem(SESSION_LIMIT_KEY, (count + 1).toString());
  return true;
}

/**
 * Gets remaining session uploads
 * @param isAuthenticated - Whether user is authenticated
 * @returns Number of remaining session uploads
 */
export function getRemainingSessionUploads(isAuthenticated: boolean): number {
  if (typeof window === "undefined") return SESSION_LIMIT_MAX_UPLOADS;

  const limit = isAuthenticated ? SESSION_LIMIT_MAX_UPLOADS_AUTH : SESSION_LIMIT_MAX_UPLOADS;
  const stored = sessionStorage.getItem(SESSION_LIMIT_KEY);

  if (!stored) return limit;

  const count = parseInt(stored, 10);
  return Math.max(0, limit - count);
}

// ============================================
// VALIDACIÓN MEJORADA
// ============================================

const ALLOWED_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_DIMENSIONS = { width: 2000, height: 2000 };
const MIN_DIMENSIONS = { width: 50, height: 50 };

/**
 * Validates image format
 * @param file - File to validate
 * @returns true if format is allowed
 */
function validateImageFormat(file: File): boolean {
  return ALLOWED_FORMATS.includes(file.type.toLowerCase());
}

/**
 * Validates image dimensions
 * @param file - Image file to validate
 * @returns Promise that resolves to true if dimensions are valid
 */
async function validateImageDimensions(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const isValid =
        img.width <= MAX_DIMENSIONS.width &&
        img.height <= MAX_DIMENSIONS.height &&
        img.width >= MIN_DIMENSIONS.width &&
        img.height >= MIN_DIMENSIONS.height;
      resolve(isValid);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };

    img.src = objectUrl;
  });
}

/**
 * Validates that file is a real image (not just extension)
 * @param file - File to validate
 * @returns Promise that resolves to true if valid image
 */
async function validateRealImage(file: File): Promise<boolean> {
  return validateImageDimensions(file);
}

// ============================================
// COMPRESIÓN AUTOMÁTICA
// ============================================

/**
 * Compresses an image file
 * @param file - Image file to compress
 * @param maxSizeMB - Maximum size in MB (default: 1MB)
 * @returns Compressed file
 */
async function compressImage(file: File, maxSizeMB: number = 1): Promise<File> {
  // Only compress in browser environment
  if (typeof window === "undefined") {
    return file;
  }

  try {
    // Dynamic import to avoid SSR issues
    // Wrap in try-catch to handle module not found gracefully
    let imageCompressionModule;
    try {
      imageCompressionModule = await import("browser-image-compression");
    } catch (importError: any) {
      // Module not found - return original file without blocking
      if (importError?.message?.includes("Cannot find module") || importError?.code === "MODULE_NOT_FOUND") {
        logger.warn("browser-image-compression not available. Install with: npm install browser-image-compression", undefined, "Image Utils");
      }
      return file;
    }

    const imageCompression = imageCompressionModule.default || imageCompressionModule;

    if (!imageCompression || typeof imageCompression !== "function") {
      logger.warn("browser-image-compression default export not found, skipping compression", undefined, "Image Utils");
      return file;
    }

    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1920, // Max dimension
      useWebWorker: true,
      fileType: file.type, // Preserve original format
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error: any) {
    // Any other error during compression - return original file
    logger.warn("Compression failed, using original file", error?.message || error, "Image Utils");
    return file;
  }
}

// ============================================
// UPLOAD FUNCTION
// ============================================

/**
 * Uploads an image to Supabase Storage bucket and returns the public URL
 * Includes: compression, rate limiting, and enhanced validation
 * @param file - Image file to upload
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;

  // ============================================
  // 1. RATE LIMITING (por hora)
  // ============================================
  if (!checkRateLimit(isAuthenticated)) {
    const remaining = getRemainingUploads(isAuthenticated);
    throw new Error(
      `Upload limit reached. You can upload ${remaining} more image(s) in the next hour. Please wait or sign up for unlimited uploads.`
    );
  }

  // ============================================
  // 1.5. SESSION LIMITING (por sesión)
  // ============================================
  if (!checkSessionLimit(isAuthenticated)) {
    const remaining = getRemainingSessionUploads(isAuthenticated);
    throw new Error(
      `Session upload limit reached. You've uploaded ${SESSION_LIMIT_MAX_UPLOADS} images in this session. Please refresh the page or sign up for unlimited uploads.`
    );
  }

  // ============================================
  // 2. VALIDACIÓN BÁSICA
  // ============================================
  if (!file.type.startsWith("image/")) {
    throw new Error("The file must be an image");
  }

  // ============================================
  // 3. VALIDACIÓN DE FORMATO
  // ============================================
  if (!validateImageFormat(file)) {
    throw new Error(
      `Invalid image format. Allowed formats: JPG, PNG, WebP. Your file: ${file.type}`
    );
  }

  // ============================================
  // 4. VALIDACIÓN DE TAMAÑO
  // ============================================
  const maxSize = isAuthenticated ? 5 * 1024 * 1024 : 2 * 1024 * 1024; // 5MB or 2MB

  if (file.size > maxSize) {
    throw new Error(
      `The image must not exceed ${isAuthenticated ? "5MB" : "2MB"}. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );
  }

  // ============================================
  // 5. VALIDACIÓN DE DIMENSIONES Y VERIFICACIÓN REAL
  // ============================================
  const isValidImage = await validateRealImage(file);
  if (!isValidImage) {
    throw new Error(
      `Invalid image dimensions. Images must be between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels, and must be a valid image file.`
    );
  }

  // ============================================
  // 6. COMPRESIÓN AUTOMÁTICA
  // ============================================
  let fileToUpload = file;
  const targetMaxSizeMB = isAuthenticated ? 2 : 1; // Compress to 2MB for auth, 1MB for anon

  // Only compress if file is larger than target
  if (file.size > targetMaxSizeMB * 1024 * 1024) {
    try {
      const compressed = await compressImage(file, targetMaxSizeMB);
      // Only use compressed file if it's actually smaller and valid
      if (compressed && compressed instanceof File && compressed.size < file.size) {
        fileToUpload = compressed;
        logger.log(
          `Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`,
          undefined,
          "Image Utils"
        );
      } else {
        // Compression returned original file or failed silently
        fileToUpload = file;
      }
    } catch (error) {
      // Compression failed, continue with original file - don't block upload
      logger.warn("Compression failed, using original file", error, "Image Utils");
      fileToUpload = file;
    }
  }

  // ============================================
  // 7. UPLOAD TO STORAGE
  // ============================================
  const fileExt = fileToUpload.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const fileName = `${timestamp}-${randomId}.${fileExt}`;

  // Use different folders: 'signatures/' for authenticated, 'temp/' for unauthenticated
  const folder = isAuthenticated ? "signatures" : "temp";
  const filePath = `${folder}/${fileName}`;

  // Upload the file to the 'demomail' bucket
  const { data, error } = await supabase.storage
    .from("demomail")
    .upload(filePath, fileToUpload, {
      cacheControl: isAuthenticated ? "3600" : "300", // Shorter cache for temp files
      upsert: false,
    });

  if (error) {
    // If the error is RLS-related, provide a clearer message
    if (error.message.includes("row-level security") || error.message.includes("RLS")) {
      throw new Error(
        "Permission error: Please contact the administrator. Storage policies may need configuration."
      );
    }
    throw new Error(`Error uploading image: ${error.message}`);
  }

  // Get the public URL of the file
  // Note: Supabase Storage supports image transformations via getPublicUrl with transform options
  const {
    data: { publicUrl },
  } = supabase.storage.from("demomail").getPublicUrl(filePath, {
    transform: {
      width: undefined, // Will be set by optimization functions if needed
      height: undefined,
    },
  });

  // ============================================
  // 8. OPCIONAL: SUBIR A CLOUDFLARE IMAGES
  // ============================================
  // Si Cloudflare Images está configurado, también subir allí para transformaciones
  // Usamos el API route de Next.js para evitar CORS y proteger el API token
  const cloudflareAccountId = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_ID;
  const cloudflareApiToken = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_API_TOKEN;

  if (cloudflareAccountId && cloudflareApiToken && typeof window !== "undefined") {
    try {
      logger.log("Attempting to upload to Cloudflare Images...", undefined, "Image Utils");
      // Upload to Cloudflare Images in the background (non-blocking)
      // Now uses Next.js API route to avoid CORS issues
      uploadToCloudflareImages(fileToUpload, fileName)
        .then((cloudflareUrl) => {
          if (cloudflareUrl) {
            logger.log(`Image also uploaded to Cloudflare Images: ${cloudflareUrl}`, undefined, "Image Utils");
            logger.log("Storing Cloudflare URL mapping in localStorage", undefined, "Image Utils");
            // Store Cloudflare URL in localStorage for future use
            const cloudflareUrls = JSON.parse(localStorage.getItem("cloudflare_image_urls") || "{}");
            cloudflareUrls[publicUrl] = cloudflareUrl;
            localStorage.setItem("cloudflare_image_urls", JSON.stringify(cloudflareUrls));
            logger.log(`Cloudflare URL stored. Total images in Cloudflare: ${Object.keys(cloudflareUrls).length}`, undefined, "Image Utils");
          }
          // If cloudflareUrl is null, it's silently skipped (plan limitation or not configured)
        })
        .catch((error) => {
          // Cloudflare is optional - don't show errors, just continue
          // The image is already uploaded to Supabase successfully
        });
    } catch (error) {
      logger.warn("Error initiating Cloudflare Images upload", error, "Image Utils");
      // Continue with Supabase URL
    }
  } else {
    if (typeof window !== "undefined") {
      const missing = [];
      if (!cloudflareAccountId) missing.push("ACCOUNT_ID");
      if (!cloudflareApiToken) missing.push("API_TOKEN");
      logger.log(`Cloudflare Images not configured. Missing: ${missing.join(", ")}`, undefined, "Image Utils");
      logger.log("Image uploaded to Supabase only (this is normal if Cloudflare is not configured)", undefined, "Image Utils");
    }
  }

  // ============================================
  // 9. TRACKEAR IMÁGENES TEMPORALES PARA MIGRACIÓN
  // ============================================
  // Si el usuario no está autenticado, guardar la URL en localStorage
  // para migrarla cuando se registre
  if (!isAuthenticated && typeof window !== "undefined") {
    const tempImagesKey = "temp_images";
    const tempImages = JSON.parse(localStorage.getItem(tempImagesKey) || "[]");
    tempImages.push({
      url: publicUrl,
      path: filePath,
      timestamp: timestamp,
    });
    localStorage.setItem(tempImagesKey, JSON.stringify(tempImages));
  }

  return publicUrl;
}

/**
 * Uploads image to Cloudflare Images via Next.js API route
 * This avoids CORS issues and protects the API token
 * @param file - Image file to upload
 * @param fileName - Name for the file
 * @returns Cloudflare Images URL or null if failed
 */
async function uploadToCloudflareImages(
  file: File,
  fileName: string
): Promise<string | null> {
  try {
    logger.log("Uploading to Cloudflare Images via API route...", undefined, "Image Utils");
    
    // Upload via Next.js API route to avoid CORS and protect API token
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    const response = await fetch("/api/cloudflare/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle 403 (plan limitations) gracefully
      if (response.status === 403) {
        logger.log("Cloudflare Images storage not available (Free plan limitation). Using Supabase only.", undefined, "Image Utils");
        logger.log("This is normal - Cloudflare Free plan doesn't support image storage.", undefined, "Image Utils");
        return null; // Return null silently, don't throw error
      }
      
      // For other errors, log but don't block
      const errorMessage = `Cloudflare Images upload failed: ${response.status}`;
      logger.warn(errorMessage, errorData.reason === "plan_limitation" ? "- Plan limitation" : undefined, "Image Utils");
      return null; // Don't throw, just return null
    }

    const data = await response.json();
    logger.log("Cloudflare API response", { success: data.success, imageId: data.imageId }, "Image Utils");
    
    if (data.success && data.url) {
      logger.log(`Generated Cloudflare delivery URL: ${data.url}`, undefined, "Image Utils");
      return data.url;
    }

    logger.warn("Cloudflare API returned success=false or no URL", undefined, "Image Utils");
    return null;
  } catch (error) {
    // Don't log errors as critical - Cloudflare is optional
    logger.log("Cloudflare Images upload skipped (optional feature)", undefined, "Image Utils");
    return null;
  }
}

// ============================================
// MIGRACIÓN DE IMÁGENES TEMPORALES
// ============================================

const TEMP_IMAGES_KEY = "temp_images";

/**
 * Migrates temporary images from temp/ to signatures/ folder
 * Called when user registers or logs in
 * @param userId - User ID of the authenticated user
 * @returns Array of migrated image URLs (old URL -> new URL mapping)
 */
export async function migrateTempImages(userId: string): Promise<Array<{ oldUrl: string; newUrl: string }>> {
  if (typeof window === "undefined") return [];

  const tempImages = JSON.parse(localStorage.getItem(TEMP_IMAGES_KEY) || "[]");
  if (tempImages.length === 0) return [];

  const migrated: Array<{ oldUrl: string; newUrl: string }> = [];
  const errors: string[] = [];

  // Migrate each image
  for (const image of tempImages) {
    try {
      const oldPath = image.path;
      
      // Extract filename from path (e.g., "temp/1234567890-abc123.jpg" -> "1234567890-abc123.jpg")
      const fileName = oldPath.split("/").pop();
      if (!fileName) continue;

      const newPath = `signatures/${fileName}`;

      // Check if file exists in temp/
      const { data: fileData, error: checkError } = await supabase.storage
        .from("demomail")
        .list("temp", {
          search: fileName,
        });

      if (checkError || !fileData || fileData.length === 0) {
        logger.warn(`Image not found in temp/: ${fileName}`, undefined, "Image Utils");
        continue;
      }

      // Download file from temp/
      const { data: fileContent, error: downloadError } = await supabase.storage
        .from("demomail")
        .download(oldPath);

      if (downloadError || !fileContent) {
        logger.error(`Error downloading image: ${downloadError?.message}`, downloadError, "Image Utils");
        errors.push(`Failed to download ${fileName}`);
        continue;
      }

      // Upload to signatures/
      const { error: uploadError } = await supabase.storage
        .from("demomail")
        .upload(newPath, fileContent, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        logger.error(`Error uploading to signatures/: ${uploadError.message}`, uploadError, "Image Utils");
        errors.push(`Failed to upload ${fileName}`);
        continue;
      }

      // Get new public URL
      const {
        data: { publicUrl: newUrl },
      } = supabase.storage.from("demomail").getPublicUrl(newPath);

      // Delete old file from temp/
      const { error: deleteError } = await supabase.storage
        .from("demomail")
        .remove([oldPath]);

      if (deleteError) {
        logger.warn(`Warning: Could not delete old file ${oldPath}: ${deleteError.message}`, undefined, "Image Utils");
        // Continue anyway - the file will be cleaned up by the cleanup function
      }

      migrated.push({
        oldUrl: image.url,
        newUrl: newUrl,
      });
    } catch (error) {
      logger.error(`Error migrating image ${image.path}`, error instanceof Error ? error : new Error(String(error)), "Image Utils");
      errors.push(`Error migrating ${image.path}`);
    }
  }

  // Clear temp images from localStorage after migration
  if (migrated.length > 0) {
    localStorage.removeItem(TEMP_IMAGES_KEY);
    logger.log(`Migrated ${migrated.length} temporary image(s) to permanent storage`, undefined, "Image Utils");
  }

  if (errors.length > 0) {
    logger.warn("Some images could not be migrated", errors, "Image Utils");
  }

  return migrated;
}

/**
 * Gets list of temporary image URLs stored in localStorage
 * Filters out invalid entries to ensure only accessible URLs are returned
 * @returns Array of temporary image URLs (filtered to remove invalid entries)
 */
export function getTempImages(): string[] {
  if (typeof window === "undefined") return [];
  
  try {
    const tempImages = JSON.parse(localStorage.getItem(TEMP_IMAGES_KEY) || "[]");
    
    // Validate and filter: only return items that have a valid url property (string and non-empty)
    return tempImages
      .filter((img: any) => img && typeof img === "object" && typeof img.url === "string" && img.url.trim().length > 0)
      .map((img: any) => img.url);
  } catch (error) {
    logger.error("Error parsing temp images from localStorage", error instanceof Error ? error : new Error(String(error)), "Image Utils");
    // If localStorage is corrupted, clear it and return empty array
    try {
      localStorage.removeItem(TEMP_IMAGES_KEY);
    } catch (clearError) {
      logger.error("Error clearing corrupted temp images", clearError instanceof Error ? clearError : new Error(String(clearError)), "Image Utils");
    }
    return [];
  }
}

// ============================================
// OPTIMIZACIÓN DE URLs DE IMÁGENES
// ============================================

/**
 * Optimizes image URL for better performance using Cloudflare Images if configured
 * Falls back to query parameters if Cloudflare is not configured
 * 
 * @param url - Original image URL
 * @param options - Optimization options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "jpg" | "png";
  }
): string {
  if (!url) return url;

  // If it's a data URL, return as-is
  if (url.startsWith("data:")) {
    return url;
  }

  // Skip Google Drive URLs (they have their own optimization)
  if (url.includes("drive.google.com")) {
    return url;
  }

  // ============================================
  // OPCIÓN 1: Supabase Storage Transformations (Recomendado)
  // Funciona en plan gratuito, sin configuración adicional
  // Formato: https://...supabase.co/storage/v1/render/image/public/...?width=...&quality=...
  // ============================================
  if (url.includes("supabase.co/storage/v1/object/public/") && options && (options.width || options.quality || options.format)) {
    try {
      // Convert Supabase Storage URL to render URL
      // From: https://...supabase.co/storage/v1/object/public/demomail/signatures/foto.jpg
      // To: https://...supabase.co/storage/v1/render/image/public/demomail/signatures/foto.jpg?width=...
      const renderUrl = url.replace("/object/public/", "/render/image/public/");
      const urlObj = new URL(renderUrl);
      
      if (options.width) urlObj.searchParams.set("width", options.width.toString());
      if (options.height) urlObj.searchParams.set("height", options.height.toString());
      if (options.quality) urlObj.searchParams.set("quality", options.quality.toString());
      // Supabase Storage Transformations: format parameter only accepts "origin"
      // Supabase automatically optimizes to WebP when supported by browser
      // Only use format=origin if we want to keep the original format (not recommended for optimization)
      // For optimization, we skip format and let Supabase auto-optimize to WebP
      
      return urlObj.toString();
    } catch (error) {
      logger.warn("Error building Supabase Storage transformation URL", error, "Image Utils");
      // Fall through to other options
    }
  }

  // ============================================
  // OPCIÓN 2: Cloudflare Image Resizing (Si está configurado)
  // Funciona con plan gratuito: hasta 5,000 transformaciones/mes
  // Requiere habilitación en Cloudflare Dashboard
  // Formato: https://<DOMINIO>/cdn-cgi/image/<OPCIONES>/<URL_IMAGEN>
  // ============================================
  const cloudflareResizingDomain = typeof window !== "undefined"
    ? (window as any).__CLOUDFLARE_RESIZING_DOMAIN__ || process.env.NEXT_PUBLIC_CLOUDFLARE_RESIZING_DOMAIN
    : process.env.NEXT_PUBLIC_CLOUDFLARE_RESIZING_DOMAIN;

  if (cloudflareResizingDomain && options && (options.width || options.quality || options.format)) {
    try {
      // Build transformation parameters
      const params: string[] = [];
      if (options.width) params.push(`width=${options.width}`);
      if (options.height) params.push(`height=${options.height}`);
      if (options.quality) params.push(`quality=${options.quality}`);
      if (options.format) {
        // Map format names
        const formatMap: Record<string, string> = {
          webp: "webp",
          jpg: "jpeg",
          png: "png",
        };
        params.push(`format=${formatMap[options.format] || options.format}`);
      }
      
      if (params.length > 0) {
        const optionsStr = params.join(',');
        // Cloudflare Image Resizing format: https://<DOMINIO>/cdn-cgi/image/<OPCIONES>/<URL_IMAGEN>
        // Note: encodeURIComponent may cause issues, try without encoding first
        // If URL contains special characters, they may need encoding
        const imageUrl = url.includes('://') ? encodeURIComponent(url) : url;
        return `https://${cloudflareResizingDomain}/cdn-cgi/image/${optionsStr}/${imageUrl}`;
      }
    } catch (error) {
      logger.warn("Error building Cloudflare Image Resizing URL", error, "Image Utils");
      // Fall through to other options
    }
  }

  // ============================================
  // OPCIÓN 2: Cloudflare Images (Si la imagen ya está en Cloudflare)
  // ============================================
  const cloudflareAccountHash = typeof window !== "undefined"
    ? (window as any).__CLOUDFLARE_ACCOUNT_HASH__ || process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH
    : process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  
  const cloudflareDeliveryUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DELIVERY_URL || "https://imagedelivery.net";

  // If Cloudflare Images is configured, check if we have a Cloudflare URL for this image
  if (cloudflareAccountHash && typeof window !== "undefined") {
    try {
      // Check if we have a Cloudflare URL stored for this Supabase URL
      const cloudflareUrls = JSON.parse(localStorage.getItem("cloudflare_image_urls") || "{}");
      const cloudflareUrl = cloudflareUrls[url];
      
      if (cloudflareUrl) {
        // We have a Cloudflare URL, apply transformations
        const transformations: string[] = [];
        
        if (options?.width) transformations.push(`w=${options.width}`);
        if (options?.height) transformations.push(`h=${options.height}`);
        if (options?.quality) transformations.push(`q=${options.quality}`);
        if (options?.format) transformations.push(`f=${options.format}`);
        
        // If no transformations, use default variant
        const variant = transformations.length > 0 
          ? transformations.join(',')
          : 'public';
        
        // Build optimized URL: https://imagedelivery.net/{account_hash}/{image_id}/{variant}
        // Extract image ID from Cloudflare URL
        const urlMatch = cloudflareUrl.match(/imagedelivery\.net\/[^/]+\/([^/]+)\//);
        if (urlMatch && urlMatch[1]) {
          const imageId = urlMatch[1];
          return `${cloudflareDeliveryUrl}/${cloudflareAccountHash}/${imageId}/${variant}`;
        }
      }
    } catch (error) {
      logger.warn("Error building Cloudflare Images URL", error, "Image Utils");
      // Fall through to default behavior
    }
  }

  // ============================================
  // FALLBACK: Query parameters (para futuras integraciones)
  // ============================================
  const urlObj = new URL(url);
  
  if (options) {
    if (options.width) {
      urlObj.searchParams.set("width", options.width.toString());
    }
    if (options.height) {
      urlObj.searchParams.set("height", options.height.toString());
    }
    if (options.quality) {
      urlObj.searchParams.set("quality", options.quality.toString());
    }
    if (options.format) {
      urlObj.searchParams.set("format", options.format);
    }
  }

  return urlObj.toString();
}

/**
 * Gets optimized image URL for different contexts
 * Provides sensible defaults for common use cases
 * 
 * @param url - Original image URL
 * @param context - Image context (thumbnail, preview, full)
 * @returns Optimized image URL
 */
export function getContextualImageUrl(
  url: string,
  context: "thumbnail" | "preview" | "full" = "full"
): string {
  if (!url) return url;

  const contextOptions = {
    thumbnail: { width: 150, height: 150, quality: 80, format: "webp" as const },
    preview: { width: 400, height: 400, quality: 85, format: "webp" as const },
    full: { quality: 90, format: "webp" as const },
  };

  return getOptimizedImageUrl(url, contextOptions[context]);
}

/**
 * Checks if browser supports WebP format
 * @returns true if WebP is supported
 */
export function supportsWebP(): boolean {
  if (typeof window === "undefined") return false;
  
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}
