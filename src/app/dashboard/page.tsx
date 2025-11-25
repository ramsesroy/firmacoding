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
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editor de Firmas
          </h1>
          <p className="text-gray-600">
            Crea y personaliza tu firma digital profesional
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Formulario - Columna Izquierda */}
          <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Información de la Firma
            </h2>

            <div className="space-y-5">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Plantilla
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTemplate("classic")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      template === "classic"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Clásica
                  </button>
                  <button
                    onClick={() => setTemplate("modern")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      template === "modern"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Moderna
                  </button>
                  <button
                    onClick={() => setTemplate("minimal")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      template === "minimal"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tu cargo o título profesional"
              />
            </div>

            {/* Foto - Input de Archivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Perfil
              </label>
              {!signatureData.foto ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition cursor-pointer">
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
                    <span className="text-sm text-gray-600">
                      {uploading ? "Subiendo..." : "Haz clic para subir una imagen"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG o GIF (máx. 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <img
                      src={signatureData.foto}
                      alt="Vista previa"
                      className="max-w-full h-32 object-contain mx-auto rounded"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="mt-3 w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="flex gap-2 items-center bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm flex-1">{red.nombre}</span>
                    <button
                      onClick={() => {
                        const nuevasRedes = signatureData.redes.filter(
                          (_, i) => i !== index
                        );
                        setSignatureData({ ...signatureData, redes: nuevasRedes });
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuevaRed.nombre}
                  onChange={(e) =>
                    setNuevaRed({ ...nuevaRed, nombre: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nombre (ej: LinkedIn)"
                />
                <input
                  type="text"
                  value={nuevaRed.url}
                  onChange={(e) =>
                    setNuevaRed({ ...nuevaRed, url: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          </div>

          {/* Vista Previa - Columna Derecha */}
          <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Vista Previa en Vivo
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Los cambios se actualizan automáticamente
              </p>
            </div>

            {/* Vista Previa Principal */}
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 mb-6">
              <div className="flex items-center justify-center min-h-[200px]">
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
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-3 font-medium">
                Vista simulada en correo electrónico:
              </p>
              <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
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
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 px-4 py-2 rounded-lg transition font-medium text-sm ${
                    saving
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {saving ? "Guardando..." : "Guardar Firma"}
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className={`flex-1 px-4 py-2 rounded-lg transition font-medium text-sm ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {copied ? "✓ Copiado!" : "Copiar HTML"}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-2 text-center">
                  ¡Firma copiada! Ya puedes pegarla en Gmail o tu cliente de correo.
                </p>
              )}
              {saveMessage && (
                <p
                  className={`text-xs mt-2 text-center ${
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
