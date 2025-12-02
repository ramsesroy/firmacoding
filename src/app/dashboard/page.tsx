"use client";

import React, { useState, useRef, useEffect } from "react";
import SignaturePreview from "@/components/SignaturePreview";
import IconPicker from "@/components/IconPicker";
import { TemplateType, RedSocial } from "@/types/signature";
import { copyToClipboard } from "@/lib/signatureUtils";
import { uploadImage } from "@/lib/imageUtils";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
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
    logoEmpresa: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=150&fit=crop&auto=format&q=80", // Logo de ejemplo para template professional
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Add example images based on template when it changes
  useEffect(() => {
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
  }, [template]);

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

      // Prepare data for insertion
      // Ensure properties match exactly with the database structure
      const signatureRecord: any = {
        name: signatureData.nombre,
        role: signatureData.cargo,
        phone: signatureData.telefono || null,
        image_url: signatureData.foto || null,
        social_links: signatureData.redes.length > 0 ? signatureData.redes : null,
        template_id: template,
        user_id: session.user.id, // Associate signature with authenticated user
      };

      // Insert into signatures table
      const { data, error } = await supabase
        .from("signatures")
        .insert([signatureRecord])
        .select()
        .single();

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
        text: "Signature saved successfully!",
      });
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido Principal */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-blue-600">edit_document</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Signature Editor
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-11">
            Create and customize your professional email signature
          </p>
        </div>

        {/* Layout: Flex column en móvil, grid en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:h-[calc(100vh-180px)]">
          {/* Formulario - Card */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-2xl text-blue-600">edit_document</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Signature Information
              </h2>
            </div>

            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 max-h-64 overflow-y-auto pr-2">
                  {[
                    { id: "professional", name: "Professional", badge: "Most Popular" },
                    { id: "classic", name: "Clásica" },
                    { id: "modern", name: "Moderna" },
                    { id: "minimal", name: "Minimal" },
                    { id: "minimalCorporate", name: "Corp" },
                    { id: "modernaSinBarra", name: "Modern 2" },
                    { id: "enterpriseVintage", name: "Enterprise" },
                    { id: "modern2", name: "Modern 3" },
                    { id: "qrProfesional", name: "QR Pro" },
                    { id: "modern3", name: "Modern 4" },
                    { id: "modern4", name: "Modern 5" },
                    { id: "qrCorporated", name: "QR Corp" },
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
                      className={`relative px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        template === tpl.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 relative">
                        <span>{tpl.name}</span>
                        {tpl.badge && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap ${
                            template === tpl.id
                              ? "bg-yellow-400 text-gray-900"
                              : "bg-yellow-400 text-gray-900"
                          }`}>
                            {tpl.badge}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={signatureData.nombre}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Your full name"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title / Position
              </label>
              <input
                type="text"
                value={signatureData.cargo}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, cargo: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Your professional title"
              />
            </div>

            {/* Photo - File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              {!signatureData.foto ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer bg-gray-50/50">
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
                    className="cursor-pointer block"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {uploading ? "Uploading..." : "Click to upload an image"}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG or GIF (max. 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                    <img
                      src={signatureData.foto}
                      alt="Vista previa"
                      className="max-w-full h-40 object-contain mx-auto rounded-lg shadow-sm"
                    />
                      <button
                      onClick={handleRemoveImage}
                      className="mt-3 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-semibold border border-red-200"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Company Logo (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                {!signatureData.logoEmpresa ? (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer bg-gray-50/50">
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
                        className="cursor-pointer block"
                      >
                        <svg
                          className="mx-auto h-10 w-10 text-gray-400 mb-2"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          {uploadingLogo ? "Uploading logo..." : "Click to upload a logo"}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG or GIF (max. 5MB)
                        </p>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                      placeholder="Logo URL (https://example.com/logo.png)"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                      <img
                        src={signatureData.logoEmpresa}
                        alt="Vista previa del logo"
                        className="max-w-full h-32 object-contain mx-auto rounded-lg shadow-sm"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="mt-3 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-semibold border border-red-200"
                      >
                        Remove Logo
                      </button>
                    </div>
                    <input
                      type="text"
                      value={signatureData.logoEmpresa || ""}
                      onChange={(e) =>
                        setSignatureData({ ...signatureData, logoEmpresa: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                      placeholder="Logo URL (https://example.com/logo.png)"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                <input
                  type="text"
                  value={signatureData.telefono}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, telefono: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="+1 (555) 123-4567"
                />
                <IconPicker
                  selectedIcon={signatureData.iconoTelefono}
                  onSelectIcon={(icon) =>
                    setSignatureData({ ...signatureData, iconoTelefono: icon })
                  }
                  label="Icono"
                />
              </div>
            </div>

            {/* Mobile Phone (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Phone
                </label>
                <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                  <input
                    type="text"
                    value={signatureData.telefonoMovil}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, telefonoMovil: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                  <input
                    type="text"
                    value={signatureData.direccion}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, direccion: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule
                </label>
                <input
                  type="text"
                  value={signatureData.horario}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, horario: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                />
              </div>
            )}

            {/* Additional Text (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Text
                </label>
                <textarea
                  value={signatureData.textoAdicional}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, textoAdicional: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Any additional relevant information"
                ></textarea>
              </div>
            )}

            {/* Custom Color (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={signatureData.colorPersonalizado || "#1D4ED8"} // Default blue-700
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, colorPersonalizado: e.target.value })
                  }
                  className="w-full h-12 rounded-lg border border-gray-200 cursor-pointer"
                  title="Choose a color"
                />
              </div>
            )}

            {/* QR Link (Professional) */}
            {(template === "qrProfesional" || template === "qrCorporated") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Link
                </label>
                <input
                  type="text"
                  value={signatureData.qrLink}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, qrLink: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="https://your-site.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This link will be used to generate the QR code in your signature.
                </p>
              </div>
            )}

            {/* Call to Action (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action (CTA) Text
                </label>
                <input
                  type="text"
                  value={signatureData.ctaTexto}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, ctaTexto: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Visit my website"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Short text for a button or highlighted link.
                </p>
              </div>
            )}

            {/* Social Media Links */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-2xl text-blue-600">share</span>
                <h3 className="text-lg font-bold text-gray-900">Social Media</h3>
              </div>
              <div className="space-y-4">
                {signatureData.redes.map((red, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3"
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={editRedForm.url}
                            onChange={(e) =>
                              setEditRedForm({ ...editRedForm, url: e.target.value })
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="URL"
                          />
                        </div>
                        <IconPicker
                          selectedIcon={editRedForm.icono}
                          onSelectIcon={(icon) =>
                            setEditRedForm({ ...editRedForm, icono: icon })
                          }
                          label="Icono"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={handleSaveEditRed}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-semibold shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditRed}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-semibold border border-gray-200"
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
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder="Name (e.g., LinkedIn)"
                  />
                  <input
                    type="text"
                    value={nuevaRed.url}
                    onChange={(e) =>
                      setNuevaRed({ ...nuevaRed, url: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
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
          </div>
          </div>

            {/* Preview - Card */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 overflow-y-auto flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-2xl text-blue-600">preview</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Live Preview
                </h2>
                <p className="text-sm text-gray-500">
                  Changes update automatically
                </p>
              </div>
            </div>

            {/* Main Preview */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 via-gray-50/50 to-gray-100 rounded-xl p-6 sm:p-10 border border-gray-200 mb-6" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}>
              <div className="flex items-center justify-center min-h-[300px]">
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
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyToClipboard}
                  className={`flex-1 px-6 py-3.5 rounded-lg transition-all duration-200 font-semibold text-base flex items-center justify-center gap-2 ${
                    copied
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {copied ? "check_circle" : "content_copy"}
                  </span>
                  {copied ? "Copied!" : "Copy HTML"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 px-6 py-3.5 rounded-lg transition-all duration-200 font-semibold text-base flex items-center justify-center gap-2 ${
                    saving
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {saving ? "hourglass_empty" : "save"}
                  </span>
                  {saving ? "Saving..." : "Save Signature"}
                </button>
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
