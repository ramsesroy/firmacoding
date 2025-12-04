import { NextRequest, NextResponse } from "next/server";

const AI_WEBHOOK_URL = process.env.NEXT_PUBLIC_AI_WEBHOOK_URL || "https://n8n.supportpalestine.site/webhook-test/generar-firma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!AI_WEBHOOK_URL) {
      console.error("AI Generate API - AI_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "AI Generator webhook is not configured" },
        { status: 500 }
      );
    }

    console.log("AI Generate API - Sending to webhook:", AI_WEBHOOK_URL);
    console.log("AI Generate API - Payload:", JSON.stringify(body, null, 2));

    // Test if webhook URL is accessible
    try {
      const response = await fetch(AI_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 seconds timeout
      });

      console.log("AI Generate API - Response status:", response.status);
      console.log("AI Generate API - Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorText = "";
        try {
          errorText = await response.text();
          console.error("AI Generate API - Error response body:", errorText);
        } catch (e) {
          console.error("AI Generate API - Could not read error response");
        }
        
        return NextResponse.json(
          { 
            error: `Webhook returned error (${response.status}): ${response.statusText}`,
            details: errorText || "No additional details available",
            webhookUrl: AI_WEBHOOK_URL
          },
          { status: response.status }
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("AI Generate API - Non-JSON response:", text.substring(0, 500));
        return NextResponse.json(
          { 
            error: `Invalid response format. Expected JSON, got: ${contentType}`,
            responsePreview: text.substring(0, 200)
          },
          { status: 500 }
        );
      }

      const data = await response.json();
      console.log("AI Generate API - Success, received", Array.isArray(data) ? data.length : "non-array", "items");

      if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json(
          {
            error: "Invalid response from webhook: Expected array with at least one signature",
            received: typeof data === "object" ? JSON.stringify(data).substring(0, 200) : String(data)
          },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error("AI Generate API - Fetch exception:", fetchError);
      
      if (fetchError.name === "AbortError" || fetchError.name === "TimeoutError") {
        return NextResponse.json(
          {
            error: "Webhook request timed out. The service may be slow or unavailable.",
            webhookUrl: AI_WEBHOOK_URL
          },
          { status: 504 }
        );
      }
      
      if (fetchError.message?.includes("Failed to fetch") || fetchError.cause?.code === "ECONNREFUSED") {
        return NextResponse.json(
          {
            error: "Could not connect to webhook. Please verify the URL is correct and accessible.",
            webhookUrl: AI_WEBHOOK_URL,
            details: fetchError.message
          },
          { status: 503 }
        );
      }
      
      throw fetchError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("AI Generate API - Exception:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Check server logs for more information",
        webhookUrl: AI_WEBHOOK_URL
      },
      { status: 500 }
    );
  }
}

