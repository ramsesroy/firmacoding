// Link Tracking Utilities for Email Signature Analytics
// Converts regular links to tracked links and manages analytics

import { supabase } from "./supabaseClient";
import { logger } from "./logger";

export interface TrackedLink {
  id: string;
  user_id: string;
  signature_id?: string;
  original_url: string;
  short_code: string;
  link_type: "email" | "phone" | "website" | "social" | "other";
  link_label?: string;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface LinkClick {
  id: string;
  tracked_link_id: string;
  clicked_at: string;
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
}

export interface LinkAnalyticsSummary {
  total_clicks: number;
  unique_links: number;
  clicks_today: number;
  clicks_this_week: number;
  clicks_this_month: number;
  top_link_url: string | null;
  top_link_clicks: number | null;
}

/**
 * Detects the type of link based on URL
 */
export function detectLinkType(url: string): TrackedLink["link_type"] {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.startsWith("mailto:") || lowerUrl.includes("@")) {
    return "email";
  }
  if (lowerUrl.startsWith("tel:") || /^\+?[\d\s\-\(\)]+$/.test(url)) {
    return "phone";
  }
  if (
    lowerUrl.includes("linkedin.com") ||
    lowerUrl.includes("twitter.com") ||
    lowerUrl.includes("facebook.com") ||
    lowerUrl.includes("instagram.com") ||
    lowerUrl.includes("github.com") ||
    lowerUrl.includes("youtube.com")
  ) {
    return "social";
  }
  if (lowerUrl.startsWith("http://") || lowerUrl.startsWith("https://") || lowerUrl.startsWith("www.")) {
    return "website";
  }
  return "other";
}

/**
 * Detects link label from URL or social network name
 */
export function detectLinkLabel(url: string, linkType: TrackedLink["link_type"]): string {
  const lowerUrl = url.toLowerCase();
  
  if (linkType === "email") {
    return "Email";
  }
  if (linkType === "phone") {
    return "Phone";
  }
  if (linkType === "social") {
    if (lowerUrl.includes("linkedin.com")) return "LinkedIn";
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "Twitter/X";
    if (lowerUrl.includes("facebook.com")) return "Facebook";
    if (lowerUrl.includes("instagram.com")) return "Instagram";
    if (lowerUrl.includes("github.com")) return "GitHub";
    if (lowerUrl.includes("youtube.com")) return "YouTube";
    return "Social Media";
  }
  if (linkType === "website") {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return "Website";
    }
  }
  return "Link";
}

/**
 * Generates a random short code (client-side fallback)
 */
function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Creates a tracked link in the database
 */
export async function createTrackedLink(
  userId: string,
  originalUrl: string,
  signatureId?: string,
  linkLabel?: string
): Promise<TrackedLink | null> {
  try {
    const linkType = detectLinkType(originalUrl);
    const label = linkLabel || detectLinkLabel(originalUrl, linkType);

    // Generate short code (try RPC first, fallback to client-side)
    let shortCode: string;
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc("generate_short_code");
      if (!rpcError && rpcData) {
        shortCode = rpcData;
      } else {
        // Fallback to client-side generation
        shortCode = generateShortCode();
      }
    } catch {
      // Fallback to client-side generation
      shortCode = generateShortCode();
    }

    // Ensure uniqueness (check if code exists, regenerate if needed)
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("tracked_links")
        .select("short_code")
        .eq("short_code", shortCode)
        .maybeSingle();

      if (!existing) {
        break; // Code is unique
      }
      shortCode = generateShortCode();
      attempts++;
    }

    const { data, error } = await supabase
      .from("tracked_links")
      .insert({
        user_id: userId,
        signature_id: signatureId || null,
        original_url: originalUrl,
        short_code: shortCode,
        link_type: linkType,
        link_label: label,
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating tracked link", error, "Link Tracking");
      return null;
    }

    return data as TrackedLink;
  } catch (error) {
    logger.error("Error creating tracked link", error instanceof Error ? error : new Error(String(error)), "Link Tracking");
    return null;
  }
}

/**
 * Gets or creates a tracked link (idempotent)
 * Checks if a tracked link already exists for this URL in this signature
 */
