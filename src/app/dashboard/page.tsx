"use client";

import { useState, useRef } from "react";
import SignaturePreview from "@/components/SignaturePreview";
import { TemplateType, RedSocial } from "@/types/signature";
import { copyToClipboard } from "@/lib/signatureUtils";
import { uploadImage } from "@/lib/imageUtils";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [signatureData, setSignatureData] = useState({
    nombre: "Juan Pérez",
    cargo: "Desarrollador Full Stack",
    foto: "",
    telefono: "+1 (555) 123-4567",
    redes: [
      { nombre: "LinkedIn", url: "https://linkedin.com/in/juanperez" },
      { nombre: "Twitter", url: "https://twitter.com/juanperez" },
    ] as RedSocial[],
  });

  const [template, setTemplate] = useState<TemplateType>("classic");
  const [nuevaRed, setNuevaRed] = useState({ nombre: "", url: "" });
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingRed, setEditingRed] = useState<number | null>(null);
  const [editRedForm, setEditRedForm] = useState({ nombre: "", url: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(signatureData, template);
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

  const handleEditRed = (index: number) => {
    const red = signatureData.redes[index];
    setEditingRed(index);
    setEditRedForm({ nombre: red.nombre, url: red.url });
  };

  const handleSaveEditRed = () => {
    if (editingRed !== null && editRedForm.nombre && editRedForm.url) {
      const nuevasRedes = [...signatureData.redes];
      nuevasRedes[editingRed] = editRedForm as RedSocial;
      setSignatureData({ ...signatureData, redes: nuevasRedes });
      setEditingRed(null);
      setEditRedForm({ nombre: "", url: "" });
    }
  };

  const handleCancelEditRed = () => {
    setEditingRed(null);
    setEditRedForm({ nombre: "", url: "" });
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
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTemplate("classic")}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      template === "classic"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Clásica
                  </button>
                  <button
                    onClick={() => setTemplate("modern")}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      template === "modern"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Moderna
                  </button>
                  <button
                    onClick={() => setTemplate("minimal")}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      template === "minimal"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Minimal
                  </button>
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

            {/* Teléfono */}
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {red.nombre}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {red.url}
                          </p>
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
                <button
                  onClick={() => {
                    if (nuevaRed.nombre && nuevaRed.url) {
                      setSignatureData({
                        ...signatureData,
                        redes: [...signatureData.redes, nuevaRed as RedSocial],
                      });
                      setNuevaRed({ nombre: "", url: "" });
                    }
                  }}
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md shadow-blue-500/20"
                >
                  + Agregar
                </button>
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
