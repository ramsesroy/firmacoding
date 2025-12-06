# AI Signature Helper - API Specification

## 📋 Overview

This document defines the exact data structure for the AI Signature Helper feature. The frontend will send signature data to an n8n webhook, and receive intelligent suggestions back.

---

## 1. 📥 JSON de Entrada (Request Body)

### Endpoint
`POST /api/ai-helper/suggestions` (Next.js API Route)  
→ Forwards to: `n8n Webhook URL`

### Request Body Structure

```json
{
  "userProfile": {
    "fullName": "John Doe",
    "role": "Marketing Director",
    "company": "TechCorp Inc",
    "email": "john.doe@techcorp.com",
    "phone": "+1-555-123-4567",
    "mobile": "+1-555-123-4568",
    "address": "123 Business St, New York, NY 10001",
    "website": "https://techcorp.com"
  },
  "currentSignature": {
    "templateId": "corporateConsultant",
    "fields": {
      "hasPhoto": true,
      "hasLogo": true,
      "hasPhone": true,
      "hasMobile": false,
      "hasEmail": true,
      "hasWebsite": true,
      "hasAddress": false,
      "hasSocialLinks": true,
      "hasBusinessHours": false,
      "hasQRCode": false,
      "hasCallToAction": false
    },
    "socialLinks": [
      {
        "name": "LinkedIn",
        "url": "https://linkedin.com/in/johndoe"
      },
      {
        "name": "Twitter",
        "url": "https://twitter.com/johndoe"
      }
    ],
    "additionalInfo": {
      "businessHours": null,
      "callToAction": null,
      "customMessage": null
    }
  },
  "context": {
    "userId": "2b27afc0-a24b-495a-89a0-8d42fd7fc42e",
    "isPremium": true,
    "language": "en"
  }
}
```

### Field Descriptions

#### `userProfile` (Required)
- `fullName` (string): Full name of the user
- `role` (string): Job title/position
- `company` (string, optional): Company name
- `email` (string, optional): Email address
- `phone` (string, optional): Phone number
- `mobile` (string, optional): Mobile phone number
- `address` (string, optional): Physical address
- `website` (string, optional): Company/personal website URL

#### `currentSignature` (Required)
- `templateId` (string): Current template being used (e.g., "corporateConsultant", "professional", etc.)
- `fields` (object): Boolean flags indicating what fields are currently filled
  - `hasPhoto` (boolean): Whether user has uploaded a profile photo
  - `hasLogo` (boolean): Whether user has uploaded a company logo
  - `hasPhone` (boolean): Whether phone number is provided
  - `hasMobile` (boolean): Whether mobile number is provided
  - `hasEmail` (boolean): Whether email is provided
  - `hasWebsite` (boolean): Whether website URL is provided
  - `hasAddress` (boolean): Whether address is provided
  - `hasSocialLinks` (boolean): Whether any social links are provided
  - `hasBusinessHours` (boolean): Whether business hours are specified
  - `hasQRCode` (boolean): Whether QR code is included
  - `hasCallToAction` (boolean): Whether CTA button/text is included
- `socialLinks` (array, optional): Array of current social links
  - Each object has:
    - `name` (string): Platform name (e.g., "LinkedIn", "Twitter", "Facebook")
    - `url` (string): Full URL to the profile
- `additionalInfo` (object, optional): Additional signature elements
  - `businessHours` (string | null): Business hours text
  - `callToAction` (string | null): CTA text/button
  - `customMessage` (string | null): Any custom message in signature

#### `context` (Required)
- `userId` (string): User's UUID from Supabase
- `isPremium` (boolean): Whether user has premium subscription
- `language` (string): Language code (e.g., "en", "es")

---

## 2. 📤 JSON de Salida Esperado (Response Body)

### Response Structure

