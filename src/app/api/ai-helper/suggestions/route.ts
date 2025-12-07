import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

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
      "Access-Control-Allow-Origin": process.env.NODE_ENV === 'production' 
        ? (process.env.NEXT_PUBLIC_APP_URL || "*")
        : "*",
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
        "Access-Control-Allow-Origin": process.env.NODE_ENV === 'production' 
        ? (process.env.NEXT_PUBLIC_APP_URL || "*")
        : "*",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  // Removed console.log - use logger if needed for debugging
  
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
  
  logger.log("Request body received", {
    hasUserProfile: !!requestBody.userProfile,
    hasCurrentSignature: !!requestBody.currentSignature,
  }, "AI Helper API");

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
  logger.log(`Calling n8n webhook: ${N8N_WEBHOOK_URL}`, undefined, "AI Helper API");
  logger.log("Request body keys", Object.keys(requestBody), "AI Helper API");
  
  let n8nResponse: Response | null = null;
  let lastError: string | null = null;
  let n8nResponseData: any = null;
  const maxRetries = 2;
  
  // Retry logic in case of temporary n8n registration issues
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      logger.log(`Retry attempt ${attempt}/${maxRetries} after 1 second...`, undefined, "AI Helper API");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    try {
      logger.log(`Attempt ${attempt + 1}: Calling ${N8N_WEBHOOK_URL}`, undefined, "AI Helper API");
      n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Use the body variable we read once
      });
      
      logger.log(`n8n response status (attempt ${attempt + 1}): ${n8nResponse.status} ${n8nResponse.statusText}`, undefined, "AI Helper API");
      logger.log(`n8n response URL: ${n8nResponse.url}`, undefined, "AI Helper API");
      
      // If successful, parse JSON and break retry loop
      if (n8nResponse.ok) {
        try {
          // 1. Obtener el cuerpo de la respuesta crudo
          const data = await n8nResponse.json();
          logger.debug("Raw n8n response", data, "AI Helper API");
          
          let rawJsonString = "";
          let finalData: any = null;
          
          // 2. CASCADA DE INTENTOS DE EXTRACCIÓN:
          
          // CASO 1: Formato Crudo de Gemini (parts[0].text) <- ESTE ES EL QUE ESTÁ OCURRIENDO
          if (data.parts && Array.isArray(data.parts) && data.parts[0] && data.parts[0].text) {
            logger.debug("Detectado formato Gemini (parts[0].text)", undefined, "AI Helper API");
            rawJsonString = data.parts[0].text;
          }
          // CASO 2: Formato n8n Text (text)
          else if (data.text && typeof data.text === 'string') {
            logger.debug("Detectado formato n8n (text)", undefined, "AI Helper API");
            rawJsonString = data.text;
          }
          // CASO 3: El objeto ya viene listo o es un array
          else if (Array.isArray(data) && data.length > 0) {
            logger.debug("n8n devolvió un array, usando el primer elemento", undefined, "AI Helper API");
            finalData = data[0];
          }
          // CASO 4: El objeto ya es el JSON final (tiene success, suggestions, etc.)
          else if (data && typeof data === 'object' && (data.success !== undefined || data.suggestions !== undefined)) {
            logger.debug("El objeto ya viene listo (formato directo)", undefined, "AI Helper API");
            finalData = data;
          }
          
          // 3. Limpieza y Parsing del string extraído
          if (rawJsonString) {
            try {
              logger.debug("Limpiando y parseando JSON string...", undefined, "AI Helper API");
              // Limpiar markdown ```json ... ``` y también \n escapados
              let cleanString = rawJsonString
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();
              
              // Si el string tiene \n literales, reemplazarlos por saltos de línea reales
              // pero solo si están escapados (\\n -> \n)
              cleanString = cleanString.replace(/\\n/g, "\n");
              
              // Intentar parsear
              finalData = JSON.parse(cleanString);
              logger.debug("JSON parseado exitosamente", undefined, "AI Helper API");
              logger.debug("Final data keys", Object.keys(finalData), "AI Helper API");
            } catch (e) {
              logger.error("Error parseando el string extraído", e instanceof Error ? e : new Error(String(e)), "AI Helper API");
              // Fallback: usar el objeto original
              finalData = data;
            }
          }
          
          // 4. Transformar formato si es necesario (n8n puede devolver diferentes estructuras)
          if (finalData) {
            // Si viene con "recommendations" en lugar de "suggestions", transformarlo
            if (finalData.recommendations && !finalData.suggestions) {
              logger.debug("Transformando formato: recommendations -> suggestions", undefined, "AI Helper API");
              // Transformar recommendations a contentSuggestions
              const contentSuggestions = Array.isArray(finalData.recommendations)
                ? finalData.recommendations.map((rec: any) => ({
                    type: "add_field" as const,
                    priority: "high" as const,
                    title: rec.title || "Suggestion",
                    description: rec.description || rec.reason || "",
                    reason: rec.reason || "",
                    example: rec.example || undefined,
                  }))
                : [];
              
              finalData = {
                success: true,
                suggestions: {
                  contentSuggestions,
                  templateRecommendation: finalData.templateRecommendation || {
                    recommendedTemplate: "modern-v1",
                    confidence: 0.85,
                    reason: "Based on your profile analysis",
                  },
                  missingInfo: finalData.missingInfo || [],
                  profileAnalysis: finalData.profileAnalysis || {
                    industry: "Technology",
                    roleCategory: "Development",
                    seniority: "Mid",
                    recommendedTone: "Professional",
                    targetAudience: "Professional contacts",
                  },
                  bestPractices: finalData.bestPractices || [],
                },
                metadata: finalData.metadata || {
                  generatedAt: new Date().toISOString(),
                },
              };
            }
            // Si no tiene success, agregarlo
            else if (!finalData.success && finalData.suggestions) {
              finalData.success = true;
            }
            // Si no tiene suggestions pero tiene otros datos, crear estructura básica
            else if (!finalData.suggestions && !finalData.success) {
              logger.warn("Respuesta no tiene estructura esperada, creando estructura básica", undefined, "AI Helper API");
              finalData = {
                success: true,
                suggestions: {
                  contentSuggestions: [],
                  templateRecommendation: {
                    recommendedTemplate: "modern-v1",
                    confidence: 0.85,
                    reason: "Default recommendation",
                  },
                  missingInfo: [],
                  profileAnalysis: {
                    industry: "General",
                    roleCategory: "Professional",
                    seniority: "Mid",
                    recommendedTone: "Professional",
                    targetAudience: "Professional contacts",
                  },
                  bestPractices: [],
                },
                metadata: {
                  generatedAt: new Date().toISOString(),
                },
              };
            }
          }
          
          // 5. Validación final
          if (!finalData) {
            logger.warn("No se pudo extraer datos finales, usando respuesta original", undefined, "AI Helper API");
            finalData = data;
          }
          
          if (!finalData.success) {
            logger.warn("La respuesta final no tiene success: true", finalData, "AI Helper API");
            // Forzar success si tiene suggestions
            if (finalData.suggestions) {
              finalData.success = true;
            }
          } else {
            logger.debug("Respuesta validada: success = true", undefined, "AI Helper API");
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
          logger.log(`n8n error response (attempt ${attempt + 1}): ${errorText}`, undefined, "AI Helper API");
        } catch (textError) {
          lastError = `HTTP ${n8nResponse.status}: ${n8nResponse.statusText}`;
        }
        
        // If 404, retry
        if (n8nResponse.status === 404) {
          logger.log(`n8n 404 error (attempt ${attempt + 1}): ${lastError}`, undefined, "AI Helper API");
          
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
      logger.error(`Fetch error (attempt ${attempt + 1})`, fetchError instanceof Error ? fetchError : new Error(String(fetchError)), "AI Helper API");
      
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
    logger.log(`n8n final error response: ${lastError}`, undefined, "AI Helper API");
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
      "Access-Control-Allow-Origin": process.env.NODE_ENV === 'production' 
        ? (process.env.NEXT_PUBLIC_APP_URL || "*")
        : "*",
    },
  });
}
