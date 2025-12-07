import { NextRequest, NextResponse } from "next/server";

// n8n webhook URL for AI Signature Helper
// Using specific workflow URL provided by user
// IMPORTANT: The workflow MUST be ACTIVE in n8n for production URLs to work
const N8N_WEBHOOK_URL = process.env.N8N_AI_HELPER_WEBHOOK_URL || 
  "https://n8n.avyris.com/webhook/WeRk9jNdjwjDShF8/c45b45/webhook/ai-signature-helper";

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

    // Forward request to n8n webhook with retry logic
    const startTime = Date.now();
    console.log("[AI Helper API] Calling n8n webhook:", N8N_WEBHOOK_URL);
    console.log("[AI Helper API] Request body keys:", Object.keys(body));
    
    let response: Response | null = null;
    let lastError: string | null = null;
    const maxRetries = 2;
    
    // Retry logic in case of temporary n8n registration issues
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        console.log(`[AI Helper API] Retry attempt ${attempt}/${maxRetries} after 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      try {
        console.log(`[AI Helper API] Attempt ${attempt + 1}: Calling ${N8N_WEBHOOK_URL}`);
        response = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        
        console.log(`[AI Helper API] n8n response status (attempt ${attempt + 1}):`, response.status, response.statusText);
        console.log(`[AI Helper API] n8n response URL:`, response.url);
        console.log(`[AI Helper API] n8n response headers:`, Object.fromEntries(response.headers.entries()));
        
        // Read response body first
        const responseText = await response.text();
        console.log(`[AI Helper API] n8n response body (attempt ${attempt + 1}):`, responseText);
        
        // If successful, break retry loop
        if (response.ok) {
          break;
        }
        
        // If 404, store error and retry
        if (response.status === 404) {
          lastError = responseText;
          console.log(`[AI Helper API] n8n 404 error (attempt ${attempt + 1}):`, responseText);
          
          // If this was the last attempt, return error
          if (attempt === maxRetries) {
            const processingTime = (Date.now() - startTime) / 1000;
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: "AI_SERVICE_ERROR",
                  message: "Unable to generate suggestions at this time. The n8n workflow may need to be reactivated.",
                  details: `n8n webhook returned ${response.status} after ${maxRetries + 1} attempts: ${lastError}`,
                },
                metadata: {
                  generatedAt: new Date().toISOString(),
                  processingTime,
                },
              },
              { status: response.status }
            );
          }
        } else {
          // Non-404 error, break and handle below
          lastError = responseText;
          break;
        }
      } catch (fetchError) {
        lastError = fetchError instanceof Error ? fetchError.message : "Unknown error";
        console.error(`[AI Helper API] Fetch error (attempt ${attempt + 1}):`, fetchError);
        
        if (attempt === maxRetries) {
          const processingTime = (Date.now() - startTime) / 1000;
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "SERVICE_UNAVAILABLE",
                message: "Unable to connect to AI service",
                details: lastError,
              },
              metadata: {
                generatedAt: new Date().toISOString(),
                processingTime,
              },
            },
            { status: 500 }
          );
        }
      }
    }
    
    const processingTime = (Date.now() - startTime) / 1000;

    // Ensure response exists
    if (!response) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "Unable to connect to AI service",
            details: "No response received from n8n webhook",
          },
          metadata: {
            generatedAt: new Date().toISOString(),
            processingTime,
          },
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      const errorText = lastError || await response.text();
      console.log("[AI Helper API] n8n final error response:", errorText);
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
