"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SignaturePreview from "@/components/SignaturePreview";
import { TemplateType, RedSocial } from "@/types/signature";
import { copyToClipboard } from "@/lib/signatureUtils";

interface SignatureRecord {
  id: string;
  name: string;
  role: string;
  phone?: string;
  image_url?: string;
  social_links?: RedSocial[];
  template_id: TemplateType;
  created_at: string;
  updated_at: string;
}

export default function FirmasPage() {
  const [signatures, setSignatures] = useState<SignatureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar autenticación
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push("/login");
        return;
      }

      // Obtener las firmas del usuario
      const { data, error: fetchError } = await supabase
        .from("signatures")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error al obtener firmas:", fetchError);
        throw fetchError;
      }

      setSignatures(data || []);
    } catch (err: any) {
      console.error("Error al cargar firmas:", err);
      setError(err.message || "Error al cargar las firmas. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta firma?")) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("signatures")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Recargar la lista
      await fetchSignatures();
    } catch (err: any) {
      console.error("Error al eliminar firma:", err);
      alert(`Error al eliminar la firma: ${err.message}`);
    }
  };

  const handleCopy = async (signature: SignatureRecord) => {
    try {
      const signatureData = {
        nombre: signature.name,
        cargo: signature.role,
        foto: signature.image_url,
        telefono: signature.phone,
        redes: signature.social_links || [],
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
      };

      await copyToClipboard(signatureData, signature.template_id);
      setCopiedId(signature.id);
      setTimeout(() => setCopiedId(null), 3000);
    } catch (err) {
      console.error("Error al copiar firma:", err);
      alert("Error al copiar la firma");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mis Firmas</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestiona todas tus firmas guardadas
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando firmas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mis Firmas</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestiona todas tus firmas guardadas
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-600">{error}</p>
              <button
                onClick={fetchSignatures}
                className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mis Firmas</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Gestiona todas tus firmas guardadas
        </p>
      </div>

      {signatures.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-base sm:text-lg mb-2">No tienes firmas guardadas aún</p>
            <p className="text-xs sm:text-sm mb-4">
              Crea tu primera firma en el editor
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
            >
              Ir al Editor
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {signatures.map((signature) => (
            <div
              key={signature.id}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Vista previa de la firma */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">
                      Plantilla: <span className="font-medium">{signature.template_id}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <SignaturePreview
                        nombre={signature.name}
                        cargo={signature.role}
                        foto={signature.image_url}
                        telefono={signature.phone}
                        redes={signature.social_links || []}
                        template={signature.template_id}
                      />
                    </div>
                  </div>
                </div>

                {/* Información y acciones */}
                <div className="lg:w-64 flex-shrink-0">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {signature.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {signature.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        Creada: {new Date(signature.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleCopy(signature)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          copiedId === signature.id
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {copiedId === signature.id ? "✓ Copiado" : "Copiar"}
                      </button>
                      <button
                        onClick={() => handleDelete(signature.id)}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear nueva firma
        </Link>
      </div>
    </div>
  );
}
