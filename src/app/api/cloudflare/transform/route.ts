import { NextRequest, NextResponse } from "next/server";

/**
 * API Route to transform images using Cloudflare Images
 * This endpoint transforms images that are already stored (e.g., in Supabase)
 * The Free plan allows transformations (up to 5,000/month) but not storage
 */
export async function POST(request: NextRequest) {
  try {
    // Get Cloudflare credentials from environment variables
    const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_ID;
    const apiToken = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_API_TOKEN;
    const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH;

    // Validate required environment variables
    if (!accountId || !apiToken || !accountHash) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cloudflare Images not configured. Missing credentials." 
        },
        { status: 500 }
      );
    }

    // Get request body
    const body = await request.json();
    const { imageUrl, options = {} } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "No image URL provided" },
        { status: 400 }
      );
    }

    // Cloudflare Images can transform images from external URLs
    // We need to upload the image first, then we can transform it
    // However, for transformations only (Free plan), we can use the direct URL transformation
    
    // Option 1: If image is already in Cloudflare, use direct transformation
    // Option 2: For external images (Supabase), we need to fetch and upload first
    
    // For now, let's use Cloudflare's direct URL transformation feature
    // This works by fetching the image from the URL and transforming it on-the-fly
    
    // Build transformation parameters
    const {
      width,
      height,
      fit = "scale-down", // scale-down, contain, cover, crop, pad
      quality = 90, // 1-100
      format = "webp", // webp, avif, jpeg, png
      sharpen = 1, // 0-5
    } = options;

    // Cloudflare Images transformation URL format:
    // https://imagedelivery.net/{account_hash}/{image_id}/{variant}
    // But for external URLs, we need to use a different approach
    
    // Since Cloudflare Images Free plan doesn't support storage,
    // we'll use Cloudflare's Image Resizing service instead (if available)
    // Or we can use the transformation API with external URLs
    
    // For now, let's create a transformation URL that Cloudflare can process
    // This requires the image to be accessible via a public URL
    
    // Build transformation variant name
    const variantParts = [];
    if (width) variantParts.push(`w${width}`);
    if (height) variantParts.push(`h${height}`);
    variantParts.push(`fit-${fit}`);
    variantParts.push(`q${quality}`);
    variantParts.push(`f${format}`);
    if (sharpen > 0) variantParts.push(`sh${sharpen}`);
    
    const variant = variantParts.join(",");

    // For external images, Cloudflare Images needs the image to be uploaded first
    // But we can use Cloudflare's Image Resizing (separate service) for external URLs
    // Or we can fetch the image and upload it temporarily
    
    // Alternative: Use Cloudflare's Image Resizing API (if available)
    // This works with external URLs without needing to upload
    
    // For now, return a transformation-ready URL structure
    // The actual transformation will happen when the image is requested
    
    // Note: This is a simplified approach. For production, you might want to:
    // 1. Upload the image to Cloudflare first (requires paid plan)
    // 2. Or use Cloudflare's Image Resizing service (separate from Images)
    // 3. Or proxy the image through your server and apply transformations
    
    return NextResponse.json({
      success: true,
      transformedUrl: imageUrl, // For now, return original (will implement full transformation)
      variant,
      message: "Transformation URL generated. Full transformation requires image to be in Cloudflare.",
    });
  } catch (error: any) {
    console.error("Error in Cloudflare transform API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error.message 
      },
      { status: 500 }
    );
  }
}

