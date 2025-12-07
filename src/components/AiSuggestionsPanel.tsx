"use client";

import React, { useState } from "react";
import { TemplateType, SignatureProps } from "@/types/signature";

interface AIHelperRequest {
  userProfile: {
    fullName: string;
    role: string;
    company?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    website?: string;
  };
  currentSignature: {
    templateId: string;
    fields: {
      hasPhoto: boolean;
      hasLogo: boolean;
      hasPhone: boolean;
      hasMobile: boolean;
      hasEmail: boolean;
      hasWebsite: boolean;
      hasAddress: boolean;
      hasSocialLinks: boolean;
      hasBusinessHours: boolean;
      hasQRCode: boolean;
      hasCallToAction: boolean;
    };
    socialLinks?: Array<{
      name: string;
      url: string;
    }>;
    additionalInfo?: {
      businessHours?: string | null;
      callToAction?: string | null;
      customMessage?: string | null;
    };
  };
  context: {
    userId: string;
    isPremium: boolean;
    language: string;
  };
}

interface AIHelperResponse {
  success: boolean;
  suggestions?: {
    templateRecommendation: {
      recommendedTemplate: string;
      confidence: number;
      reason: string;
      alternativeTemplates?: Array<{
        id: string;
        name: string;
        reason: string;
      }>;
    };
    contentSuggestions: Array<{
      type: "add_field" | "add_social" | "improve_content" | "add_feature" | "remove_field";
      priority: "high" | "medium" | "low";
      title: string;
      description: string;
      field?: string;
      platform?: string;
      feature?: string;
      current?: string;
      suggestion?: string;
      example?: string;
      reason?: string;
    }>;
    missingInfo: Array<{
      field: string;
      importance: "high" | "medium" | "low";
      reason: string;
    }>;
    profileAnalysis: {
      industry: string;
      roleCategory: string;
      seniority: "Entry" | "Mid" | "Senior/Executive" | "C-Level";
      recommendedTone: string;
      targetAudience: string;
    };
    bestPractices: Array<{
      category: string;
      tip: string;
      applied: boolean;
    }>;
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  metadata: {
    generatedAt: string;
    model?: string;
    processingTime?: number;
  };
}

interface AiSuggestionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  signatureData: SignatureProps;
  currentTemplate: TemplateType;
  userId: string;
  isPremium: boolean;
  userEmail?: string;
  onApplySuggestion?: (suggestion: any) => void;
  onTemplateChange?: (templateId: TemplateType) => void;
}

