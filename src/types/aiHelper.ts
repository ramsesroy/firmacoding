// TypeScript types for AI Signature Helper

export interface AIHelperRequest {
  userData: {
    fullName: string;
    role: string;
    company?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    website?: string;
    address?: string;
    businessHours?: string;
    currentTemplate: string;
    hasPhoto: boolean;
    hasLogo: boolean;
    socialLinks: Array<{
      name: string;
      url: string;
    }>;
    additionalText?: string;
    ctaText?: string;
  };
  context: {
    userId: string;
    isPremium: boolean;
    signatureId?: string | null;
    language?: string;
  };
}

export interface TemplateRecommendation {
  templateId: string;
  templateName: string;
  confidence: number; // 0-1
  reason: string;
  matchScore: number; // 0-100
}

export interface MissingInformation {
  type: "social_media" | "contact" | "content" | "visual";
  priority: "high" | "medium" | "low";
  field: string;
  suggestion: string;
  icon: string;
  action: "add_social_link" | "add_field" | "add_cta" | "add_photo" | "add_logo";
}

export interface ContentImprovement {
  type: "role_optimization" | "social_media_optimization" | "text_optimization" | "design_optimization";
  priority: "high" | "medium" | "low";
  current: string;
  suggestion: string;
  reason: string;
}

export interface BestPractice {
  category: "professionalism" | "engagement" | "completeness" | "design";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface IndustryInsights {
  industry: string;
  recommendedTemplates: string[];
  commonPractices: string[];
  trends: string;
}

export interface ToneAnalysis {
  currentTone: string;
  recommendedTone: string;
  suggestions: string[];
}

export interface AISuggestions {
  templateRecommendations: TemplateRecommendation[];
  missingInformation: MissingInformation[];
  contentImprovements: ContentImprovement[];
  bestPractices: BestPractice[];
  industryInsights: IndustryInsights;
  toneAnalysis: ToneAnalysis;
}

export interface AIHelperResponse {
  success: boolean;
  suggestions?: AISuggestions;
  metadata?: {
    analysisTimestamp: string;
    model: string;
    processingTime: number;
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}
