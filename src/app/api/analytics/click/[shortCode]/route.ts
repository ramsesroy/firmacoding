import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create server-side Supabase client for API routes
// This bypasses RLS for reading tracked links (needed for public link clicks)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      persistSession: false,
    },
  }
);

// Get user's IP address from request
function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || null;
}

// Parse user agent to extract device info
function parseUserAgent(userAgent: string | null): {
  device_type: string;
  browser: string;
  os: string;
} {
  if (!userAgent) {
    return { device_type: "unknown", browser: "unknown", os: "unknown" };
  }

  const ua = userAgent.toLowerCase();

  // Detect device type
  let device_type = "desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device_type = "mobile";
  } else if (/ipad|tablet/i.test(ua)) {
    device_type = "tablet";
  }

  // Detect browser
  let browser = "unknown";
  if (ua.includes("chrome") && !ua.includes("edg")) {
    browser = "Chrome";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
  } else if (ua.includes("edg")) {
    browser = "Edge";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser = "Opera";
  }

  // Detect OS
  let os = "unknown";
  if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("mac os") || ua.includes("macos")) {
    os = "macOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS";
  }

  return { device_type, browser, os };
}

// Get country from IP (simplified - in production, use a service like MaxMind)
async function getCountryFromIP(ip: string | null): Promise<{ country?: string; city?: string }> {
  // For now, return empty - can be enhanced with IP geolocation service
  // In production, use a service like:
  // - MaxMind GeoIP2
  // - ipapi.co
  // - ip-api.com
  return {};
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    if (!shortCode || shortCode.length < 6) {
      return NextResponse.json({ error: "Invalid short code" }, { status: 400 });
    }

    // Get the tracked link from database
    const { data: trackedLink, error: linkError } = await supabase
      .from("tracked_links")
      .select("id, original_url")
      .eq("short_code", shortCode)
      .single();

    if (linkError || !trackedLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Get request metadata
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get("user-agent");
    const referer = request.headers.get("referer");
    const { device_type, browser, os } = parseUserAgent(userAgent);
    const { country, city } = await getCountryFromIP(ipAddress);

    // Record the click
    const { error: clickError } = await supabase
      .from("link_clicks")
      .insert({
        tracked_link_id: trackedLink.id,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
        referer: referer || null,
        device_type,
        browser,
        os,
        country: country || null,
        city: city || null,
      });

    if (clickError) {
      console.error("Error recording click:", clickError);
      // Don't fail the redirect if click recording fails
    }

    // Increment click count
    const { error: incrementError } = await supabase.rpc("increment_click_count", {
      link_id: trackedLink.id,
    });

    if (incrementError) {
      console.error("Error incrementing click count:", incrementError);
      // Don't fail the redirect if increment fails
    }

    // Redirect to original URL
    return NextResponse.redirect(trackedLink.original_url, {
      status: 302,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error processing click:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
