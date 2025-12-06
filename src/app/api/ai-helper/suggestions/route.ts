import { NextRequest, NextResponse } from "next/server";

// n8n webhook URL for AI Signature Helper
const N8N_WEBHOOK_URL = "https://n8n.avyris.com/webhook/webhook-test/ai-signature-helper";

// GET method for health check
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "AI Signature Helper API",
      endpoint: "/api/ai-helper/suggestions",
      method: "POST",
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

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

    return NextResponse.json(data);
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
      { status: 500 }
    );
  }
}
