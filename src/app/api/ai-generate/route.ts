import { NextRequest, NextResponse } from "next/server";

const AI_WEBHOOK_URL = process.env.NEXT_PUBLIC_AI_WEBHOOK_URL || "https://n8n.supportpalestine.site/webhook-test/generar-firma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("AI Generate API - Sending to webhook:", AI_WEBHOOK_URL);
    console.log("AI Generate API - Payload:", body);

    const response = await fetch(AI_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("AI Generate API - Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Generate API - Error response:", errorText);
      return NextResponse.json(
        { error: `Webhook error (${response.status}): ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("AI Generate API - Non-JSON response:", text);
      return NextResponse.json(
        { error: `Invalid response format. Expected JSON, got: ${contentType}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("AI Generate API - Success, received", Array.isArray(data) ? data.length : "non-array", "items");

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Generate API - Exception:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Check server logs for more information",
      },
      { status: 500 }
    );
  }
}

