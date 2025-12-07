import { NextRequest, NextResponse } from "next/server";

// n8n webhook URL for AI Signature Helper
// Clean production URL (without session IDs or temporary codes)
// Path in n8n Webhook node: /ai-signature-helper
// IMPORTANT: The workflow MUST be ACTIVE in n8n for production URLs to work
const N8N_WEBHOOK_URL = process.env.N8N_AI_HELPER_WEBHOOK_URL || 
  "https://n8n.avyris.com/webhook/ai-signature-helper";

// OPTIONS method for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(null, {
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
  
  // Read request body ONCE - request body can only be read once
  let requestBody: any;
  try {
    requestBody = await request.json();
  } catch (parseError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid JSON in request body",
          details: parseError instanceof Error ? parseError.message : "Unknown error",
        },
        metadata: {
          generatedAt: new Date().toISOString(),
        },
      },
      { status: 400 }
    );
  }
  
  console.log("[AI Helper API] Request body received:", {
    hasUserProfile: !!requestBody.userProfile,
    hasCurrentSignature: !!requestBody.currentSignature,
  });

  // Validate required fields
  if (!requestBody.userProfile || !requestBody.userProfile.fullName || !requestBody.userProfile.role) {
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

  if (!requestBody.currentSignature || !requestBody.currentSignature.templateId) {
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
  console.log("[AI Helper API] Request body keys:", Object.keys(requestBody));
  
  let n8nResponse: Response | null = null;
  let lastError: string | null = null;
  let n8nResponseData: any = null;
  const maxRetries = 2;
  
  // Retry logic in case of temporary n8n registration issues
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      console.log(`[AI Helper API] Retry attempt ${attempt}/${maxRetries} after 1 second...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    try {
      console.log(`[AI Helper API] Attempt ${attempt + 1}: Calling ${N8N_WEBHOOK_URL}`);
      n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Use the body variable we read once
      });
      
      console.log(`[AI Helper API] n8n response status (attempt ${attempt + 1}):`, n8nResponse.status, n8nResponse.statusText);
      console.log(`[AI Helper API] n8n response URL:`, n8nResponse.url);
      
      // If successful, parse JSON and break retry loop
      if (n8nResponse.ok) {
        try {
          // 1. Obtener el cuerpo de la respuesta crudo
          const rawData = await n8nResponse.json();
          console.log("📦 Raw n8n response:", JSON.stringify(rawData, null, 2));
          
          let finalData = rawData;
          
          // 2. DETECTOR DE ENVOLTORIO:
          // Si recibimos un objeto que tiene una propiedad 'text' que parece un JSON...
          if (rawData && typeof rawData === 'object' && rawData.text && typeof rawData.text === 'string') {
            try {
              console.log("🔓 Desempaquetando propiedad .text ...");
              // Limpiamos posibles bloques de markdown ```json
              const cleanText = rawData.text.replace(/```json/g, "").replace(/```/g, "").trim();
              finalData = JSON.parse(cleanText);
              console.log("✅ JSON desempaquetado exitosamente");
              console.log("📋 Final data keys:", Object.keys(finalData));
            } catch (e) {
              console.error("❌ Error parseando el texto interno:", e);
              // Si falla, seguimos con rawData por si acaso
              finalData = rawData;
            }
          } 
          // Si recibimos un array (otro caso común de n8n)
          else if (Array.isArray(rawData) && rawData.length > 0) {
            console.log("📦 n8n devolvió un array, usando el primer elemento");
            finalData = rawData[0];
          }
          
          // 3. Validación final
          if (!finalData.success) {
            console.warn("⚠️ La respuesta final no tiene success: true", finalData);
          } else {
            console.log("✅ Respuesta validada: success = true");
          }
          
          // Guardar los datos finales
          n8nResponseData = finalData;
          
          break;
        } catch (parseError) {
          console.error("[AI Helper API] Failed to parse n8n response as JSON:", parseError);
          lastError = parseError instanceof Error ? parseError.message : "Invalid JSON response from n8n";
          if (attempt === maxRetries) {
            const processingTime = (Date.now() - startTime) / 1000;
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: "AI_SERVICE_ERROR",
                  message: "Invalid response format from AI service",
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
      } else {
        // Store error text for non-200 responses
        try {
          const errorText = await n8nResponse.text();
          lastError = errorText;
          console.log(`[AI Helper API] n8n error response (attempt ${attempt + 1}):`, errorText);
        } catch (textError) {
          lastError = `HTTP ${n8nResponse.status}: ${n8nResponse.statusText}`;
        }
        
        // If 404, retry
        if (n8nResponse.status === 404) {
          console.log(`[AI Helper API] n8n 404 error (attempt ${attempt + 1}):`, lastError);
          
          // If this was the last attempt, return error
          if (attempt === maxRetries) {
            const processingTime = (Date.now() - startTime) / 1000;
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: "AI_SERVICE_ERROR",
                  message: "Unable to generate suggestions at this time. The n8n workflow may need to be reactivated.",
                  details: `n8n webhook returned ${n8nResponse.status} after ${maxRetries + 1} attempts: ${lastError}`,
                },
                metadata: {
                  generatedAt: new Date().toISOString(),
                  processingTime,
                },
              },
              { status: n8nResponse.status }
            );
          }
        } else {
          // Non-404 error, break and handle below
          break;
        }
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
  if (!n8nResponse) {
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

  // If response was not OK, return error (we already read the body in the loop)
  if (!n8nResponse.ok) {
    console.log("[AI Helper API] n8n final error response:", lastError);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AI_SERVICE_ERROR",
          message: "Unable to generate suggestions at this time",
          details: `n8n webhook returned ${n8nResponse.status}: ${lastError || "Unknown error"}`,
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTime,
        },
      },
      { status: n8nResponse.status }
    );
  }

  // If we have parsed response data, use it; otherwise return error
  if (!n8nResponseData) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AI_SERVICE_ERROR",
          message: "Invalid response from AI service",
          details: "Response body could not be parsed",
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTime,
        },
      },
      { status: 500 }
    );
  }

  // Ensure metadata is present
  if (!n8nResponseData.metadata) {
    n8nResponseData.metadata = {
      generatedAt: new Date().toISOString(),
      processingTime,
    };
  } else {
    n8nResponseData.metadata.processingTime = processingTime;
  }

  return NextResponse.json(n8nResponseData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