export default function AiSuggestionsPanel({
  isOpen,
  onClose,
  signatureData,
  currentTemplate,
  userId,
  isPremium,
  userEmail,
  onApplySuggestion,
  onTemplateChange,
}: AiSuggestionsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIHelperResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mapSignatureDataToRequest = (): AIHelperRequest => {
    // Extract website from social links (non-social URLs)
    const websiteLink = signatureData.redes?.find((r) => {
      const url = r.url.toLowerCase();
      return (
        url.startsWith("http") &&
        !url.includes("linkedin.com") &&
        !url.includes("twitter.com") &&
        !url.includes("x.com") &&
        !url.includes("github.com") &&
        !url.includes("facebook.com") &&
        !url.includes("instagram.com") &&
        !url.includes("youtube.com") &&
        !url.includes("tiktok.com") &&
        !url.includes("behance.net") &&
        !url.includes("dribbble.com")
      );
    });

    // Map social links
    const socialLinks = signatureData.redes?.map((red) => ({
      name: red.nombre,
      url: red.url,
    }));

    return {
      userProfile: {
        fullName: signatureData.nombre || "",
        role: signatureData.cargo || "",
        company: undefined, // Company not directly available in signature data
        email: userEmail,
        phone: signatureData.telefono,
        mobile: signatureData.telefonoMovil,
        address: signatureData.direccion,
        website: websiteLink?.url,
      },
      currentSignature: {
        templateId: currentTemplate,
        fields: {
          hasPhoto: !!signatureData.foto,
          hasLogo: !!signatureData.logoEmpresa,
          hasPhone: !!signatureData.telefono,
          hasMobile: !!signatureData.telefonoMovil,
          hasEmail: !!userEmail,
          hasWebsite: !!signatureData.redes?.some((r) => 
            r.url.includes("http") && !r.url.includes("linkedin") && !r.url.includes("twitter") && !r.url.includes("github")
          ),
          hasAddress: !!signatureData.direccion,
          hasSocialLinks: !!(signatureData.redes && signatureData.redes.length > 0),
          hasBusinessHours: !!signatureData.horario,
          hasQRCode: !!signatureData.qrLink,
          hasCallToAction: !!signatureData.ctaTexto,
        },
        socialLinks,
        additionalInfo: {
          businessHours: signatureData.horario || null,
          callToAction: signatureData.ctaTexto || null,
          customMessage: signatureData.textoAdicional || null,
        },
      },
      context: {
        userId,
        isPremium,
        language: "en",
      },
    };
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const requestBody = mapSignatureDataToRequest();
      
      // Use absolute URL to ensure correct routing
      const apiUrl = typeof window !== "undefined" 
        ? `${window.location.origin}/api/ai-helper/suggestions`
        : "/api/ai-helper/suggestions";
      
      console.log("[AI Helper] Sending request to:", apiUrl);
      console.log("[AI Helper] Request body:", requestBody);
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("[AI Helper] Response status:", res.status);
      console.log("[AI Helper] Response ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[AI Helper] Error response:", errorText);
        throw new Error(`Server returned ${res.status}: ${errorText || "Unknown error"}`);
      }

      const data: AIHelperResponse = await res.json();
      console.log("[AI Helper] Response data:", data);
      console.log("[AI Helper] Response structure check:", {
        hasSuggestions: !!data.suggestions,
        hasContentSuggestions: !!data.suggestions?.contentSuggestions,
        contentSuggestionsLength: data.suggestions?.contentSuggestions?.length,
        hasBestPractices: !!data.suggestions?.bestPractices,
        bestPracticesLength: data.suggestions?.bestPractices?.length,
        hasProfileAnalysis: !!data.suggestions?.profileAnalysis,
        hasTemplateRecommendation: !!data.suggestions?.templateRecommendation,
      });

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to get suggestions");
      }

      setResponse(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("[AI Helper] Error fetching AI suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (isOpen && !response && !loading) {
      fetchSuggestions();
    }
  };

  React.useEffect(() => {
    if (isOpen && !response && !loading) {
      fetchSuggestions();
    } else if (!isOpen) {
      setResponse(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTemplateDisplayName = (templateId: string): string => {
    const templateNames: Record<string, string> = {
      "modern-v1": "Modern",
      "modern-v2": "Modern V2",
      "modern-tech-v1": "Modern Tech",
      "classic-v1": "Classic",
      "minimal-v1": "Minimal",
      "corporate-v1": "Corporate",
      "creative-v1": "Creative",
    };
    return templateNames[templateId] || templateId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const safeParseConfidence = (confidence: any): number => {
    if (typeof confidence === "number") return confidence;
    if (typeof confidence === "string") {
      const parsed = parseFloat(confidence);
      if (!isNaN(parsed)) return parsed;
    }
    return 0.85; // Default confidence if invalid
  };

  const handleApplySuggestion = (suggestion: any) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    if (onTemplateChange) {
      onTemplateChange(templateId as TemplateType);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Signature Helper</h2>
              <p className="text-sm text-gray-600">Intelligent suggestions for your signature</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium text-gray-700">Analyzing your professional profile...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">error</span>
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
              <button
                onClick={fetchSuggestions}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {response?.suggestions && !loading && (
            <div className="space-y-6">
              {/* Profile Analysis */}
              {response.suggestions.profileAnalysis && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">analytics</span>
                    Profile Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {response.suggestions.profileAnalysis.industry && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Industry</p>
                        <p className="font-semibold text-gray-900">{response.suggestions.profileAnalysis.industry}</p>
                      </div>
                    )}
                    {response.suggestions.profileAnalysis.roleCategory && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Role Category</p>
                        <p className="font-semibold text-gray-900">{response.suggestions.profileAnalysis.roleCategory}</p>
                      </div>
                    )}
                    {response.suggestions.profileAnalysis.seniority && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Seniority</p>
                        <p className="font-semibold text-gray-900">{response.suggestions.profileAnalysis.seniority}</p>
                      </div>
                    )}
                    {response.suggestions.profileAnalysis.recommendedTone && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Recommended Tone</p>
                        <p className="font-semibold text-gray-900">{response.suggestions.profileAnalysis.recommendedTone}</p>
                      </div>
                    )}
                  </div>
                  {response.suggestions.profileAnalysis.targetAudience && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Target Audience</p>
                      <p className="text-gray-900">{response.suggestions.profileAnalysis.targetAudience}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Template Recommendation */}
              {response.suggestions.templateRecommendation && 
               response.suggestions.templateRecommendation.recommendedTemplate !== currentTemplate && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">palette</span>
                    Template Recommendation
                  </h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">
                        {getTemplateDisplayName(response.suggestions.templateRecommendation.recommendedTemplate)}
                      </p>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {Math.round(safeParseConfidence(response.suggestions.templateRecommendation.confidence) * 100)}% match
                      </span>
                    </div>
                    <p className="text-gray-700">{response.suggestions.templateRecommendation.reason || "This template matches your professional profile."}</p>
                  </div>
                  {onTemplateChange && (
                    <button
                      onClick={() => handleTemplateChange(response.suggestions!.templateRecommendation.recommendedTemplate)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Switch to This Template
                    </button>
                  )}
                  {response.suggestions.templateRecommendation.alternativeTemplates &&
                    Array.isArray(response.suggestions.templateRecommendation.alternativeTemplates) &&
                    response.suggestions.templateRecommendation.alternativeTemplates.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Alternative Templates:</p>
                        <div className="space-y-2">
                          {response.suggestions.templateRecommendation.alternativeTemplates.map((alt) => (
                            <div key={alt.id} className="flex items-start gap-2">
                              <span className="material-symbols-outlined text-purple-600 text-sm">arrow_right</span>
                              <div>
                                <p className="font-medium text-gray-900">{alt.name || getTemplateDisplayName(alt.id)}</p>
                                <p className="text-sm text-gray-600">{alt.reason || "Alternative option"}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Content Suggestions */}
              {response.suggestions.contentSuggestions && 
               Array.isArray(response.suggestions.contentSuggestions) &&
               response.suggestions.contentSuggestions.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">lightbulb</span>
                    Content Suggestions
                  </h3>
                  <div className="space-y-4">
                    {response.suggestions.contentSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="bg-white border-2 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                                suggestion.priority
                              )}`}
                            >
                              {suggestion.priority.toUpperCase()}
                            </span>
                            <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                          </div>
                          {(suggestion.type === "add_field" || 
                            suggestion.type === "add_social" || 
                            suggestion.type === "improve_content" ||
                            suggestion.type === "add_feature") && 
                           onApplySuggestion && (
                            <button
                              onClick={() => handleApplySuggestion(suggestion)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Apply
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{suggestion.description}</p>
                        {suggestion.example && (
                          <div className="bg-gray-50 rounded-lg p-3 mt-3">
                            <p className="text-xs text-gray-600 mb-1">Example:</p>
                            <p className="text-sm text-gray-900 font-mono">{suggestion.example}</p>
                          </div>
                        )}
                        {suggestion.current && suggestion.suggestion && (
                          <div className="mt-3 space-y-2">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Current:</p>
                              <p className="text-sm text-gray-700">{suggestion.current}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Suggested:</p>
                              <p className="text-sm text-gray-900 font-semibold">{suggestion.suggestion}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best Practices */}
              {response.suggestions.bestPractices && 
               Array.isArray(response.suggestions.bestPractices) &&
               response.suggestions.bestPractices.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600">star</span>
                    Best Practices
                  </h3>
                  <div className="space-y-3">
                    {response.suggestions.bestPractices.map((practice, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg ${
                          practice.applied
                            ? "bg-green-50 border border-green-200"
                            : "bg-amber-50 border border-amber-200"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined ${
                            practice.applied ? "text-green-600" : "text-amber-600"
                          }`}
                        >
                          {practice.applied ? "check_circle" : "info"}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-600">{practice.category}</span>
                            {practice.applied && (
                              <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs font-medium">
                                Applied
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900">{practice.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Powered by AI • {response?.metadata?.processingTime !== undefined
                ? `${Number(response.metadata.processingTime).toFixed(1)}s`
                : "Analyzing..."}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
