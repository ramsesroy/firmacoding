import { NextRequest, NextResponse } from "next/server";

// n8n webhook URL for AI Signature Helper
// Production URL: https://n8n.avyris.com/webhook/webhook/ai-signature-helper
// Test URL: https://n8n.avyris.com/webhook/webhook-test/ai-signature-helper
// IMPORTANT: The workflow MUST be ACTIVE in n8n for production URLs to work
// If production URL doesn't work, try using the test URL temporarily
const N8N_WEBHOOK_URL = process.env.N8N_AI_HELPER_WEBHOOK_URL || 
  "https://n8n.avyris.com/webhook/webhook-test/ai-signature-helper";

// OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// GET method for health check and deployment verification
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "AI Signature Helper API",
      endpoint: "/api/ai-helper/suggestions",
      method: "POST",
      version: "1.0.0",
      deployed: true,
    },
    { 
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  console.log("[AI Helper API] POST request received");
  try {
    const body = await request.json();
    console.log("[AI Helper API] Request body received:", {
      hasUserProfile: !!body.userProfile,
      hasCurrentSignature: !!body.currentSignature,
    });

    // Validate required fields
    if (!body.userProfile || !body.userProfile.fullName || !body.userProfile.role) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing required fields: userProfile.fullName and userProfile.role are required",
          },
          metadata: {
            generatedAt: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    if (!body.currentSignature || !body.currentSignature.templateId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing required field: currentSignature.templateId",
          },
          metadata: {
            generatedAt: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Forward request to n8n webhook
    const startTime = Date.now();
    console.log("[AI Helper API] Calling n8n webhook:", N8N_WEBHOOK_URL);
    console.log("[AI Helper API] Request body keys:", Object.keys(body));
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    console.log("[AI Helper API] n8n response status:", response.status, response.statusText);
    console.log("[AI Helper API] n8n response headers:", Object.fromEntries(response.headers.entries()));

    const processingTime = (Date.now() - startTime) / 1000;

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AI_SERVICE_ERROR",
            message: "Unable to generate suggestions at this time",
            details: `n8n webhook returned ${response.status}: ${errorText}`,
          },
          metadata: {
            generatedAt: new Date().toISOString(),
            processingTime,
          },
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Ensure metadata is present
    if (!data.metadata) {
      data.metadata = {
        generatedAt: new Date().toISOString(),
        processingTime,
      };
    } else {
      data.metadata.processingTime = processingTime;
    }

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error calling AI helper:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Unable to connect to AI service",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        metadata: {
          generatedAt: new Date().toISOString(),
        },
      },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