```json
{
  "success": true,
  "suggestions": {
    "templateRecommendation": {
      "recommendedTemplate": "corporateConsultant",
      "confidence": 0.85,
      "reason": "Your role as Marketing Director and corporate setting suggest the Corporate Elite template would best showcase your professional authority.",
      "alternativeTemplates": [
        {
          "id": "growthMarketing",
          "name": "Growth Marketing",
          "reason": "Perfect for marketing professionals with CTA capabilities"
        },
        {
          "id": "professional",
          "name": "Professional",
          "reason": "Classic and versatile for corporate environments"
        }
      ]
    },
    "contentSuggestions": [
      {
        "type": "add_field",
        "priority": "high",
        "field": "businessHours",
        "title": "Add Business Hours",
        "description": "Including your business hours helps recipients know when you're available, improving communication efficiency.",
        "example": "Monday - Friday: 9:00 AM - 5:00 PM EST"
      },
      {
        "type": "add_social",
        "priority": "medium",
        "platform": "Instagram",
        "title": "Add Instagram Profile",
        "description": "Instagram is valuable for marketing professionals to showcase visual content and brand personality.",
        "reason": "Your role in marketing would benefit from Instagram's visual platform for brand storytelling."
      },
      {
        "type": "improve_content",
        "priority": "low",
        "field": "role",
        "title": "Enhance Your Title",
        "description": "Consider adding more context to your role, such as department or specialization.",
        "current": "Marketing Director",
        "suggestion": "Marketing Director | Digital Strategy & Brand Development"
      },
      {
        "type": "add_feature",
        "priority": "medium",
        "feature": "callToAction",
        "title": "Add Call-to-Action",
        "description": "A CTA button can drive engagement. Consider adding one for your latest campaign, webinar, or resource.",
        "example": "Download our Q1 Marketing Report"
      }
    ],
    "missingInfo": [
      {
        "field": "mobile",
        "importance": "medium",
        "reason": "Mobile number is often preferred for urgent business communications."
      },
      {
        "field": "address",
        "importance": "low",
        "reason": "Physical address adds credibility, especially for B2B communications."
      }
    ],
    "profileAnalysis": {
      "industry": "Technology/Software",
      "roleCategory": "Marketing & Communications",
      "seniority": "Senior/Executive",
      "recommendedTone": "Professional yet approachable",
      "targetAudience": "B2B clients, partners, and stakeholders"
    },
    "bestPractices": [
      {
        "category": "Professionalism",
        "tip": "Your signature looks professional. Consider adding a professional headshot if you haven't already.",
        "applied": false
      },
      {
        "category": "Engagement",
        "tip": "Social media links are great! Consider prioritizing LinkedIn for B2B networking.",
        "applied": true
      },
      {
        "category": "Completeness",
        "tip": "Adding business hours helps recipients know your availability without asking.",
        "applied": false
      }
    ]
  },
  "metadata": {
    "generatedAt": "2024-01-15T10:30:00Z",
    "model": "gemini-pro",
    "processingTime": 1.2
  }
}
```

### Response Field Descriptions

#### Root Level
- `success` (boolean): Whether the request was successful
- `suggestions` (object): All AI-generated suggestions
- `metadata` (object): Processing metadata

#### `suggestions.templateRecommendation` (Required)
- `recommendedTemplate` (string): Template ID that best matches the user's profile
- `confidence` (number): Confidence score 0-1 (0.85 = 85% confidence)
- `reason` (string): Explanation of why this template is recommended
- `alternativeTemplates` (array, optional): Other suitable templates
  - Each object:
    - `id` (string): Template ID
    - `name` (string): Human-readable template name
    - `reason` (string): Why this template is suitable

#### `suggestions.contentSuggestions` (Required, Array)
Array of actionable suggestions. Each suggestion has:

- `type` (string): One of:
  - `"add_field"` - Add a missing field
  - `"add_social"` - Add a social media platform
  - `"improve_content"` - Improve existing content
  - `"add_feature"` - Add a feature (QR, CTA, etc.)
  - `"remove_field"` - Remove unnecessary field
- `priority` (string): `"high"` | `"medium"` | `"low"`
- `title` (string): Short title for the suggestion
- `description` (string): Detailed explanation
- `field` (string, optional): Field name if applicable (e.g., "businessHours", "mobile")
- `platform` (string, optional): Social platform name if type is "add_social"
- `feature` (string, optional): Feature name if type is "add_feature"
- `current` (string, optional): Current value if type is "improve_content"
- `suggestion` (string, optional): Suggested improvement if type is "improve_content"
- `example` (string, optional): Example value or format

#### `suggestions.missingInfo` (Required, Array)
Fields that are missing but could be valuable:

- `field` (string): Field name (e.g., "mobile", "address", "website")
- `importance` (string): `"high"` | `"medium"` | `"low"`
- `reason` (string): Why this field would be valuable

#### `suggestions.profileAnalysis` (Required)
AI analysis of the user's profile:

- `industry` (string): Detected or inferred industry
- `roleCategory` (string): Category of role (e.g., "Marketing & Communications", "Engineering", "Sales")
- `seniority` (string): `"Entry"` | `"Mid"` | `"Senior/Executive"` | `"C-Level"`
- `recommendedTone` (string): Recommended tone for signature
- `targetAudience` (string): Inferred target audience

#### `suggestions.bestPractices` (Required, Array)
Best practice tips:

- `category` (string): Category of tip (e.g., "Professionalism", "Engagement", "Completeness")
- `tip` (string): The tip text
- `applied` (boolean): Whether this tip is already applied in current signature

#### `metadata` (Required)
- `generatedAt` (string): ISO 8601 timestamp
- `model` (string): AI model used (e.g., "gemini-pro")
- `processingTime` (number): Processing time in seconds

---

## 3. 🔄 Error Response

### Error Structure

```json
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "Unable to generate suggestions at this time",
    "details": "Gemini API rate limit exceeded"
  },
  "metadata": {
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Error Codes
- `AI_SERVICE_ERROR`: Error from AI service (Gemini/n8n)
- `INVALID_REQUEST`: Request body is malformed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVICE_UNAVAILABLE`: n8n webhook is down

---

## 4. 📝 TypeScript Interfaces

### Request Interface

```typescript
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
```

### Response Interface

```typescript
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
```

---

## 5. 🎯 Example Use Cases