export async function getOrCreateTrackedLink(
  userId: string,
  originalUrl: string,
  signatureId?: string,
  linkLabel?: string
): Promise<TrackedLink | null> {
  try {
    // First, try to find existing tracked link
    let query = supabase
      .from("tracked_links")
      .select("*")
      .eq("user_id", userId)
      .eq("original_url", originalUrl);

    if (signatureId) {
      query = query.eq("signature_id", signatureId);
    }

    const { data: existing, error: findError } = await query.maybeSingle();

    if (findError && findError.code !== "PGRST116") {
      // PGRST116 = no rows returned, which is fine
      logger.error("Error finding tracked link", findError, "Link Tracking");
    }

    if (existing) {
      return existing as TrackedLink;
    }

    // Create new tracked link
    return await createTrackedLink(userId, originalUrl, signatureId, linkLabel);
  } catch (error) {
    logger.error("Error getting or creating tracked link", error instanceof Error ? error : new Error(String(error)), "Link Tracking");
    return null;
  }
}

/**
 * Converts a regular URL to a tracked link URL
 * Returns the tracking URL that will redirect to the original URL
 */
export function getTrackedLinkUrl(shortCode: string): string {
  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || "https://signaturefor.me";
  
  return `${baseUrl}/api/analytics/click/${shortCode}`;
}

/**
 * Gets analytics summary for a user
 */
export async function getLinkAnalyticsSummary(
  userId: string,
  days: number = 30
): Promise<LinkAnalyticsSummary | null> {
  try {
    const { data, error } = await supabase.rpc("get_link_analytics_summary", {
      p_user_id: userId,
      p_days: days,
    });

    if (error) {
      logger.error("Error getting analytics summary", error, "Link Tracking");
      return null;
    }

    return data?.[0] as LinkAnalyticsSummary | null;
  } catch (error) {
    logger.error("Error getting analytics summary", error instanceof Error ? error : new Error(String(error)), "Link Tracking");
    return null;
  }
}

/**
 * Gets all tracked links for a user with click counts
 */
export async function getUserTrackedLinks(
  userId: string,
  signatureId?: string
): Promise<TrackedLink[]> {
  try {
    let query = supabase
      .from("tracked_links")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (signatureId) {
      query = query.eq("signature_id", signatureId);
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Error getting tracked links", error, "Link Tracking");
      return [];
    }

    return (data || []) as TrackedLink[];
  } catch (error) {
    logger.error("Error getting tracked links", error instanceof Error ? error : new Error(String(error)), "Link Tracking");
    return [];
  }
}

/**
 * Gets click history for a tracked link
 */
export async function getLinkClickHistory(
  trackedLinkId: string,
  limit: number = 100
): Promise<LinkClick[]> {
  try {
    const { data, error } = await supabase
      .from("link_clicks")
      .select("*")
      .eq("tracked_link_id", trackedLinkId)
      .order("clicked_at", { ascending: false })
      .limit(limit);

    if (error) {
      logger.error("Error getting click history", error, "Link Tracking");
      return [];
    }

    return (data || []) as LinkClick[];
  } catch (error) {
    logger.error("Error getting click history", error instanceof Error ? error : new Error(String(error)), "Link Tracking");
    return [];
  }
}

/**
 * Converts HTML string with regular links to tracked links
 * This is used when generating signatures for premium users
 */
export async function convertLinksToTracked(
  html: string,
  userId: string,
  signatureId?: string
): Promise<string> {
  // Only convert links if user is premium (check this in the calling function)
  // This function assumes premium status has been verified
  
  // Extract all <a href="..."> tags (more flexible regex)
  const linkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  const links: Array<{ url: string; fullMatch: string; label: string }> = [];
  
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const label = match[2];
    const fullMatch = match[0];
    
    // Skip data URLs, mailto, tel, and anchor links
    if (
      url.startsWith("data:") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      url.startsWith("#") ||
      url.startsWith("javascript:")
    ) {
      continue;
    }
    
    links.push({ url, fullMatch, label });
  }
  
  if (links.length === 0) {
    return html;
  }
  
  // Convert each link to tracked link
  let convertedHtml = html;
  for (const link of links) {
    try {
      const trackedLink = await getOrCreateTrackedLink(
        userId,
        link.url,
        signatureId,
        link.label || detectLinkLabel(link.url, detectLinkType(link.url))
      );
      
      if (trackedLink) {
        const trackedUrl = getTrackedLinkUrl(trackedLink.short_code);
        
        // Replace the href in the original link (handle both single and double quotes)
        const escapedUrl = link.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const newHref = `href="${trackedUrl}"`;
        convertedHtml = convertedHtml.replace(
          new RegExp(`href=["']${escapedUrl}["']`, "gi"),
          newHref
        );
      }
    } catch (error) {
      logger.error(`Error processing link: ${link.url}`, error instanceof Error ? error : new Error(String(error)), "Link Tracking");
    }
  }
  
  return convertedHtml;
}
