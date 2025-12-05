import { NextRequest, NextResponse } from "next/server";

/**
 * API Route to upload images to Cloudflare Images
 * This endpoint acts as a proxy to avoid CORS issues and protect the API token
 */
export async function POST(request: NextRequest) {
  try {
    // Get Cloudflare credentials from environment variables
    const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_ID;
    const apiToken = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_API_TOKEN;
    const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH;

    // Validate required environment variables
    if (!accountId || !apiToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cloudflare Images not configured. Missing ACCOUNT_ID or API_TOKEN." 
        },
        { status: 500 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Create FormData for Cloudflare API
    const cloudflareFormData = new FormData();
    cloudflareFormData.append("file", file);
    if (fileName) {
      cloudflareFormData.append("id", fileName);
    }

    // Upload to Cloudflare Images API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: cloudflareFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 403) {
        // 403 Forbidden usually means plan limitations (Free plan doesn't allow storage)
        console.warn("Cloudflare Images: 403 Forbidden - Plan may not support image storage");
        return NextResponse.json(
          { 
            success: false, 
            error: "Cloudflare Images storage not available",
            reason: "plan_limitation",
            message: "The Free plan of Cloudflare Images does not support image storage. Images will be served from Supabase instead.",
            details: errorData 
          },
          { status: 403 }
        );
      }
      
      console.error("Cloudflare Images API error:", response.status, errorData);
      return NextResponse.json(
        { 
          success: false, 
          error: `Cloudflare Images upload failed: ${response.status}`,
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.success && data.result) {
      // Build the delivery URL
      let deliveryUrl: string;
      if (accountHash) {
        deliveryUrl = `https://imagedelivery.net/${accountHash}/${data.result.id}/public`;
      } else {
        // Fallback to account ID (may not work)
        deliveryUrl = `https://imagedelivery.net/${accountId}/${data.result.id}/public`;
      }

      return NextResponse.json({
        success: true,
        url: deliveryUrl,
        imageId: data.result.id,
        filename: data.result.filename,
        uploaded: data.result.uploaded,
      });
    }

    return NextResponse.json(
      { success: false, error: "Cloudflare API returned success=false" },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error in Cloudflare upload API route:", error);
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

