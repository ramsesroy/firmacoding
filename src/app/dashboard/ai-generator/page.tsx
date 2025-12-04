"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/Toast";
import { useSubscription } from "@/hooks/useSubscription";
import { uploadImage } from "@/lib/imageUtils";
import { copyToClipboard } from "@/lib/signatureUtils";
import { TemplateType } from "@/types/signature";
import { canSaveSignature, incrementSavedSignatures } from "@/lib/subscriptionUtils";
import { analytics } from "@/lib/analytics";
import { Icon3D } from "@/components/Icon3D";
import { HiSparkles } from "react-icons/hi2";
import DOMPurify from "isomorphic-dompurify";

// Webhook URL - Replace with your actual n8n webhook URL
const AI_WEBHOOK_URL = process.env.NEXT_PUBLIC_AI_WEBHOOK_URL || "";

interface AISignatureResult {
  name: string;
  html: string;
}

const INSPIRATIONAL_QUOTES = [
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
  const { isPremium } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    image: "",
    logo: "",
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AISignatureResult[]>([]);
  const [currentQuote, setCurrentQuote] = useState(INSPIRATIONAL_QUOTES[0]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Rotate quotes during loading
  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentQuote(
          INSPIRATIONAL_QUOTES[
            Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)
          ]
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageURL = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: imageURL }));
      showToast("Image uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast(
        error instanceof Error ? error.message : "Error uploading image",
        "error"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const logoURL = await uploadImage(file);
      setFormData((prev) => ({ ...prev, logo: logoURL }));
      showToast("Logo uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading logo:", error);
      showToast(
        error instanceof Error ? error.message : "Error uploading logo",
        "error"
      );
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      showToast("Please fill in at least your name and email", "error");
      return;
    }

    if (!AI_WEBHOOK_URL) {
      showToast("AI Generator is not configured. Please contact support.", "error");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(AI_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          position: formData.position,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          image: formData.image,
          logo: formData.logo,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: AISignatureResult[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid response from AI generator");
      }

      setResults(data);
      analytics.aiSignatureGenerated(data.length);
      showToast("AI signatures generated successfully!", "success");
    } catch (error) {
      console.error("Error generating AI signatures:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Error generating signatures. Please try again.",
        "error"
      );
      analytics.aiSignatureError(error instanceof Error ? error.message : "unknown");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHTML = async (html: string, name: string) => {
    try {
      // Create a temporary element to extract text for clipboard
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const textContent = tempDiv.innerText || tempDiv.textContent || "";

      // Copy HTML to clipboard
      await navigator.clipboard.writeText(html);
      showToast(`${name} signature copied to clipboard!`, "success");
      analytics.copySignature();
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      showToast("Error copying signature", "error");
    }
  };

  const handleSaveSignature = async (html: string, name: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        showToast("Please sign in to save signatures", "info");
        router.push("/login");
        return;
      }

      // Check save limit
      const { canSave } = await canSaveSignature(session.user.id);
      if (!canSave) {
        showToast(
          "You've reached your signature limit. Upgrade to Premium for unlimited signatures!",
          "error"
        );
        router.push("/dashboard/subscription");
        return;
      }

      // Extract data from HTML to save
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      
      // Try to extract name and position from HTML
      const textContent = tempDiv.innerText || "";
      const lines = textContent.split("\n").filter((line) => line.trim());

      const signatureRecord: any = {
        user_id: session.user.id,
        name: formData.fullName || name,
        role: formData.position || "",
        phone: formData.phone || null,
        image_url: formData.image || null,
        social_links: null,
        template_id: "professional" as TemplateType,
      };

      const { error } = await supabase.from("signatures").insert([signatureRecord]);

      if (error) {
        throw error;
      }

      await incrementSavedSignatures(session.user.id);
      analytics.createSignature("ai-generated");
      showToast("Signature saved successfully!", "success");
      router.push("/dashboard/signatures");
    } catch (error) {
      console.error("Error saving signature:", error);
      showToast(
        error instanceof Error ? error.message : "Error saving signature",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="text-sm font-medium">Back to Editor</span>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Icon3D 
              icon={<HiSparkles />} 
              gradient="from-violet-500 via-purple-500 to-fuchsia-500"
              size="lg"
            />
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Create with AI
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-1">
                Let artificial intelligence design your perfect email signature
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900"
                  placeholder="John Doe"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Position / Job Title
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900"
                  placeholder="Senior Developer"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900"
                  placeholder="Tech Corp"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900"
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Website / LinkedIn
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Profile Photo
                </label>
                {formData.image ? (
                  <div className="relative">
                    <Image
                      src={formData.image}
                      alt="Profile preview"
                      width={200}
                      height={200}
                      className="w-32 h-32 object-cover rounded-xl shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full"
                    >
                      {uploadingImage ? (
                        <span className="text-sm text-gray-500">Uploading...</span>
                      ) : (
                        <span className="text-sm text-gray-600">Click to upload photo</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company Logo
                </label>
                {formData.logo ? (
                  <div className="relative">
                    <Image
                      src={formData.logo}
                      alt="Logo preview"
                      width={200}
                      height={100}
                      className="h-20 w-auto object-contain rounded-xl shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, logo: "" }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="w-full"
                    >
                      {uploadingLogo ? (
                        <span className="text-sm text-gray-500">Uploading...</span>
                      ) : (
                        <span className="text-sm text-gray-600">Click to upload logo</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-5 h-5" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Preview Canvas */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 sm:p-8">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HiSparkles className="w-8 h-8 text-purple-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {currentQuote}
                </p>
                <p className="text-sm text-gray-500">
                  Creating your perfect signature...
                </p>
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center text-gray-400">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-fuchsia-100 rounded-2xl flex items-center justify-center mb-6">
                  <HiSparkles className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-xl font-semibold text-gray-600 mb-2">
                  Complete the form
                </p>
                <p className="text-base text-gray-500">
                  Fill in your information and let AI design your perfect email signature
                </p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {result.name}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs font-bold rounded-full">
                        AI Generated
                      </span>
                    </div>

                    {/* Signature Preview */}
                    <div
                      className="mb-4 p-4 bg-white rounded-lg border border-gray-200 overflow-x-auto"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(result.html),
                      }}
                    />

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleCopyHTML(result.html, result.name)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">
                          content_copy
                        </span>
                        <span>Copy HTML</span>
                      </button>
                      <button
                        onClick={() => handleSaveSignature(result.html, result.name)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-fuchsia-700 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">
                          save
                        </span>
                        <span>Save Signature</span>
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
  );
}
