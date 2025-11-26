"use client";

import { useState, useRef, useEffect } from "react";
import SignaturePreview from "@/components/SignaturePreview";
import IconPicker from "@/components/IconPicker";
import { TemplateType, RedSocial } from "@/types/signature";
import { copyToClipboard } from "@/lib/signatureUtils";
import { uploadImage } from "@/lib/imageUtils";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  // URLs de imágenes de ejemplo (imágenes reales profesionales de Unsplash)
  // Foto de perfil profesional - retrato empresarial de calidad
  const EXAMPLE_PHOTO_URL = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&auto=format&q=80";
  // Logo de empresa de ejemplo - diseño minimalista corporativo
  const EXAMPLE_LOGO_URL = "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=150&fit=crop&auto=format&q=80";

  const [signatureData, setSignatureData] = useState({
    nombre: "Juan Pérez",
    cargo: "Desarrollador Full Stack",
    foto: "",
    telefono: "+1 (555) 123-4567",
    redes: [
      { nombre: "LinkedIn", url: "https://linkedin.com/in/juanperez", icono: "💼" },
      { nombre: "X (Twitter)", url: "https://twitter.com/juanperez", icono: "🐦" },
      { nombre: "GitHub", url: "https://github.com/juanperez", icono: "💻" },
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
    stackTecnologico: "",
    testimonio: "",
    certificaciones: "",
    horarioConsulta: "",
    portfolio: "",
    tarifas: "",
    listings: "",
    calendarioCitas: "",
    publicaciones: "",
    afiliacionInstitucional: "",
    orcid: "",
    mision: "",
    donaciones: "",
    idiomas: "",
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

  // Agregar imágenes de ejemplo según el template cuando cambia
  useEffect(() => {
    // Templates que usan foto
    const templatesWithPhoto = ["classic", "modern", "minimal", "modernaSinBarra", "modern2", "modern3", "modern4"];
    // Templates que usan logo
    const templatesWithLogo = ["professional", "enterpriseVintage"];
    
    setSignatureData(prev => {
      const updates: Partial<typeof signatureData> = {};
      
      // Agregar foto de ejemplo si el template la requiere y no hay foto
      if (templatesWithPhoto.includes(template) && !prev.foto) {
        updates.foto = EXAMPLE_PHOTO_URL;
      }
      
      // Agregar logo de ejemplo si el template lo requiere y no hay logo
      if (templatesWithLogo.includes(template) && !prev.logoEmpresa) {
        updates.logoEmpresa = EXAMPLE_LOGO_URL;
      }
      
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [template]); // Se ejecuta cuando cambia el template

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(signatureData, template, signatureData.nombre || "Usuario");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Error al copiar al portapapeles. Por favor, inténtalo de nuevo.");
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
      alert(error instanceof Error ? error.message : "Error al cargar la imagen");
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
      alert(error instanceof Error ? error.message : "Error al cargar el logo");
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
    // Validar que los campos requeridos estén completos
    if (!signatureData.nombre || !signatureData.cargo) {
      setSaveMessage({
        type: "error",
        text: "Por favor completa al menos el nombre y el cargo",
      });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      // Preparar los datos para insertar
      // Asegurar que las propiedades coincidan exactamente con la estructura de la base de datos
      const signatureRecord = {
        name: signatureData.nombre,
        role: signatureData.cargo,
        phone: signatureData.telefono || null,
        image_url: signatureData.foto || null,
        social_links: signatureData.redes.length > 0 ? signatureData.redes : null,
        template_id: template,
      };

      // Insertar en la tabla signatures
      const { data, error } = await supabase
        .from("signatures")
        .insert([signatureRecord])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSaveMessage({
        type: "success",
        text: "¡Firma guardada exitosamente!",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      // Depuración: Imprimir el objeto error completo para ver detalles
      console.error("Error al guardar la firma - Objeto completo:", error);
      console.error("Error al guardar la firma - Detalles:", {
        message: error instanceof Error ? error.message : "Error desconocido",
        error,
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      setSaveMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al guardar la firma",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-gray-900">
              Firma<span className="text-blue-600">Pro</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Editor de Firmas
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Crea y personaliza tu firma digital profesional
          </p>
        </div>

        {/* Layout: Flex column en móvil, grid en desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:h-[calc(100vh-220px)]">
          {/* Formulario - Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-8 lg:overflow-y-auto order-1 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900">
              Información de la Firma
            </h2>

            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Plantilla
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
                    { id: "techDeveloper", name: "Tech Dev", badge: "New" },
                    { id: "salesProfessional", name: "Sales Pro", badge: "New" },
                    { id: "boldExecutive", name: "Executive", badge: "New" },
                    { id: "medicalProfessional", name: "Medical", badge: "New" },
                    { id: "consultant", name: "Consultant", badge: "New" },
                    { id: "realEstateAgent", name: "Real Estate", badge: "New" },
                    { id: "academicResearcher", name: "Academic", badge: "New" },
                    { id: "nonProfit", name: "Non-Profit", badge: "New" },
                    { id: "bilingual", name: "Bilingual", badge: "New" },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        const newTemplate = tpl.id as TemplateType;
                        setTemplate(newTemplate);
                        
                        // Agregar foto de ejemplo si el template usa foto y no hay foto
                        const templatesWithPhoto = ["classic", "modern", "minimal", "modernaSinBarra", "modern2", "modern3", "modern4"];
                        if (templatesWithPhoto.includes(newTemplate) && !signatureData.foto) {
                          setSignatureData({ ...signatureData, foto: EXAMPLE_PHOTO_URL });
                        }
                        
                        // Agregar logo de ejemplo si el template usa logo y no hay logo
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

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={signatureData.nombre}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo / Título
              </label>
              <input
                type="text"
                value={signatureData.cargo}
                onChange={(e) =>
                  setSignatureData({ ...signatureData, cargo: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Tu cargo o título profesional"
              />
            </div>

            {/* Foto - Input de Archivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Perfil
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
                      {uploading ? "Subiendo..." : "Haz clic para subir una imagen"}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG o GIF (máx. 5MB)
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
                      Eliminar Imagen
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logo de Empresa (Professional) */}
            {(template === "professional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de Empresa
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
                          {uploadingLogo ? "Subiendo logo..." : "Haz clic para subir un logo"}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG o GIF (máx. 5MB)
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
                      placeholder="URL del logo (https://ejemplo.com/logo.png)"
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
                        Eliminar Logo
                      </button>
                    </div>
                    <input
                      type="text"
                      value={signatureData.logoEmpresa || ""}
                      onChange={(e) =>
                        setSignatureData({ ...signatureData, logoEmpresa: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                      placeholder="URL del logo (https://ejemplo.com/logo.png)"
                    />
                    <p className="text-xs text-gray-500">
                      ⚠️ También puedes cambiar la URL del logo manualmente
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Teléfono */}
            <div>
              <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={signatureData.telefono}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, telefono: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <IconPicker
                  selectedIcon={signatureData.iconoTelefono}
                  onSelectIcon={(icon) =>
                    setSignatureData({ ...signatureData, iconoTelefono: icon })
                  }
                  label="Icono"
                />
              </div>
            </div>

            {/* Teléfono Móvil (Professional) */}
            {(template === "professional") && (
              <div>
                <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono Móvil
                    </label>
                    <input
                      type="text"
                      value={signatureData.telefonoMovil || ""}
                      onChange={(e) =>
                        setSignatureData({ ...signatureData, telefonoMovil: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                      placeholder="+34 614 19 54 89"
                    />
                  </div>
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

            {/* Dirección (Professional) */}
            {(template === "professional") && (
              <div>
                <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={signatureData.direccion || ""}
                      onChange={(e) =>
                        setSignatureData({ ...signatureData, direccion: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                      placeholder="Ej: Rio Barbate, 5, Cádiz 11138, Spain"
                    />
                  </div>
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

            {/* Logo de Empresa (Enterprise Vintage) */}
            {(template === "enterpriseVintage") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de Empresa
                </label>
                <input
                  type="text"
                  value={signatureData.logoEmpresa || ""}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, logoEmpresa: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="URL del logo (recomendado) o deja vacío para ocultar"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Se recomienda usar una URL pública del logo. Si dejas vacío, no se mostrará ningún logo.
                </p>
              </div>
            )}

            {/* Horario (QR Profesional) */}
            {(template === "qrProfesional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario de atención
                </label>
                <input
                  type="text"
                  value={signatureData.horario}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, horario: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: 08:00 a 16:00 hs"
                />
              </div>
            )}

            {/* Texto Adicional (Enterprise Vintage) */}
            {(template === "enterpriseVintage") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto adicional (debajo del teléfono)
                </label>
                <input
                  type="text"
                  value={signatureData.textoAdicional}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, textoAdicional: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Disponible de lunes a viernes"
                />
              </div>
            )}

            {/* Selector de Color (Moderna sin barra, Modern 4, Bold Executive, Bilingual) */}
            {(["modernaSinBarra", "modern4", "boldExecutive", "bilingual"].includes(template)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color personalizado
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={signatureData.colorPersonalizado || "#0066cc"}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, colorPersonalizado: e.target.value })
                    }
                    className="w-16 h-12 border border-gray-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={signatureData.colorPersonalizado}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, colorPersonalizado: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder="#0066cc"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {template === "modernaSinBarra" && "Color para borde de foto y cargo"}
                  {template === "modern4" && "Color para borde, línea y botón"}
                  {template === "boldExecutive" && "Color para texto y fondo sutil"}
                  {template === "bilingual" && "Color para borde y enlaces"}
                </p>
              </div>
            )}

            {/* Texto del CTA (Modern 4, Sales Professional) */}
            {(["modern4", "salesProfessional"].includes(template)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del botón CTA
                </label>
                  <input
                    type="text"
                    value={signatureData.ctaTexto || (template === "salesProfessional" ? "Agenda una llamada" : "Book a Meeting")}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, ctaTexto: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder={template === "salesProfessional" ? "Ej: Agenda una llamada" : "Ej: Book a Meeting"}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Personaliza el texto del botón de llamada a la acción
                  </p>
                </div>
              )}

            {/* Stack Tecnológico (Tech Developer) */}
            {(template === "techDeveloper") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stack Tecnológico <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={signatureData.stackTecnologico}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, stackTecnologico: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: React, Node.js, TypeScript, Python"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lista tus tecnologías principales separadas por comas
                </p>
              </div>
            )}

            {/* Testimonio (Sales Professional) */}
            {(template === "salesProfessional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonio/Calificación <span className="text-gray-400">(opcional)</span>
                </label>
                <textarea
                  value={signatureData.testimonio}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, testimonio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: 'Excelente servicio, muy profesional y eficiente' - Cliente satisfecho"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Agrega un testimonio o calificación para aumentar la confianza
                </p>
              </div>
            )}

            {/* Certificaciones (Medical Professional) */}
            {(template === "medicalProfessional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificaciones/Especialidades <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={signatureData.certificaciones}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, certificaciones: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Cardiología, Certificado en..."
                />
              </div>
            )}

            {/* Horario de Consulta (Medical Professional) */}
            {(template === "medicalProfessional") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario de Consulta <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={signatureData.horarioConsulta}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, horarioConsulta: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Lunes a Viernes 9:00 - 18:00"
                />
              </div>
            )}

            {/* Portfolio (Consultant) */}
            {(template === "consultant") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link a Portfolio <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={signatureData.portfolio}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, portfolio: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="https://ejemplo.com/portfolio"
                />
              </div>
            )}

            {/* Tarifas (Consultant) */}
            {(template === "consultant") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarifas <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={signatureData.tarifas}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, tarifas: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Desde $50/hora"
                />
              </div>
            )}

            {/* Testimonio (Consultant) */}
            {(template === "consultant") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonio <span className="text-gray-400">(opcional)</span>
                </label>
                <textarea
                  value={signatureData.testimonio}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, testimonio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: 'Excelente consultor, muy profesional' - Cliente"
                />
              </div>
            )}

            {/* Listings (Real Estate Agent) */}
            {(template === "realEstateAgent") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link a Propiedades/Listings <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={signatureData.listings}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, listings: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="https://ejemplo.com/propiedades"
                />
              </div>
            )}

            {/* Calendario de Citas (Real Estate Agent) */}
            {(template === "realEstateAgent") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link a Calendario de Citas <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={signatureData.calendarioCitas}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, calendarioCitas: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="https://calendly.com/usuario"
                />
              </div>
            )}

            {/* Publicaciones (Academic/Researcher) */}
            {(template === "academicResearcher") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link a Publicaciones <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={signatureData.publicaciones}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, publicaciones: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="https://scholar.google.com/..."
                />
              </div>
            )}

            {/* Afiliación Institucional (Academic/Researcher) */}
            {(template === "academicResearcher") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Afiliación Institucional <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={signatureData.afiliacionInstitucional}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, afiliacionInstitucional: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Universidad de..."
                />
              </div>
            )}

            {/* ORCID (Academic/Researcher) */}
            {(template === "academicResearcher") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ORCID ID <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={signatureData.orcid}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, orcid: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="0000-0000-0000-0000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tu identificador ORCID (sin https://orcid.org/)
                </p>
              </div>
            )}

            {/* Misión (Non-Profit) */}
            {(template === "nonProfit") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Misión/Causa <span className="text-gray-400">(opcional)</span>
                </label>
                <textarea
                  value={signatureData.mision}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, mision: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Trabajamos por la educación de niños en situación vulnerable"
                />
              </div>
            )}

            {/* Donaciones (Non-Profit) */}
            {(template === "nonProfit") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link a Donaciones <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={signatureData.donaciones}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, donaciones: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="https://ejemplo.com/donar"
                />
              </div>
            )}

            {/* Idiomas (Bilingual/Multilingual) */}
            {(template === "bilingual") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idiomas <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={signatureData.idiomas}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, idiomas: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Español, Inglés, Francés"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lista los idiomas que hablas separados por comas
                </p>
              </div>
            )}

            {/* QR Link (QR Profesional, QR Corporated, Tech Developer, Medical Professional, Real Estate Agent, Non-Profit) */}
            {(["qrProfesional", "qrCorporated", "techDeveloper", "medicalProfessional", "realEstateAgent", "nonProfit"].includes(template)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL para código QR
                </label>
                <input
                  type="url"
                  value={signatureData.qrLink}
                  onChange={(e) =>
                    setSignatureData({ ...signatureData, qrLink: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="https://ejemplo.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta URL se convertirá en un código QR en la firma
                </p>
              </div>
            )}

            {/* Redes Sociales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redes Sociales
              </label>
              <div className="space-y-2 mb-2">
                {signatureData.redes.map((red, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-2 sm:p-3 rounded-lg"
                  >
                    {editingRed === index ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editRedForm.nombre}
                          onChange={(e) =>
                            setEditRedForm({ ...editRedForm, nombre: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                          placeholder="Nombre"
                        />
                        <input
                          type="text"
                          value={editRedForm.url}
                          onChange={(e) =>
                            setEditRedForm({ ...editRedForm, url: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-400"
                          placeholder="URL"
                        />
                        <IconPicker
                          selectedIcon={editRedForm.icono}
                          onSelectIcon={(icon) =>
                            setEditRedForm({ ...editRedForm, icono: icon })
                          }
                          label="Icono de la red"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEditRed}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-semibold shadow-sm"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEditRed}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-semibold border border-gray-200"
                          >
                            Cancelar
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
                            <p className="text-xs text-gray-500 truncate">
                              {red.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditRed(index)}
                            className="px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition text-sm font-medium"
                            title="Editar"
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
                            title="Eliminar"
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
                    placeholder="Nombre (ej: LinkedIn)"
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
                      label="Icono (opcional)"
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
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Vista Previa - Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-8 lg:overflow-y-auto order-2 lg:order-2 flex flex-col">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                Vista Previa en Vivo
              </h2>
              <p className="text-sm text-gray-500">
                Los cambios se actualizan automáticamente
              </p>
            </div>

            {/* Vista Previa Principal */}
            <div className="bg-gradient-to-br from-gray-50 via-gray-50/50 to-gray-100 rounded-xl p-6 sm:p-10 border border-gray-200 mb-6" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}>
              <div className="flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
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
                  stackTecnologico={signatureData.stackTecnologico}
                  testimonio={signatureData.testimonio}
                  certificaciones={signatureData.certificaciones}
                  horarioConsulta={signatureData.horarioConsulta}
                  portfolio={signatureData.portfolio}
                  tarifas={signatureData.tarifas}
                  listings={signatureData.listings}
                  calendarioCitas={signatureData.calendarioCitas}
                  publicaciones={signatureData.publicaciones}
                  afiliacionInstitucional={signatureData.afiliacionInstitucional}
                  orcid={signatureData.orcid}
                  mision={signatureData.mision}
                  donaciones={signatureData.donaciones}
                  idiomas={signatureData.idiomas}
                />
              </div>
            </div>

            {/* Vista Simulada en Email */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 mb-6">
              <p className="text-xs text-gray-600 mb-3 font-semibold uppercase tracking-wide">
                Vista simulada en correo electrónico
              </p>
              <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Este es un ejemplo de cómo se verá tu firma en un correo
                  electrónico. La firma se actualiza automáticamente mientras
                  escribes.
                </p>
                <div className="border-t border-gray-200 pt-4">
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
            </div>


            {/* Botones de Acción */}
            <div className="mt-auto pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 px-6 py-3.5 rounded-lg transition-all duration-200 font-semibold text-base ${
                    saving
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                  }`}
                >
                  {saving ? "Guardando..." : "Guardar Firma"}
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className={`flex-1 px-6 py-3.5 rounded-lg transition-all duration-200 font-semibold text-base ${
                    copied
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20"
                  }`}
                >
                  {copied ? "✓ Copiado!" : "Copiar HTML"}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-3 text-center font-medium">
                  ¡Firma copiada! Ya puedes pegarla en Gmail o tu cliente de correo.
                </p>
              )}
              {saveMessage && (
                <p
                  className={`text-sm mt-3 text-center font-medium ${
                    saveMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {saveMessage.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