### Example 1: Marketing Director (Complete Profile)

**Request:**
```json
{
  "userProfile": {
    "fullName": "Sarah Johnson",
    "role": "Marketing Director",
    "company": "TechCorp Inc",
    "email": "sarah@techcorp.com",
    "phone": "+1-555-123-4567",
    "website": "https://techcorp.com"
  },
  "currentSignature": {
    "templateId": "professional",
    "fields": {
      "hasPhoto": true,
      "hasLogo": true,
      "hasPhone": true,
      "hasMobile": false,
      "hasEmail": true,
      "hasWebsite": true,
      "hasAddress": false,
      "hasSocialLinks": true,
      "hasBusinessHours": false,
      "hasQRCode": false,
      "hasCallToAction": false
    },
    "socialLinks": [
      { "name": "LinkedIn", "url": "https://linkedin.com/in/sarahj" },
      { "name": "Twitter", "url": "https://twitter.com/sarahj" }
    ]
  },
  "context": {
    "userId": "abc-123",
    "isPremium": true,
    "language": "en"
  }
}
```

**Expected Response Highlights:**
- Template recommendation: `growthMarketing` (high confidence)
- Suggestion to add CTA button
- Suggestion to add Instagram
- Suggestion to add business hours

### Example 2: Developer (Minimal Profile)

**Request:**
```json
{
  "userProfile": {
    "fullName": "Alex Chen",
    "role": "Senior Software Engineer",
    "company": "StartupXYZ",
    "email": "alex@startupxyz.com"
  },
  "currentSignature": {
    "templateId": "developerMinimal2025",
    "fields": {
      "hasPhoto": false,
      "hasLogo": false,
      "hasPhone": false,
      "hasMobile": false,
      "hasEmail": true,
      "hasWebsite": false,
      "hasAddress": false,
      "hasSocialLinks": true,
      "hasBusinessHours": false,
      "hasQRCode": false,
      "hasCallToAction": false
    },
    "socialLinks": [
      { "name": "GitHub", "url": "https://github.com/alexchen" }
    ]
  },
  "context": {
    "userId": "def-456",
    "isPremium": true,
    "language": "en"
  }
}
```

**Expected Response Highlights:**
- Template recommendation: `developerMinimal2025` (already using it, high confidence)
- Suggestion to add LinkedIn
- Suggestion to add personal website/portfolio
- Low priority on business hours (not typical for developers)

---

## 6. 🔧 n8n Webhook Configuration

### Webhook Settings
- **Method:** POST
- **Path:** `/ai-signature-helper` (or your custom path)
- **Response Mode:** Respond to Webhook

### Expected Input (from Next.js API)
The webhook will receive the exact structure defined in Section 1.

### n8n Workflow Steps (Suggested)
1. **Webhook Node** - Receive request
2. **Set Node** - Extract and format data for Gemini
3. **HTTP Request Node** - Call Gemini API with prompt
4. **Function Node** - Parse Gemini response and format to match response structure
5. **Respond to Webhook Node** - Return formatted JSON

### Gemini Prompt Template (for n8n)

```
You are an expert email signature consultant. Analyze the following signature data and provide intelligent suggestions.

User Profile:
- Name: {{$json.userProfile.fullName}}
- Role: {{$json.userProfile.role}}
- Company: {{$json.userProfile.company}}
- Current Template: {{$json.currentSignature.templateId}}

Current Signature Fields:
{{$json.currentSignature.fields}}

Social Links Present:
{{$json.currentSignature.socialLinks}}

Provide suggestions in this exact JSON format:
{
  "templateRecommendation": {
    "recommendedTemplate": "template_id",
    "confidence": 0.0-1.0,
    "reason": "explanation",
    "alternativeTemplates": [...]
  },
  "contentSuggestions": [...],
  "missingInfo": [...],
  "profileAnalysis": {...},
  "bestPractices": [...]
}

Focus on:
1. Recommending the best template for their role/industry
2. Suggesting missing fields that would add value
3. Recommending social platforms relevant to their profession
4. Providing actionable improvements
```

---

## 7. ✅ Validation Rules

### Request Validation
- `userProfile.fullName` and `userProfile.role` are required
- `currentSignature.templateId` must be a valid template ID
- `context.userId` must be a valid UUID
- All boolean fields in `fields` must be present

### Response Validation
- `success` must be boolean
- If `success === true`, `suggestions` must be present
- If `success === false`, `error` must be present
- `suggestions.templateRecommendation.recommendedTemplate` must be a valid template ID
- All `contentSuggestions` must have `type`, `priority`, `title`, and `description`
- `metadata.generatedAt` must be valid ISO 8601 timestamp

---

## 8. 🚀 Next Steps

1. **Frontend:** Implement component to collect signature data and format request
2. **Next.js API Route:** Create `/api/ai-helper/suggestions/route.ts` to forward to n8n
3. **n8n Workflow:** Configure webhook and Gemini integration using this spec
4. **Testing:** Test with various user profiles to ensure response quality

---

**Esta especificación es la fuente de verdad para la implementación del AI Signature Helper.**
