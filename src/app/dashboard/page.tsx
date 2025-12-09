"use client";

import React, { useState, useRef, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SignaturePreview from "@/components/SignaturePreview";
import IconPicker from "@/components/IconPicker";
import { TemplateType, RedSocial, SignatureProps } from "@/types/signature";
import { copyToClipboard } from "@/lib/signatureUtils";
import { uploadImage, getTempImages, getRemainingSessionUploads } from "@/lib/imageUtils";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/Toast";
import { MetadataHead } from "@/components/MetadataHead";
import { SkeletonForm, SkeletonSignaturePreview } from "@/components/Skeleton";
// Watermark component removed - free users can use all features without watermark
import { useSubscription } from "@/hooks/useSubscription";
import { canSaveSignature, incrementSavedSignatures, decrementSavedSignatures } from "@/lib/subscriptionUtils";
import { analytics } from "@/lib/analytics";
import { Icon3D } from "@/components/Icon3D";
import AiSuggestionsPanel from "@/components/AiSuggestionsPanel";
import { logger } from "@/lib/logger";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Force dynamic rendering for this page to support search params
export const dynamic = "force-dynamic";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const { isPremium, subscription, loading: subscriptionLoading } = useSubscription();
  const [saveLimit, setSaveLimit] = useState<{ canSave: boolean; remaining: number; limit: number } | null>(null);
  
  // Use ref to track previous authentication state to avoid stale closure
  const prevAuthenticatedRef = useRef<boolean | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const authenticated = !!session;
      setIsAuthenticated(authenticated);
      setUser(session?.user || null);
      prevAuthenticatedRef.current = authenticated;
      
      // Check save limits if authenticated
      if (session?.user) {
        const limits = await canSaveSignature(session.user.id);
        setSaveLimit(limits);
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const wasAuthenticated = prevAuthenticatedRef.current;
      const isNowAuthenticated = !!session;
      
      setIsAuthenticated(isNowAuthenticated);
      setUser(session?.user || null);
      prevAuthenticatedRef.current = isNowAuthenticated;
      
      // Migrate temp images when user logs in or registers
      if (session?.user && !wasAuthenticated && isNowAuthenticated) {
        try {
          const { migrateTempImages } = await import("@/lib/imageUtils");
          const migrated = await migrateTempImages(session.user.id);
          
          if (migrated.length > 0) {
            // Update image URLs in signature data if they were migrated
            setSignatureData((prev) => {
              let updated = { ...prev };
              
              // Update foto if it was migrated
              const fotoMigration = migrated.find((m) => m.oldUrl === prev.foto);
              if (fotoMigration) {
                updated.foto = fotoMigration.newUrl;
              }
              
              // Update logoEmpresa if it was migrated
              const logoMigration = migrated.find((m) => m.oldUrl === prev.logoEmpresa);
              if (logoMigration) {
                updated.logoEmpresa = logoMigration.newUrl;
              }
              
              return updated;
            });
            
            showToast(
              `Migrated ${migrated.length} image(s) to permanent storage!`,
              "success"
            );
          }
        } catch (error) {
          logger.error("Error migrating temp images", error instanceof Error ? error : new Error(String(error)), "Dashboard");
          // Don't show error to user - migration is not critical
        }
      }
      
      if (session?.user) {
        const limits = await canSaveSignature(session.user.id);
        setSaveLimit(limits);
      } else {
        setSaveLimit(null);
        // Update temp images count for unauthenticated users
        const tempImages = getTempImages();
        setTempImagesCount(tempImages.length);
        setRemainingSessionUploads(getRemainingSessionUploads(false));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update limits when subscription changes
  useEffect(() => {
    if (user?.id && !subscriptionLoading) {
      canSaveSignature(user.id).then(setSaveLimit);
    }
  }, [isPremium, user?.id, subscriptionLoading]);

  
  // Example image URLs categorized by template type - Optimized for each template's specific dimensions and style
  const getExamplePhoto = (template: TemplateType): string => {
    const photoMap: Record<string, string> = {
      // Classic: 80x80px square, professional business attire
      classic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // Modern: 100x100px square with blue border, modern professional
      modern: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=250&h=250&fit=crop&crop=faces&auto=format&q=90",
      
      // ModernaSinBarra: 70x70px, clean modern professional
      modernaSinBarra: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // QR Profesional: 80x80px, business professional
      qrProfesional: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // Developer Minimal: 80x80px rounded (12px), casual tech/dev style
      developerMinimal2025: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // Growth Marketing: 72x72px circular, professional business woman with purple accents
      growthMarketing: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // Freelance Designer: 70x70px rounded (14px), creative/artistic vibe
      freelanceDesigner: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // Creative Portfolio: 90x90px rounded square (8px), creative professional
      creativePortfolio: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&fit=crop&crop=faces&auto=format&q=90",
      
      // Interior Design: 80x80px circular, elegant professional woman
      interiorDesign: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // University Banner: 80x80px circular with blue banner background
      universityBanner: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // Law Student: 70x70px circular, young professional/student
      lawStudent: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // Pastor Signature: 80x80px circular, friendly approachable pastor
      pastorSignature: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
      
      // Default professional fallback
      default: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces&auto=format&q=90",
    };
    return photoMap[template] || photoMap.default;
  };

  const getExampleLogo = (template: TemplateType): string => {
    const logoMap: Record<string, string> = {
      // Professional: 120x40px horizontal corporate logo
      professional: "https://drive.google.com/uc?export=view&id=18DheVuw2txVP5XvbEd1hviaQrbZzwfeE",
      
      // Corporate Consultant: 140x45px horizontal business logo
      corporateConsultant: "https://drive.google.com/uc?export=view&id=18DheVuw2txVP5XvbEd1hviaQrbZzwfeE",
      
      // Interior Design: Needs a design/architecture style logo - horizontal format
      interiorDesign: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=120&fit=crop&auto=format&q=90",
      
      // University Professor: 60x60px square (1:1 ratio) - Academic shield logo
      universityProfessor: "https://drive.google.com/uc?export=view&id=1JSI2CV9cVZH97IztuiIqQ06cNd1TSwMk",
      
      // University President: 60x60px square (1:1 ratio) - Academic shield logo
      universityPresident: "https://drive.google.com/uc?export=view&id=1JSI2CV9cVZH97IztuiIqQ06cNd1TSwMk",
      
      // Church Professional: height 80px, width flexible - Church logo
      churchProfessional: "https://drive.google.com/uc?export=view&id=1dPx94TWUx0G7BEuUat9OGUKuJQJrgjAJ",
      
      // Pastor Signature: 80x80px square for circular crop (1:1 ratio) - Church logo
      pastorSignature: "https://drive.google.com/uc?export=view&id=1dPx94TWUx0G7BEuUat9OGUKuJQJrgjAJ",
      
      // Default corporate logo (horizontal)
      default: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=360&h=120&fit=crop&auto=format&q=90",
    };
    return logoMap[template] || logoMap.default;
  };

  const [signatureData, setSignatureData] = useState({
    nombre: "Alex Johnson",
    cargo: "Full Stack Developer",
    foto: "",
    telefono: "+1 (555) 123-4567",
    redes: [
      { nombre: "LinkedIn", url: "https://linkedin.com/in/alexjohnson", icono: "💼" },
      { nombre: "X (Twitter)", url: "https://twitter.com/alexjohnson", icono: "🐦" },
      { nombre: "GitHub", url: "https://github.com/alexjohnson", icono: "💻" },
    ] as RedSocial[],
    horario: "",
    textoAdicional: "",
    colorPersonalizado: "",
    qrLink: "",
    logoEmpresa: "", // Will be set based on template type
    ctaTexto: "",
    telefonoMovil: "",
    direccion: "",
    iconoTelefono: "📞",
    iconoTelefonoMovil: "📱",
    iconoDireccion: "📍",
  });

  // Update temp images count and session uploads when images are uploaded
  useEffect(() => {
    if (!isAuthenticated) {
      const tempImages = getTempImages();
      setTempImagesCount(tempImages.length);
      setRemainingSessionUploads(getRemainingSessionUploads(false));
    }
  }, [signatureData.foto, signatureData.logoEmpresa, isAuthenticated]);

  const [template, setTemplate] = useState<TemplateType>("professional");

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setAutosaveStatus('saving');
    
    const autosaveData = {
      signatureData,
      template,
      timestamp: Date.now(),
    };
    
    try {
      localStorage.setItem('dashboard_signature_autosave', JSON.stringify(autosaveData));
      setAutosaveStatus('saved');
      
      // Reset to idle after 2 seconds
      setTimeout(() => setAutosaveStatus('idle'), 2000);
    } catch (error) {
      logger.error('Error saving to localStorage', error instanceof Error ? error : new Error(String(error)), 'Dashboard Autosave');
      setAutosaveStatus('idle');
    }
  }, [signatureData, template]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (editingSignatureId) return; // Don't load autosave if editing existing signature
    
    try {
      const saved = localStorage.getItem('dashboard_signature_autosave');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only load if saved data is less than 24 hours old
        const age = Date.now() - (parsed.timestamp || 0);
        if (age < 24 * 60 * 60 * 1000) {
          setSignatureData(parsed.signatureData || signatureData);
          if (parsed.template) {
            setTemplate(parsed.template);
          }
        }
      }
    } catch (error) {
      logger.error('Error loading from localStorage', error instanceof Error ? error : new Error(String(error)), 'Dashboard Autosave');
    }
  }, []); // Only run on mount

  // Define free templates (first 6)
  const freeTemplates: TemplateType[] = [
    "professional",
    "classic",
    "modern",
    "modernaSinBarra",
    "qrProfesional",
    "developerMinimal2025"
  ];

  // Check if current template is premium
  const isPremiumTemplate = !freeTemplates.includes(template);

  const [nuevaRed, setNuevaRed] = useState({ nombre: "", url: "", icono: "" });
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingRed, setEditingRed] = useState<number | null>(null);
  const [editRedForm, setEditRedForm] = useState({ nombre: "", url: "", icono: "" });
  const [editingSignatureId, setEditingSignatureId] = useState<string | null>(null);
  const [loadingSignature, setLoadingSignature] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  
  // Preview states
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"foto" | "logo" | null>(null);
  
  // Session upload tracking
  const [tempImagesCount, setTempImagesCount] = useState(0);
  const [remainingSessionUploads, setRemainingSessionUploads] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // AI Suggestions Panel
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load signature for editing if edit query parameter exists
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      loadSignatureForEditing(editId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadSignatureForEditing = async (signatureId: string) => {
    try {
      setLoadingSignature(true);
      setEditingSignatureId(signatureId);

      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push("/login");
        return;
      }

      // Fetch signature from database
      const { data, error } = await supabase
        .from("signatures")
        .select("*")
        .eq("id", signatureId)
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Load signature data into the form
        setTemplate(data.template_id as TemplateType);
        setSignatureData({
          nombre: data.name,
          cargo: data.role,
          foto: data.image_url || "",
          telefono: data.phone || "",
          redes: (data.social_links as RedSocial[]) || [],
          horario: "",
          textoAdicional: "",
          colorPersonalizado: "",
          qrLink: "",
          logoEmpresa: "",
          ctaTexto: "",
          telefonoMovil: "",
          direccion: "",
          iconoTelefono: "📞",
          iconoTelefonoMovil: "📱",
          iconoDireccion: "📍",
        });

        // Remove edit parameter from URL
        router.replace("/dashboard", { scroll: false });
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error("Error loading signature", error, "Dashboard");
      showToast(error.message || "Error loading signature. Please try again.", "error");
      router.replace("/dashboard", { scroll: false });
    } finally {
      setLoadingSignature(false);
    }
  };

  // Add example images based on template when it changes
  useEffect(() => {
    // Skip if we're loading a signature for editing
    if (loadingSignature || editingSignatureId) return;

    // Templates that use photo
    const templatesWithPhoto = ["classic", "modern", "modernaSinBarra", "qrProfesional", "developerMinimal2025", "growthMarketing", "freelanceDesigner", "interiorDesign", "universityBanner", "creativePortfolio", "pastorSignature", "lawStudent"];
    // Templates that use logo
    const templatesWithLogo = ["professional", "corporateConsultant", "interiorDesign", "universityProfessor", "churchProfessional", "universityPresident", "pastorSignature"];
    
    setSignatureData((prev) => {
      const updates: Partial<SignatureProps> = {};
      
      // Add example photo if template requires it and no photo exists
      if (templatesWithPhoto.includes(template) && !prev.foto) {
        updates.foto = getExamplePhoto(template);
      }
      
      // Add example logo if template requires it and no logo exists
      if (templatesWithLogo.includes(template) && !prev.logoEmpresa) {
        updates.logoEmpresa = getExampleLogo(template);
      }
      
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [template, loadingSignature, editingSignatureId]);

  const handleDownloadPNG = async () => {
    if (!previewRef.current) return;
    const element = previewRef.current;
    try {
      // Type cast includes scale option which is valid but not in TypeScript types
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: null,
        logging: false,
      } as Parameters<typeof html2canvas>[1] & { scale?: number });
      
      // Get the actual content bounds by finding non-transparent pixels
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      
      // Find bounding box of non-transparent pixels
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      
      // Add small padding (10px scaled)
      const padding = 20;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);
      
      const width = maxX - minX;
      const height = maxY - minY;
      
      // Create new canvas with cropped content
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) throw new Error('Could not get cropped canvas context');
      
      croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
      
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = croppedCanvas.toDataURL('image/png');
      link.click();
      showToast('PNG downloaded successfully!', 'success');
    } catch (error) {
      logger.error('Error generating PNG', error instanceof Error ? error : new Error(String(error)), 'Dashboard Export');
      showToast('Could not generate PNG. Please try again.', 'error');
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const element = previewRef.current;
    try {
      // Type cast includes scale option which is valid but not in TypeScript types
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: null, 
        logging: false,
      } as Parameters<typeof html2canvas>[1] & { scale?: number });
      
      // Get the actual content bounds by finding non-transparent pixels
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      
      // Find bounding box of non-transparent pixels
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      
      // Add small padding (10px scaled)
      const padding = 20;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);
      
      const width = maxX - minX;
      const height = maxY - minY;
      
      // Create new canvas with cropped content
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) throw new Error('Could not get cropped canvas context');
      
      croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
      
      const imgData = croppedCanvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width, height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('signature.pdf');
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      logger.error('Error generating PDF', error instanceof Error ? error : new Error(String(error)), 'Dashboard Export');
      showToast('Could not generate PDF. Please try again.', 'error');
    }
  };

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(
      signatureData,
      template,
      signatureData.nombre || "User",
      {
        userId: user?.id,
        signatureId: editingSignatureId || undefined,
        enableLinkTracking: isPremium || false,
      }
    );
    if (success) {
      setCopied(true);
      showToast("Signature copied to clipboard!", "success");
      analytics.copySignature();
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Error copying to clipboard. Please try again.", "error");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview before uploading
    const url = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(url);
    setPreviewType("foto");
    setShowPreview(true);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmUpload = async () => {
    if (!previewFile || !previewType) return;

    setShowPreview(false);
    setUploading(previewType === "foto");
    setUploadingLogo(previewType === "logo");

    try {
      const imageURL = await uploadImage(previewFile);
      
      if (previewType === "foto") {
        setSignatureData({ ...signatureData, foto: imageURL });
        showToast("Image uploaded successfully!", "success");
      } else {
        setSignatureData({ ...signatureData, logoEmpresa: imageURL });
        showToast("Logo uploaded successfully!", "success");
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Error uploading image", "error");
    } finally {
      setUploading(false);
      setUploadingLogo(false);
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewFile(null);
      setPreviewUrl(null);
      setPreviewType(null);
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl(null);
    setPreviewType(null);
  };

  const handleRemoveImage = () => {
    setSignatureData({ ...signatureData, foto: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview before uploading
    const url = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(url);
    setPreviewType("logo");
    setShowPreview(true);
    
    // Reset input
    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setSignatureData({ ...signatureData, logoEmpresa: "" });
    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = "";
    }
  };

  const handleEditRed = (index: number) => {
    const red = signatureData.redes[index];
    setEditingRed(index);
    setEditRedForm({ nombre: red.nombre, url: red.url, icono: red.icono || "" });
  };

  const handleSaveEditRed = () => {
    if (editingRed !== null && editRedForm.nombre && editRedForm.url) {
      const nuevasRedes = [...signatureData.redes];
      nuevasRedes[editingRed] = { ...editRedForm, icono: editRedForm.icono || undefined } as RedSocial;
      setSignatureData({ ...signatureData, redes: nuevasRedes });
      setEditingRed(null);
      setEditRedForm({ nombre: "", url: "", icono: "" });
    }
  };

  const handleCancelEditRed = () => {
    setEditingRed(null);
    setEditRedForm({ nombre: "", url: "", icono: "" });
  };


  const handleSave = async () => {
    // Validate that required fields are completed
    if (!signatureData.nombre || !signatureData.cargo) {
      setSaveMessage({
        type: "error",
        text: "Please complete at least the name and title",
      });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      // Get authenticated user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Authentication error: ${sessionError.message}`);
      }

      if (!session?.user) {
        throw new Error("You are not authenticated. Please log in again.");
      }

      // Prepare data for insertion/update
      // Ensure properties match exactly with the database structure
      const signatureRecord: {
        name: string;
        role: string;
        phone: string | null;
        image_url: string | null;
        social_links: RedSocial[] | null;
        template_id: TemplateType;
      } = {
        name: signatureData.nombre,
        role: signatureData.cargo,
        phone: signatureData.telefono || null,
        image_url: signatureData.foto || null,
        social_links: signatureData.redes.length > 0 ? signatureData.redes : null,
        template_id: template,
      };

      let data, error;

      // Update existing signature or insert new one
      if (editingSignatureId) {
        // Update existing signature
        const { data: updateData, error: updateError } = await supabase
          .from("signatures")
          .update(signatureRecord)
          .eq("id", editingSignatureId)
          .eq("user_id", session.user.id)
          .select()
          .single();
        
        data = updateData;
        error = updateError;
      } else {
        // Check save limit before inserting new signature
        const { canSave, remaining, limit } = await canSaveSignature(session.user.id);
        
        if (!canSave) {
          throw new Error(
            `You've reached your limit of ${limit} saved signatures. ${
              remaining === 0 
                ? "Upgrade to Premium to save unlimited signatures!" 
                : `You can save ${remaining} more signature${remaining > 1 ? 's' : ''}.`
            }`
          );
        }

        // Insert new signature
        const signatureToInsert = {
          ...signatureRecord,
          user_id: session.user.id, // Associate signature with authenticated user
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from("signatures")
          .insert([signatureToInsert])
          .select()
          .single();
        
        data = insertData;
        error = insertError;

          // Increment saved signatures counter if inserted successfully
        if (!error && insertData) {
          await incrementSavedSignatures(session.user.id);
          // Update limits
          const updatedLimits = await canSaveSignature(session.user.id);
          setSaveLimit(updatedLimits);
        }
      }

      if (error) {
        // Show a more descriptive message based on error type
        let errorMessage = error.message;
        
        if (error.code === "23505") {
          errorMessage = "A signature with this data already exists. Please modify some fields.";
        } else if (error.code === "42501") {
          errorMessage = "You don't have permission to perform this action. Verify your authentication.";
        } else if (error.code === "42P01") {
          errorMessage = "The 'signatures' table does not exist in the database. Please create the table first.";
        } else if (error.message.includes("permission denied") || error.message.includes("RLS")) {
          errorMessage = "Permission error. Verify security policies (RLS) in Supabase.";
        }
        
        throw new Error(errorMessage);
      }

      setSaveMessage({
        type: "success",
        text: editingSignatureId 
          ? "Signature updated successfully!" 
          : "Signature saved successfully!",
      });
      
      // If we were editing, update the editing ID to the saved signature's ID
      if (!editingSignatureId && data?.id) {
        setEditingSignatureId(data.id);
      }
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Error saving signature", err, "Dashboard");
      
      setSaveMessage({
        type: "error",
        text: err.message || "Error saving signature. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loadingSignature) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-6 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 sm:p-8">
              <SkeletonForm />
            </div>
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 sm:p-8">
              <SkeletonSignaturePreview />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetadataHead
        title="Dashboard - Signature For Me"
        description="Create and customize your professional email signature with our intuitive editor."
        keywords={["dashboard", "signature editor", "create signature"]}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {editingSignatureId ? "Edit Signature" : "Signature Editor"}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mt-2">
              {editingSignatureId 
                ? "Update your signature details and save changes"
                : "Create and customize your professional email signature in minutes"}
            </p>
          </div>
          
        </div>

        {/* Layout: Flex column on mobile, grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:h-[calc(100vh-200px)]">
          {/* Form - Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-900/5 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-4">
                <span className="material-symbols-outlined text-base text-blue-600">tune</span>
                <span className="text-sm font-semibold text-blue-900">Editor</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Signature Details
              </h2>
              <p className="text-sm text-gray-500">
                Fill in your information to generate a professional signature
              </p>
            </div>

            <div className="space-y-8">
              {/* Template Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Choose Template
                  </label>
                  <div className="flex items-center gap-2">
                    {template === "professional" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 border border-amber-200 rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-amber-900">Popular</span>
                      </span>
                    )}
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-md">
                        <span className="material-symbols-outlined text-xs">stars</span>
                        <span className="text-xs font-bold">Premium</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { id: "professional", name: "Professional", badge: "Most Popular", icon: "palette", color: "from-purple-500 to-indigo-600", isPremium: false },
                    { id: "classic", name: "Classic", icon: "description", color: "from-gray-500 to-gray-700", isPremium: false },
                    { id: "modern", name: "Modern", icon: "auto_awesome", color: "from-pink-500 to-rose-600", isPremium: false },
                    { id: "modernaSinBarra", name: "Modern Clean", icon: "diamond", color: "from-cyan-500 to-blue-600", isPremium: false },
                    { id: "qrProfesional", name: "QR Professional", icon: "qr_code_scanner", color: "from-green-500 to-emerald-600", isPremium: false },
                    { id: "developerMinimal2025", name: "Developer Pro", icon: "code", color: "from-slate-700 to-gray-900", badge: "Premium", isPremium: false },
                    { id: "ultraMinimal", name: "Ultra Minimal", icon: "minimize", color: "from-gray-600 to-gray-800", badge: "Premium", isPremium: true },
                    { id: "growthMarketing", name: "Growth Marketing", icon: "trending_up", color: "from-purple-500 to-pink-600", badge: "Premium", isPremium: true },
                    { id: "freelanceDesigner", name: "Freelance Designer", icon: "brush", color: "from-orange-500 to-red-600", badge: "Premium", isPremium: true },
                    { id: "corporateConsultant", name: "Corporate Elite", icon: "business", color: "from-blue-600 to-indigo-700", badge: "Premium", isPremium: true },
                    { id: "interiorDesign", name: "Interior Design", icon: "home", color: "from-amber-600 to-orange-700", badge: "New", isPremium: true },
                    { id: "universityProfessor", name: "University Professor", icon: "school", color: "from-blue-500 to-blue-700", badge: "New", isPremium: true },
                    { id: "universityBanner", name: "University Banner", icon: "account_balance", color: "from-blue-400 to-blue-600", badge: "New", isPremium: true },
                    { id: "creativePortfolio", name: "Creative Portfolio", icon: "palette", color: "from-pink-500 to-purple-600", badge: "New", isPremium: true },
                    { id: "militaryProfessional", name: "Military Professional", icon: "military_tech", color: "from-green-700 to-green-900", badge: "New", isPremium: true },
                    { id: "churchProfessional", name: "Church Coordinator", icon: "church", color: "from-teal-500 to-cyan-600", badge: "New", isPremium: true },
                    { id: "universityPresident", name: "University President", icon: "school", color: "from-amber-700 to-orange-800", badge: "New", isPremium: true },
                    { id: "pastorSignature", name: "Pastor Signature", icon: "volunteer_activism", color: "from-teal-400 to-cyan-500", badge: "New", isPremium: true },
                    { id: "lawStudent", name: "Law Student", icon: "gavel", color: "from-emerald-600 to-green-700", badge: "New", isPremium: true },
                    { id: "greenExecutive", name: "Green Executive", icon: "eco", color: "from-green-600 to-emerald-700", badge: "New", isPremium: true },
                  ]
                  .filter((tpl) => {
                    // Show all templates if authenticated, only free templates if not
                    if (isAuthenticated === null) return true; // Show all while checking
                    return isAuthenticated || !tpl.isPremium;
                  })
                  .map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      aria-label={`Select ${tpl.name} template`}
                      aria-pressed={template === tpl.id}
                      onClick={() => {
                        // Check if template is premium and user is not authenticated
                        if (tpl.isPremium && !isAuthenticated) {
                          showToast("Please sign up or log in to access premium templates!", "info");
                          router.push("/login");
                          return;
                        }

                        const newTemplate = tpl.id as TemplateType;
                        setTemplate(newTemplate);
                        analytics.viewTemplate(newTemplate);
                        
                        // Add example photo if template uses photo and no photo exists
                        const templatesWithPhoto = ["classic", "modern", "modernaSinBarra", "qrProfesional", "developerMinimal2025", "growthMarketing", "freelanceDesigner", "interiorDesign", "universityBanner", "creativePortfolio", "pastorSignature", "lawStudent"];
                        if (templatesWithPhoto.includes(newTemplate) && !signatureData.foto) {
                          setSignatureData({ ...signatureData, foto: getExamplePhoto(newTemplate) });
                        }
                        
                        // Add example logo if template uses logo and no logo exists
                        const templatesWithLogo = ["professional", "corporateConsultant", "interiorDesign", "universityProfessor", "churchProfessional", "universityPresident", "pastorSignature"];
                        if (templatesWithLogo.includes(newTemplate) && !signatureData.logoEmpresa) {
                          setSignatureData({ ...signatureData, logoEmpresa: getExampleLogo(newTemplate) });
                        }
                      }}
                      className={`group relative px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                        template === tpl.id
                          ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl shadow-blue-500/40 ring-2 ring-blue-400 ring-offset-2 ring-offset-white transform scale-[1.02]"
                          : "bg-white text-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 active:scale-95"
                      }`}
                      style={template === tpl.id ? {
                        boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)'
                      } : {}}
                    >
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        {template === tpl.id ? (
                          <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${tpl.color} flex items-center justify-center shadow-2xl shadow-black/20 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                            style={{
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                            }}
                          >
                            <span 
                              className="material-symbols-outlined text-2xl text-white drop-shadow-lg" 
                              style={{ 
                                fontVariationSettings: '"FILL" 1, "wght" 600, "GRAD" 200, "opsz" 48',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                                textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                              }}
                            >
                              {tpl.icon}
                            </span>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                          </div>
                        ) : (
                          <div 
                            className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center shadow-lg border-2 border-gray-200/50 group-hover:shadow-xl group-hover:scale-125 group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-300 ease-out"
                            style={{
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                            }}
                          >
                            <span 
                              className="material-symbols-outlined text-2xl text-gray-700" 
                              style={{ 
                                fontVariationSettings: '"FILL" 1, "wght" 500, "GRAD" 200, "opsz" 48',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                              }}
                            >
                              {tpl.icon}
                            </span>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/50 to-transparent pointer-events-none"></div>
                          </div>
                        )}
                        <span className="text-xs">{tpl.name}</span>
                        {tpl.badge && template === tpl.id && (
                          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-amber-400 text-gray-900 text-[9px] font-bold rounded-full shadow-md animate-bounce">
                            {tpl.badge.split(" ")[0]}
                          </span>
                        )}
                      </div>
                      {template === tpl.id && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Upgrade Banner - Only show for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="mt-6 relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '30px 30px',
                      }}></div>
                    </div>

                    <div className="relative p-4 sm:p-5">
                      <div className="flex flex-col gap-4">
                        {/* Header with Icon and Badge */}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}>
                              stars
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                                <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                                Premium
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                              Save & Manage Your Signatures
                            </h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm leading-relaxed">
                          You can create and copy signatures for free! 
                          <span className="font-semibold text-blue-700"> Sign up for free</span> to save and manage unlimited signatures.
                        </p>

                        {/* Temporary Images Notice */}
                        {(tempImagesCount > 0 || remainingSessionUploads !== null) && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <span className="material-symbols-outlined text-amber-600 text-lg flex-shrink-0 mt-0.5">info</span>
                              <div className="flex-1">
                                <p className="text-xs text-amber-800 font-medium mb-1">
                                  Temporary Images Notice
                                </p>
                                <p className="text-xs text-amber-700 leading-relaxed mb-2">
                                  Images uploaded without an account will be automatically deleted after 24 hours. 
                                  <span className="font-semibold"> Sign up</span> to keep your images permanently and access all features.
                                </p>
                                {tempImagesCount > 0 && (
                                  <p className="text-xs text-amber-700">
                                    <span className="font-semibold">{tempImagesCount}</span> temporary image{tempImagesCount !== 1 ? 's' : ''} will be deleted in 24 hours.
                                  </p>
                                )}
                                {remainingSessionUploads !== null && remainingSessionUploads < 10 && (
                                  <p className="text-xs text-amber-700 mt-1">
                                    <span className="font-semibold">{remainingSessionUploads}</span> upload{remainingSessionUploads !== 1 ? 's' : ''} remaining this session.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Features list - Compact */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                              "Save Unlimited Signatures",
                              "Access from Anywhere",
                              "Edit Anytime",
                              "14+ Premium Templates"
                            ].map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700">
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium truncate">{feature}</span>
                              </div>
                            ))}
                        </div>

                        {/* CTA Button - Full width on mobile */}
                        <div className="pt-2">
                          <Link
                            href="/login"
                            className="group/btn inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span className="material-symbols-outlined text-lg">rocket_launch</span>
                            <span>Sign Up Free - No Credit Card</span>
                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Decorative corner accent - Smaller */}
                    <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-bl-full"></div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-medium">Basic Information</span>
                </div>
              </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-gray-400">person</span>
                Full Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre-input"
                aria-label="Full Name"
                aria-required="true"
                value={signatureData.nombre}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, nombre: e.target.value })
                }
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                placeholder="John Doe"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-gray-400">work</span>
                Job Title
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cargo-input"
                aria-label="Job Title"
                aria-required="true"
                value={signatureData.cargo}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, cargo: e.target.value })
                }
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                placeholder="Senior Software Engineer"
              />
            </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-medium">Media</span>
                </div>
              </div>

            {/* Photo - File Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-gray-400">image</span>
                Profile Photo
              </label>
              {!signatureData.foto ? (
                <div className="group border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-50/50 transition-all duration-300 cursor-pointer bg-gray-50/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/0 transition-all duration-300"></div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="foto-input"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="foto-input"
                    className="cursor-pointer block relative z-10"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-2xl text-blue-600">cloud_upload</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                        {uploading ? (
                          <span className="flex items-center gap-2">
                            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></span>
                            Uploading...
                          </span>
                        ) : (
                          "Click to upload photo"
                        )}
                      </span>
                      <p className="text-xs text-gray-500 mt-1.5">
                        JPG, PNG or GIF • Max 5MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative group">
                  <div className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-gray-50/50 hover:border-blue-300 transition-all duration-200">
                    <div className="relative">
                      <Image
                        src={signatureData.foto}
                        alt="Profile photo preview"
                        width={300}
                        height={176}
                        className="max-w-full h-44 object-contain mx-auto rounded-xl shadow-md"
                        loading="lazy"
                        quality={85}
                        unoptimized={signatureData.foto.startsWith("data:") || signatureData.foto.includes("drive.google.com")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label="Remove profile photo"
                      className="mt-4 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-semibold border-2 border-red-200 hover:border-red-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      Remove Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Company Logo (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">apartment</span>
                  Company Logo
                </label>
                {!signatureData.logoEmpresa ? (
                  <div className="space-y-3">
                    <div className="group border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-50/50 transition-all duration-300 cursor-pointer bg-gray-50/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/0 transition-all duration-300"></div>
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-input"
                        disabled={uploadingLogo}
                      />
                      <label
                        htmlFor="logo-input"
                        className="cursor-pointer block relative z-10"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-xl text-purple-600">image</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                            {uploadingLogo ? (
                              <span className="flex items-center gap-2">
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></span>
                                Uploading...
                              </span>
                            ) : (
                              "Click to upload logo"
                            )}
                          </span>
                          <p className="text-xs text-gray-500 mt-1.5">
                            JPG, PNG or GIF • Max 5MB
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">O</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={signatureData.logoEmpresa || ""}
                      onChange={(e) =>
                        setSignatureData({ ...signatureData, logoEmpresa: e.target.value })
                      }
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                      placeholder="Logo URL (https://example.com/logo.png)"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-gray-50/50 hover:border-blue-300 transition-all duration-200 group">
                      <div className="relative">
                        <Image
                          src={signatureData.logoEmpresa}
                          alt="Company logo preview"
                          width={400}
                          height={128}
                          className="max-w-full h-32 object-contain mx-auto rounded-xl shadow-md"
                          loading="lazy"
                          unoptimized={signatureData.logoEmpresa.startsWith("data:") || signatureData.logoEmpresa.includes("drive.google.com")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <button
                        onClick={handleRemoveLogo}
                        className="mt-4 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-semibold border-2 border-red-200 hover:border-red-300 flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                        Remove Logo
                      </button>
                    </div>
                    <input
                      type="text"
                      value={signatureData.logoEmpresa || ""}
                      onChange={(e) =>
                        setSignatureData({ ...signatureData, logoEmpresa: e.target.value })
                      }
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                      placeholder="Logo URL (https://example.com/logo.png)"
                    />
                  </div>
                )}
              </div>
            )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-medium">Contact Information</span>
                </div>
              </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-gray-400">phone</span>
                Phone Number
              </label>
              <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                <input
                  type="text"
                  value={signatureData.telefono}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, telefono: e.target.value })
                  }
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="+1 (555) 123-4567"
                />
                <IconPicker
                  selectedIcon={signatureData.iconoTelefono}
                  onSelectIcon={(icon) =>
                    setSignatureData({ ...signatureData, iconoTelefono: icon })
                  }
                  label="Icon"
                />
              </div>
            </div>

            {/* Mobile Phone (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">smartphone</span>
                  Mobile Phone
                </label>
                <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                  <input
                    type="text"
                    value={signatureData.telefonoMovil}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, telefonoMovil: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                    placeholder="+1 (555) 987-6543"
                  />
                  <IconPicker
                    selectedIcon={signatureData.iconoTelefonoMovil}
                    onSelectIcon={(icon) =>
                      setSignatureData({ ...signatureData, iconoTelefonoMovil: icon })
                    }
                    label="Icono"
                  />
                </div>
              </div>
            )}

            {/* Address (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">location_on</span>
                  Address
                </label>
                <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                  <input
                    type="text"
                    value={signatureData.direccion}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, direccion: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                    placeholder="123 Main Street, City"
                  />
                  <IconPicker
                    selectedIcon={signatureData.iconoDireccion}
                    onSelectIcon={(icon) =>
                      setSignatureData({ ...signatureData, iconoDireccion: icon })
                    }
                    label="Icono"
                  />
                </div>
              </div>
            )}

            {/* Schedule (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">schedule</span>
                  Schedule
                </label>
                <input
                  type="text"
                  value={signatureData.horario}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, horario: e.target.value })
                  }
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                />
              </div>
            )}

            {/* Additional Text (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">text_fields</span>
                  Additional Text
                </label>
                <textarea
                  value={signatureData.textoAdicional}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, textoAdicional: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300 resize-none"
                  placeholder="Any additional relevant information"
                ></textarea>
              </div>
            )}

            {/* Custom Color (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">palette</span>
                  Primary Color
                </label>
                <input
                  type="color"
                  value={signatureData.colorPersonalizado || "#1D4ED8"} // Default blue-700
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, colorPersonalizado: e.target.value })
                  }
                  className="w-full h-14 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors shadow-sm"
                  title="Choose a color"
                />
              </div>
            )}

            {/* QR Link (Professional) */}
            {template === "qrProfesional" && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">qr_code</span>
                  QR Code Link
                </label>
                <input
                  type="text"
                  value={signatureData.qrLink}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, qrLink: e.target.value })
                  }
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="https://your-site.com"
                />
                <p className="mt-2 text-xs text-gray-500">
                  This link will be used to generate the QR code in your signature.
                </p>
              </div>
            )}

            {/* Call to Action (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">campaign</span>
                  Call to Action (CTA) Text
                </label>
                <input
                  type="text"
                  value={signatureData.ctaTexto}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, ctaTexto: e.target.value })
                  }
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                  placeholder="Visit my website"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Short text for a button or highlighted link.
                </p>
              </div>
            )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-medium">Social Links</span>
                </div>
              </div>

            {/* Social Media Links */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="material-symbols-outlined text-xl text-white">share</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Social Media</h3>
                  <p className="text-xs text-gray-500">Add your social profiles</p>
                </div>
              </div>
              <div className="space-y-4">
                {signatureData.redes.map((red, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-50/50 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                  >
                    {editingRed === index ? (
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editRedForm.nombre}
                            onChange={(e) =>
                              setEditRedForm({ ...editRedForm, nombre: e.target.value })
                            }
                            className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300 text-sm"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={editRedForm.url}
                            onChange={(e) =>
                              setEditRedForm({ ...editRedForm, url: e.target.value })
                            }
                            className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300 text-sm"
                            placeholder="URL"
                          />
                        </div>
                        <IconPicker
                          selectedIcon={editRedForm.icono}
                          onSelectIcon={(icon) =>
                            setEditRedForm({ ...editRedForm, icono: icon })
                          }
                          label="Icon"
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={handleSaveEditRed}
                            aria-label="Save social media link"
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditRed}
                            aria-label="Cancel editing social media link"
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-semibold border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {red.icono && (
                            <span className="text-lg flex-shrink-0">{red.icono}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {red.nombre}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{red.url}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex gap-1">
                          <button
                            onClick={() => handleEditRed(index)}
                            className="px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition text-sm font-medium"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => {
                              const nuevasRedes = signatureData.redes.filter(
                                (_, i) => i !== index
                              );
                              setSignatureData({ ...signatureData, redes: nuevasRedes });
                            }}
                            className="px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition text-sm font-medium"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={nuevaRed.nombre}
                    onChange={(e) =>
                      setNuevaRed({ ...nuevaRed, nombre: e.target.value })
                    }
                    className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                    placeholder="Name (e.g., LinkedIn)"
                  />
                  <input
                    type="text"
                    value={nuevaRed.url}
                    onChange={(e) =>
                      setNuevaRed({ ...nuevaRed, url: e.target.value })
                    }
                    className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-300"
                    placeholder="URL"
                  />
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <IconPicker
                      selectedIcon={nuevaRed.icono}
                      onSelectIcon={(icon) =>
                        setNuevaRed({ ...nuevaRed, icono: icon })
                      }
                      label="Icon (optional)"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Add social media link"
                    onClick={() => {
                      if (nuevaRed.nombre && nuevaRed.url) {
                        setSignatureData({
                          ...signatureData,
                          redes: [...signatureData.redes, { ...nuevaRed, icono: nuevaRed.icono || undefined } as RedSocial],
                        });
                        setNuevaRed({ nombre: "", url: "", icono: "" });
                      }
                    }}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md shadow-blue-500/20 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Preview - Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-900/5 p-6 sm:p-8 overflow-y-auto flex flex-col custom-scrollbar">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                  <span className="material-symbols-outlined text-base text-green-600">visibility</span>
                  <span className="text-sm font-semibold text-green-900">Live Preview</span>
                </div>
                {autosaveStatus !== 'idle' && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    autosaveStatus === 'saving' 
                      ? 'bg-blue-50 border border-blue-100 text-blue-700' 
                      : 'bg-green-50 border border-green-100 text-green-700'
                  }`}>
                    {autosaveStatus === 'saving' ? (
                      <>
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        <span>Saved</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Real-time Preview
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Changes update instantly as you type
                </p>
              </div>
            </div>

            {/* Main Preview */}
            <div 
              className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-4 sm:p-6 md:p-10 border-2 border-gray-100 mb-6 shadow-inner overflow-auto" 
              style={{
                backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(0,0,0,.02) 25%, rgba(0,0,0,.02) 50%, transparent 50%, transparent 75%, rgba(0,0,0,.02) 75%, rgba(0,0,0,.02)), linear-gradient(45deg, transparent 25%, rgba(0,0,0,.02) 25%, rgba(0,0,0,.02) 50%, transparent 50%, transparent 75%, rgba(0,0,0,.02) 75%, rgba(0,0,0,.02))`,
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px'
              }}
            >
              <div ref={previewRef} className="relative flex items-center justify-center min-h-[300px] sm:min-h-[350px] bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 overflow-x-auto overflow-y-auto w-full">
                {/* Watermark removed - free users can use all features without watermark */}
                <SignaturePreview
                  nombre={signatureData.nombre}
                  cargo={signatureData.cargo}
                  foto={signatureData.foto || undefined}
                  telefono={signatureData.telefono || undefined}
                  redes={signatureData.redes}
                  template={template}
                  horario={signatureData.horario}
                  textoAdicional={signatureData.textoAdicional}
                  colorPersonalizado={signatureData.colorPersonalizado}
                  qrLink={signatureData.qrLink}
                  logoEmpresa={signatureData.logoEmpresa}
                  ctaTexto={signatureData.ctaTexto}
                  telefonoMovil={signatureData.telefonoMovil}
                  direccion={signatureData.direccion}
                  iconoTelefono={signatureData.iconoTelefono}
                  iconoTelefonoMovil={signatureData.iconoTelefonoMovil}
                  iconoDireccion={signatureData.iconoDireccion}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-6 border-t-2 border-gray-100">
              <div className="flex flex-col gap-4">
                {/* AI Helper Button - Only for authenticated Premium users */}
                {isAuthenticated && isPremium && (
                  <button
                    type="button"
                    onClick={() => setShowAiPanel(true)}
                    className="group w-full px-6 py-4 rounded-xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                    <span>✨ Improve with AI</span>
                  </button>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    aria-label={copied ? "Signature copied to clipboard" : "Copy signature HTML to clipboard"}
                    aria-pressed={copied}
                    className={`group flex-1 px-6 py-4 rounded-xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      copied
                        ? "bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white shadow-xl shadow-green-500/40 transform scale-105"
                        : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 shadow-xl shadow-gray-900/25 hover:shadow-2xl hover:shadow-gray-900/35 hover:scale-[1.02]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {copied ? "check_circle" : "content_copy"}
                    </span>
                    <span>{copied ? "Copied to Clipboard!" : "Copy HTML"}</span>
                    {!copied && (
                      <span className="text-xs opacity-75 group-hover:opacity-100">Ctrl+C</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    aria-label={editingSignatureId ? "Update signature" : "Save signature"}
                    aria-busy={saving}
                    className={`group flex-1 px-6 py-4 rounded-xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:focus:ring-0 ${
                      saving
                        ? "bg-gray-400 text-white cursor-not-allowed shadow-md"
                        : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02]"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${saving ? "animate-spin" : ""}`}>
                      {saving ? "hourglass_empty" : "save"}
                    </span>
                    <span>{saving ? "Saving..." : editingSignatureId ? "Update Signature" : "Save Signature"}</span>
                  </button>
                </div>
                {/* Export Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleDownloadPNG}
                    className="group flex-1 px-6 py-4 rounded-xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-xl">image</span>
                    <span>Export PNG</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="group flex-1 px-6 py-4 rounded-xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white hover:from-red-700 hover:via-orange-700 hover:to-red-700 shadow-xl shadow-red-500/40 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                    <span>Export PDF</span>
                  </button>
                </div>
                {/* Canvas Editor Link */}
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/canvas')}
                  className="group w-full px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-2 border-indigo-200 text-indigo-700 hover:from-indigo-100 hover:via-purple-100 hover:to-indigo-100 hover:border-indigo-300 hover:scale-[1.01]"
                >
                  <span className="material-symbols-outlined text-lg">palette</span>
                  <span>Need more control? Try our Signature Editor</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {saveLimit && !isPremium && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-sm">info</span>
                        <p className="text-xs text-blue-900 font-medium">
                          {saveLimit.remaining === 0 
                            ? "You've reached your limit of 3 saved signatures"
                            : `You can save ${saveLimit.remaining} more signature${saveLimit.remaining > 1 ? "s" : ""}`
                          }
                        </p>
                      </div>
                      {saveLimit.remaining === 0 && (
                        <Link
                          href="/dashboard/subscription"
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
                        >
                          Upgrade →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-3 text-center font-medium">
                  Signature copied! You can now paste it in Gmail or your email client.
                </p>
              )}
              {saveMessage && (
                <div
                  className={`mt-4 p-4 rounded-lg border ${
                    saveMessage.type === "success"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {saveMessage.type === "success" ? (
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <p
                      className={`text-sm font-medium whitespace-pre-line ${
                        saveMessage.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {saveMessage.text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && previewUrl && previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">image</span>
                Preview {previewType === "foto" ? "Photo" : "Logo"}
              </h3>
              <button
                onClick={handleCancelPreview}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close preview"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Preview Image */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-gray-50">
              <div className="relative max-w-full max-h-[60vh]">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* File Info */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">description</span>
                  <span className="font-medium">{previewFile.name}</span>
                </div>
                <span className="text-gray-500">
                  {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleCancelPreview}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={uploading || uploadingLogo}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                {uploading || uploadingLogo ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">cloud_upload</span>
                    Confirm & Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions Panel - Only render if user is authenticated and premium */}
      {isAuthenticated && user?.id && isPremium && (
        <AiSuggestionsPanel
          isOpen={showAiPanel}
          onClose={() => setShowAiPanel(false)}
          signatureData={signatureData}
          currentTemplate={template}
          userId={user.id}
          isPremium={isPremium}
          userEmail={user.email}
        onApplySuggestion={(suggestion) => {
          // Apply suggestion based on type
          if (suggestion.type === "add_field") {
            if (suggestion.field === "businessHours" && suggestion.example) {
              setSignatureData({ ...signatureData, horario: suggestion.example });
              showToast("Business hours added!", "success");
            } else if (suggestion.field === "mobile" && suggestion.example) {
              setSignatureData({ ...signatureData, telefonoMovil: suggestion.example });
              showToast("Mobile number added!", "success");
            } else if (suggestion.field === "address" && suggestion.example) {
              setSignatureData({ ...signatureData, direccion: suggestion.example });
              showToast("Address added!", "success");
            } else if (suggestion.field === "callToAction" && suggestion.example) {
              setSignatureData({ ...signatureData, ctaTexto: suggestion.example });
              showToast("Call-to-action added!", "success");
            } else if (suggestion.field === "website" || suggestion.field === "hasWebsite") {
              // Add website link to redes (social links array)
              const websiteUrl = suggestion.example || suggestion.suggestion || "https://yourwebsite.com";
              // Ensure URL has protocol
              const fullUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
              
              const newRed = {
                nombre: "Website",
                url: fullUrl,
                icono: "",
              };
              
              // Check if website already exists
              const existingWebsite = signatureData.redes?.find(
                (r) => r.nombre.toLowerCase() === "website" || 
                       (r.url.includes("http") && !r.url.match(/(linkedin|twitter|x|github|facebook|instagram|youtube|tiktok|behance|dribbble)\.com/))
              );
              
              if (existingWebsite) {
                // Update existing website
                const updatedRedes = signatureData.redes?.map((r) =>
                  r === existingWebsite ? newRed : r
                ) || [newRed];
                setSignatureData({ ...signatureData, redes: updatedRedes });
                showToast("Website updated!", "success");
              } else {
                // Add new website
                setSignatureData({
                  ...signatureData,
                  redes: [...(signatureData.redes || []), newRed],
                });
                showToast("Website added!", "success");
              }
            }
          } else if (suggestion.type === "add_social" && suggestion.platform) {
            // Add social link
            const newRed = {
              nombre: suggestion.platform,
              url: suggestion.example || `https://${suggestion.platform.toLowerCase()}.com/yourprofile`,
              icono: "",
            };
            setSignatureData({
              ...signatureData,
              redes: [...(signatureData.redes || []), newRed],
            });
            showToast(`${suggestion.platform} link added!`, "success");
          } else if (suggestion.type === "improve_content" && suggestion.suggestion) {
            if (suggestion.field === "role") {
              setSignatureData({ ...signatureData, cargo: suggestion.suggestion });
              showToast("Role updated!", "success");
            } else if (suggestion.field === "name" || suggestion.field === "fullName") {
              setSignatureData({ ...signatureData, nombre: suggestion.suggestion });
              showToast("Name updated!", "success");
            }
          } else if (suggestion.type === "add_feature" && suggestion.feature) {
            // Handle feature additions (e.g., QR code, business hours toggle)
            if (suggestion.feature === "qrCode") {
              setSignatureData({ ...signatureData, qrLink: suggestion.example || "https://example.com" });
              showToast("QR Code feature enabled!", "success");
            }
          }
        }}
          onTemplateChange={(templateId) => {
            setTemplate(templateId);
            showToast(`Template changed to ${templateId}`, "success");
          }}
        />
      )}
    </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
