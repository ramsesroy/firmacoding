"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/Toast";
import { useSubscription } from "@/hooks/useSubscription";
import { MetadataHead } from "@/components/MetadataHead";
import { SkeletonCard } from "@/components/Skeleton";
import { analytics } from "@/lib/analytics";
import { canSaveSignature, incrementSavedSignatures } from "@/lib/subscriptionUtils";

// Webhook URL - Replace with your actual n8n webhook URL
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://your-webhook-url.n8n.cloud/webhook/ai-signature";

interface AISignatureResult {
  name: string;
  html: string;
}

const LOADING_QUOTES = [
  "Your next email could change everything.",
  "Great things never came from comfort zones.",
  "Be so good they can't ignore you.",
  "The best way to predict the future is to create it.",
  "Small daily improvements compound into massive results.",
  "Work hard in silence. Let success make the noise.",
  "Faith it till you make it.",
  "Your signature is your digital handshake — make it count.",
  "Done is better than perfect.",
  "Every expert was once a beginner.",
];

export default function AIGeneratorPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AISignatureResult[]>([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    image: null as File | null,
    imagePreview: "",
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  // Check if user has premium access
  if (!subscriptionLoading && !isPremium) {
    return (
      <div className="max-w-4xl mx-auto">
        <MetadataHead
          title="AI Generator - Signature For Me"
          description="Create professional email signatures with AI assistance"
        />
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
            <span className="material-symbols-outlined text-white text-4xl">lock</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Feature</h2>
          <p className="text-lg text-gray-600 mb-8">
            AI Enhancer is available for Premium subscribers. Upgrade to unlock this powerful feature.
          </p>
          <button
            onClick={() => router.push("/dashboard/subscription")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size must be less than 5MB", "error");
        return;
      }
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData({
      ...formData,
      image: null,
      imagePreview: "",
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.position || !formData.email) {
      showToast("Please fill in at least Name, Position, and Email", "error");
      return;
    }

    setIsGenerating(true);
    setResults([]);
    
    // Set random quote
    const randomQuote = LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)];
    setCurrentQuote(randomQuote);

    // Change quote every 3 seconds
    const quoteInterval = setInterval(() => {
      const newQuote = LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)];
      setCurrentQuote(newQuote);
    }, 3000);

    try {
      // Prepare form data
      const payload: any = {
        fullName: formData.fullName,
        position: formData.position,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || "",
      };

      // If image is uploaded, convert to base64
      if (formData.image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result as string;
          payload.image = base64Image;
          
          // Make API call
          await makeAPIRequest(payload);
        };
        reader.readAsDataURL(formData.image);
      } else {
        await makeAPIRequest(payload);
      }

      clearInterval(quoteInterval);
    } catch (error) {
      clearInterval(quoteInterval);
      console.error("Error generating AI signature:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to generate signature. Please try again.",
        "error"
      );
      setIsGenerating(false);
      analytics.trackError("AI Generator Error", error instanceof Error ? error.message : "Unknown error");
    }
  };

  const makeAPIRequest = async (payload: any) => {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle array response
    if (Array.isArray(data)) {
      setResults(data);
      analytics.aiSignatureGenerated(data.length);
    } else if (data.signatures && Array.isArray(data.signatures)) {
      setResults(data.signatures);
      analytics.aiSignatureGenerated(data.signatures.length);
    } else {
      throw new Error("Unexpected API response format");
    }

    setIsGenerating(false);
  };

  const handleCopyHTML = (html: string, name: string) => {
    navigator.clipboard.writeText(html);
    showToast(`${name} HTML copied to clipboard!`, "success");
    analytics.trackEvent("copy_signature", "ai", name);
  };

  const handleUseSignature = async (result: AISignatureResult) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        showToast("Please sign in to save signatures", "error");
        router.push("/login");
        return;
      }

      // Check save limit
      const limits = await canSaveSignature(session.user.id);
      if (!limits.canSave) {
        showToast(
          `You've reached your limit of ${limits.limit} saved signatures. Upgrade to Premium for unlimited saves!`,
          "error"
        );
        router.push("/dashboard/subscription");
        return;
      }

      // Extract signature data from HTML (basic extraction)
      // This is a simplified version - you might want to enhance this
      const signatureRecord: any = {
        user_id: session.user.id,
        name: formData.fullName,
        role: formData.position,
        phone: formData.phone || null,
        image_url: formData.imagePreview || null,
        template_id: "professional", // Default template ID
        html_content: result.html, // Store the HTML directly
      };

      const { error } = await supabase.from("signatures").insert([signatureRecord]);

      if (error) {
        throw error;
      }

      await incrementSavedSignatures(session.user.id);
      showToast(`${result.name} signature saved successfully!`, "success");
      analytics.createSignature("ai-generated");
      router.push("/dashboard/signatures");
    } catch (error) {
      console.error("Error saving signature:", error);
      showToast("Error saving signature. Please try again.", "error");
    }
  };

  return (
    <>
      <MetadataHead
        title="AI Signature Generator - Signature For Me"
        description="Create professional email signatures with AI assistance"
      />
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Signature Generator
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Let AI design your perfect professional signature
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Position / Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Marketing Director"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Acme Corporation"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Website / LinkedIn (Optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Profile Photo / Logo (Optional)
                </label>
                {!formData.imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF • Max 5MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Generating with AI...
                  </span>
                ) : (
                  "Generate with AI"
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Preview/Results */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Generated Designs</h2>
            
            <div className="min-h-[400px]">
              {/* Initial State */}
              {!isGenerating && results.length === 0 && (
                <div className="flex items-center justify-center h-full min-h-[400px] text-center">
                  <div className="max-w-md">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-purple-400">auto_awesome</span>
                    </div>
                    <p className="text-lg text-gray-600">
                      Complete the form to let AI design your perfect signature
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isGenerating && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <div className="w-20 h-20 mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-purple-600">auto_awesome</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI is crafting your signature...</h3>
                  {currentQuote && (
                    <p className="text-purple-600 italic max-w-md animate-pulse">
                      "{currentQuote}"
                    </p>
                  )}
                </div>
              )}

              {/* Results State */}
              {!isGenerating && results.length > 0 && (
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{result.name}</h3>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          AI Generated
                        </span>
                      </div>
                      
                      {/* Signature Preview */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                        <div
                          dangerouslySetInnerHTML={{ __html: result.html }}
                          className="signature-preview"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCopyHTML(result.html, result.name)}
                          className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                          Copy HTML
                        </button>
                        <button
                          onClick={() => handleUseSignature(result)}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">save</span>
                          Save Signature
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

