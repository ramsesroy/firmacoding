"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SignaturePreview from "@/components/SignaturePreview";
import IconPicker from "@/components/IconPicker";
import { TemplateType, RedSocial } from "@/types/signature";
import { copyToClipboard } from "@/lib/signatureUtils";
import { uploadImage } from "@/lib/imageUtils";
import { supabase } from "@/lib/supabaseClient";

// Force dynamic rendering for this page to support search params
export const dynamic = "force-dynamic";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Example image URLs (professional images from Unsplash)
  // Professional profile photo - high quality corporate portrait
  const EXAMPLE_PHOTO_URL: string = "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=faces&auto=format&q=80";
  // Company logo example - minimalist corporate design
  const EXAMPLE_LOGO_URL: string = "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=150&fit=crop&auto=format&q=80";

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
    logoEmpresa: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=150&fit=crop&auto=format&q=80", // Example logo for professional template
    ctaTexto: "",
    telefonoMovil: "",
    direccion: "",
    iconoTelefono: "📞",
    iconoTelefonoMovil: "📱",
    iconoDireccion: "📍",
  });

  const [template, setTemplate] = useState<TemplateType>("professional");
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
  const previewRef = useRef<HTMLDivElement>(null);

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
    } catch (err: any) {
      console.error("Error loading signature:", err);
      alert(err.message || "Error loading signature. Please try again.");
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
    const templatesWithPhoto = ["classic", "modern", "minimal", "modernaSinBarra", "modern2", "modern3", "modern4"];
    // Templates that use logo
    const templatesWithLogo = ["professional", "enterpriseVintage"];
    
    const photoUrl = "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=faces&auto=format&q=80";
    const logoUrl = "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=150&fit=crop&auto=format&q=80";
    
    setSignatureData((prev) => {
      const updates: any = {};
      
      // Add example photo if template requires it and no photo exists
      if (templatesWithPhoto.includes(template) && !prev.foto) {
        updates.foto = photoUrl;
      }
      
      // Add example logo if template requires it and no logo exists
      if (templatesWithLogo.includes(template) && !prev.logoEmpresa) {
        updates.logoEmpresa = logoUrl;
      }
      
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [template, loadingSignature, editingSignatureId]);

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(signatureData, template, signatureData.nombre || "User");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Error copying to clipboard. Please try again.");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageURL = await uploadImage(file);
      setSignatureData({ ...signatureData, foto: imageURL });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error uploading image");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
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

    setUploadingLogo(true);
    try {
      const imageURL = await uploadImage(file);
      setSignatureData({ ...signatureData, logoEmpresa: imageURL });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error uploading logo");
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = "";
      }
    } finally {
      setUploadingLogo(false);
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
      const signatureRecord: any = {
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
        // Insert new signature
        signatureRecord.user_id = session.user.id; // Associate signature with authenticated user
        
        const { data: insertData, error: insertError } = await supabase
          .from("signatures")
          .insert([signatureRecord])
          .select()
          .single();
        
        data = insertData;
        error = insertError;
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
      console.error("Error saving signature:", error);
      
      setSaveMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error saving signature. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loadingSignature) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading signature...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto">
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
                  {template === "professional" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 border border-amber-200 rounded-full">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      <span className="text-xs font-semibold text-amber-900">Popular</span>
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { id: "professional", name: "Professional", badge: "Most Popular", icon: "palette", color: "from-purple-500 to-indigo-600" },
                    { id: "classic", name: "Classic", icon: "description", color: "from-gray-500 to-gray-700" },
                    { id: "modern", name: "Modern", icon: "auto_awesome", color: "from-pink-500 to-rose-600" },
                    { id: "minimal", name: "Minimal", icon: "bolt", color: "from-yellow-500 to-orange-600" },
                    { id: "minimalCorporate", name: "Corporate", icon: "business_center", color: "from-blue-500 to-cyan-600" },
                    { id: "modernaSinBarra", name: "Modern 2", icon: "diamond", color: "from-cyan-500 to-blue-600" },
                    { id: "enterpriseVintage", name: "Enterprise", icon: "apartment", color: "from-slate-500 to-gray-700" },
                    { id: "modern2", name: "Modern 3", icon: "workspace_premium", color: "from-amber-500 to-orange-600" },
                    { id: "qrProfesional", name: "QR Pro", icon: "qr_code_scanner", color: "from-green-500 to-emerald-600" },
                    { id: "modern3", name: "Modern 4", icon: "stars", color: "from-violet-500 to-purple-600" },
                    { id: "modern4", name: "Modern 5", icon: "flash_on", color: "from-blue-400 to-indigo-600" },
                    { id: "qrCorporated", name: "QR Corp", icon: "qr_code_2", color: "from-teal-500 to-cyan-600" },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        const newTemplate = tpl.id as TemplateType;
                        setTemplate(newTemplate);
                        
                        // Add example photo if template uses photo and no photo exists
                        const templatesWithPhoto = ["classic", "modern", "minimal", "modernaSinBarra", "modern2", "modern3", "modern4"];
                        if (templatesWithPhoto.includes(newTemplate) && !signatureData.foto) {
                          setSignatureData({ ...signatureData, foto: EXAMPLE_PHOTO_URL });
                        }
                        
                        // Add example logo if template uses logo and no logo exists
                        const templatesWithLogo = ["professional", "enterpriseVintage"];
                        if (templatesWithLogo.includes(newTemplate) && !signatureData.logoEmpresa) {
                          setSignatureData({ ...signatureData, logoEmpresa: EXAMPLE_LOGO_URL });
                        }
                      }}
                      className={`group relative px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                        template === tpl.id
                          ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl shadow-blue-500/40 ring-2 ring-blue-400 ring-offset-2 ring-offset-white transform scale-[1.02]"
                          : "bg-white text-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
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
                            className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center shadow-lg border-2 border-gray-200/50 group-hover:shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300"
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
                      <img
                        src={signatureData.foto}
                        alt="Preview"
                        className="max-w-full h-44 object-contain mx-auto rounded-xl shadow-md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <button
                      onClick={handleRemoveImage}
                      className="mt-4 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-semibold border-2 border-red-200 hover:border-red-300 flex items-center justify-center gap-2"
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
                        <img
                          src={signatureData.logoEmpresa}
                          alt="Logo preview"
                          className="max-w-full h-32 object-contain mx-auto rounded-xl shadow-md"
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
            {(template === "qrProfesional" || template === "qrCorporated") && (
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
                            onClick={handleSaveEditRed}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditRed}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-semibold border-2 border-gray-200 hover:border-gray-300"
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
                    onClick={() => {
                      if (nuevaRed.nombre && nuevaRed.url) {
                        setSignatureData({
                          ...signatureData,
                          redes: [...signatureData.redes, { ...nuevaRed, icono: nuevaRed.icono || undefined } as RedSocial],
                        });
                        setNuevaRed({ nombre: "", url: "", icono: "" });
                      }
                    }}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md shadow-blue-500/20 whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Preview - Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-900/5 p-6 sm:p-8 overflow-y-auto flex flex-col custom-scrollbar">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
                <span className="material-symbols-outlined text-base text-green-600">visibility</span>
                <span className="text-sm font-semibold text-green-900">Live Preview</span>
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
            <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-6 sm:p-10 border-2 border-gray-100 mb-6 shadow-inner" style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 25%, rgba(0,0,0,.02) 25%, rgba(0,0,0,.02) 50%, transparent 50%, transparent 75%, rgba(0,0,0,.02) 75%, rgba(0,0,0,.02)),
                linear-gradient(45deg, transparent 25%, rgba(0,0,0,.02) 25%, rgba(0,0,0,.02) 50%, transparent 50%, transparent 75%, rgba(0,0,0,.02) 75%, rgba(0,0,0,.02))
              `,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px'
            }}>
              <div ref={previewRef} className="flex items-center justify-center min-h-[350px] bg-white rounded-xl shadow-lg border border-gray-100 p-6">
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleCopyToClipboard}
                    className={`group flex-1 px-6 py-4 rounded-xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 ${
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
                    onClick={handleSave}
                    disabled={saving}
                    className={`group flex-1 px-6 py-4 rounded-xl transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 ${
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
    </div>
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
