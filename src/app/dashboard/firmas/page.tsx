"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TemplateType, RedSocial } from "@/types/signature";
import SignaturePreview from "@/components/SignaturePreview";
import { copyToClipboard, generateSignatureHTML } from "@/lib/signatureUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

interface SignatureRecord {
  id: string;
  name: string;
  role: string;
  phone: string | null;
  image_url: string | null;
  social_links: RedSocial[] | null;
  template_id: TemplateType;
  created_at: string;
  // Campos adicionales que podrían estar en la BD
  logo_empresa?: string | null;
  logo_posicion?: "top" | "center" | "bottom" | null;
  telefono_movil?: string | null;
  direccion?: string | null;
  horario?: string | null;
  texto_adicional?: string | null;
  color_personalizado?: string | null;
  qr_link?: string | null;
  cta_texto?: string | null;
  icono_telefono?: string | null;
  icono_telefono_movil?: string | null;
  icono_direccion?: string | null;
}

export default function FirmasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [signatures, setSignatures] = useState<SignatureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/register");
      return;
    }
    loadSignatures();
  }, [user, router]);

  const loadSignatures = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("signatures")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setSignatures(data || []);
    } catch (err) {
      console.error("Error al cargar firmas:", err);
      setError(err instanceof Error ? err.message : "Error al cargar las firmas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta firma?")) {
      return;
    }

    setDeletingId(id);
    try {
      const { error: deleteError } = await supabase
        .from("signatures")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Recargar la lista
      await loadSignatures();
    } catch (err) {
      console.error("Error al eliminar firma:", err);
      alert(err instanceof Error ? err.message : "Error al eliminar la firma");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = async (signature: SignatureRecord) => {
    // Convertir el registro de BD al formato SignatureProps
    const signatureData = {
      nombre: signature.name,
      cargo: signature.role,
      foto: signature.image_url || undefined,
      telefono: signature.phone || undefined,
      redes: (signature.social_links as RedSocial[]) || [],
      horario: signature.horario || undefined,
      textoAdicional: signature.texto_adicional || undefined,
      colorPersonalizado: signature.color_personalizado || undefined,
      qrLink: signature.qr_link || undefined,
      logoEmpresa: signature.logo_empresa || undefined,
      logoPosicion: (signature.logo_posicion as "top" | "center" | "bottom") || "center",
      ctaTexto: signature.cta_texto || undefined,
      telefonoMovil: signature.telefono_movil || undefined,
      direccion: signature.direccion || undefined,
      iconoTelefono: signature.icono_telefono || undefined,
      iconoTelefonoMovil: signature.icono_telefono_movil || undefined,
      iconoDireccion: signature.icono_direccion || undefined,
    };

    const success = await copyToClipboard(
      signatureData,
      signature.template_id,
      signature.name
    );

    if (success) {
      setCopiedId(signature.id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      alert("Error al copiar al portapapeles. Por favor, inténtalo de nuevo.");
    }
  };

  const handleEdit = (signature: SignatureRecord) => {
    // Guardar los datos en localStorage para que el editor los cargue
    const signatureData = {
      nombre: signature.name,
      cargo: signature.role,
      foto: signature.image_url || "",
      telefono: signature.phone || "",
      redes: (signature.social_links as RedSocial[]) || [],
      horario: signature.horario || "",
      textoAdicional: signature.texto_adicional || "",
      colorPersonalizado: signature.color_personalizado || "",
      qrLink: signature.qr_link || "",
      logoEmpresa: signature.logo_empresa || "",
      logoPosicion: (signature.logo_posicion as "top" | "center" | "bottom") || "center",
      ctaTexto: signature.cta_texto || "",
      telefonoMovil: signature.telefono_movil || "",
      direccion: signature.direccion || "",
      iconoTelefono: signature.icono_telefono || "📞",
      iconoTelefonoMovil: signature.icono_telefono_movil || "📱",
      iconoDireccion: signature.icono_direccion || "📍",
    };

    localStorage.setItem("editSignature", JSON.stringify({
      data: signatureData,
      template: signature.template_id,
      id: signature.id,
    }));

    // Redirigir al editor
    window.location.href = "/dashboard?edit=" + signature.id;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTemplateName = (templateId: TemplateType): string => {
    const names: Record<TemplateType, string> = {
      professional: "Professional",
      classic: "Clásica",
      modern: "Moderna",
      minimal: "Minimal",
      minimalCorporate: "Corp",
      modernaSinBarra: "Modern 2",
      enterpriseVintage: "Enterprise",
      modern2: "Modern 3",
      qrProfesional: "QR Pro",
      modern3: "Modern 4",
      modern4: "Modern 5",
      qrCorporated: "QR Corp",
    };
    return names[templateId] || templateId;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando firmas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadSignatures}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Mis Firmas
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gestiona todas tus firmas guardadas ({signatures.length})
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base shadow-md"
          >
            + Nueva Firma
          </Link>
        </div>
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
        <div className="space-y-4 sm:space-y-6">
          {signatures.map((signature) => {
            const signatureData = {
              nombre: signature.name,
              cargo: signature.role,
              foto: signature.image_url || undefined,
              telefono: signature.phone || undefined,
              redes: (signature.social_links as RedSocial[]) || [],
              horario: signature.horario || undefined,
              textoAdicional: signature.texto_adicional || undefined,
              colorPersonalizado: signature.color_personalizado || undefined,
              qrLink: signature.qr_link || undefined,
              logoEmpresa: signature.logo_empresa || undefined,
              logoPosicion: (signature.logo_posicion as "top" | "center" | "bottom") || "center",
              ctaTexto: signature.cta_texto || undefined,
              telefonoMovil: signature.telefono_movil || undefined,
              direccion: signature.direccion || undefined,
              iconoTelefono: signature.icono_telefono || undefined,
              iconoTelefonoMovil: signature.icono_telefono_movil || undefined,
              iconoDireccion: signature.icono_direccion || undefined,
            };

            const isExpanded = expandedId === signature.id;
            const isCopied = copiedId === signature.id;
            const isDeleting = deletingId === signature.id;

            return (
              <div
                key={signature.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
              >
                {/* Header de la tarjeta */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                        {signature.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-600">
                        <span className="truncate">{signature.role}</span>
                        <span className="text-gray-300">•</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                          {getTemplateName(signature.template_id)}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(signature.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : signature.id)}
                        className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200"
                      >
                        {isExpanded ? "Ocultar" : "Ver Preview"}
                      </button>
                      <button
                        onClick={() => handleCopy(signature)}
                        disabled={isCopied}
                        className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition ${
                          isCopied
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isCopied ? "✓ Copiado" : "Copiar HTML"}
                      </button>
                      <button
                        onClick={() => handleEdit(signature)}
                        className="px-3 sm:px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(signature.id)}
                        disabled={isDeleting}
                        className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition ${
                          isDeleting
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        }`}
                      >
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview expandible */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
                    <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wide">
                        Vista Previa
                      </p>
                      <div className="flex items-center justify-center">
                        <SignaturePreview
                          nombre={signatureData.nombre}
                          cargo={signatureData.cargo}
                          foto={signatureData.foto}
                          telefono={signatureData.telefono}
                          redes={signatureData.redes}
                          template={signature.template_id}
                          horario={signatureData.horario}
                          textoAdicional={signatureData.textoAdicional}
                          colorPersonalizado={signatureData.colorPersonalizado}
                          qrLink={signatureData.qrLink}
                          logoEmpresa={signatureData.logoEmpresa}
                          logoPosicion={signatureData.logoPosicion}
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
