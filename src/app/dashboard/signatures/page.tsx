"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SignaturePreview from "@/components/SignaturePreview";
import { TemplateType, RedSocial } from "@/types/signature";
import { copyToClipboard } from "@/lib/signatureUtils";
import { exportToPNG, exportToPDF, exportToPNGHQ, exportToPDFHQ, ExportSize, getSizeLabel } from "@/lib/exportUtils";

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

export default function SignaturesPage() {
  const [signatures, setSignatures] = useState<SignatureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportSize, setExportSize] = useState<ExportSize>("auto");
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();
  const previewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchSignatures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push("/login");
        return;
      }

      // Get user signatures
      const { data, error: fetchError } = await supabase
        .from("signatures")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching signatures:", fetchError);
        throw fetchError;
      }

      setSignatures(data || []);
    } catch (err: any) {
      console.error("Error loading signatures:", err);
      setError(err.message || "Error loading signatures. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSignatures();
  }, [fetchSignatures]);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      const { error: deleteError } = await supabase
        .from("signatures")
        .delete()
        .eq("id", deleteConfirmId);

      if (deleteError) {
        throw deleteError;
      }

      // Close modal and reload list
      setDeleteConfirmId(null);
      await fetchSignatures();
    } catch (err: any) {
      console.error("Error deleting signature:", err);
      setDeleteError(err.message || "Error deleting signature. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
    setDeleteError(null);
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
      console.error("Error copying signature:", err);
      alert("Error copying signature");
    }
  };

  const handleExportPNG = async (signature: SignatureRecord) => {
    const previewRef = previewRefs.current[signature.id];
    if (!previewRef) {
      alert("Preview not available");
      return;
    }

    try {
      setExporting(signature.id);
      // Find the actual signature element - it could be a table or any container with the signature
      const signatureElement = previewRef.querySelector("table") as HTMLElement || 
                               previewRef.querySelector("div > table") as HTMLElement ||
                               previewRef.querySelector("* > table") as HTMLElement ||
                               previewRef.firstElementChild as HTMLElement;
      const elementToExport = signatureElement || previewRef;

      const filename = `${signature.name.replace(/\s+/g, "_")}_signature.png`;
      await exportToPNGHQ(elementToExport, filename, {
        size: exportSize,
        margin: 20,
      });
      setShowExportMenu(null);
    } catch (error) {
      console.error("Error exporting PNG:", error);
      alert(error instanceof Error ? error.message : "Error exporting to PNG");
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async (signature: SignatureRecord) => {
    const previewRef = previewRefs.current[signature.id];
    if (!previewRef) {
      alert("Preview not available");
      return;
    }

    try {
      setExporting(signature.id);
      // Find the actual signature element - it could be a table or any container with the signature
      const signatureElement = previewRef.querySelector("table") as HTMLElement || 
                               previewRef.querySelector("div > table") as HTMLElement ||
                               previewRef.querySelector("* > table") as HTMLElement ||
                               previewRef.firstElementChild as HTMLElement;
      const elementToExport = signatureElement || previewRef;

      const filename = `${signature.name.replace(/\s+/g, "_")}_signature.pdf`;
      await exportToPDFHQ(elementToExport, filename, {
        size: exportSize,
        margin: 20,
      });
      setShowExportMenu(null);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert(error instanceof Error ? error.message : "Error exporting to PDF");
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-3xl text-blue-600">badge</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Signatures</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-11">
            Manage all your saved signatures
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading signatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-3xl text-blue-600">badge</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Signatures</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-11">
            Manage all your saved signatures
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
                Try again
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
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-3xl text-blue-600">badge</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Signatures</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 ml-11">
          Manage all your saved signatures
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
            <p className="text-base sm:text-lg mb-2">You don't have any saved signatures yet</p>
            <p className="text-xs sm:text-sm mb-4">
              Create your first signature in the editor
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
            >
              Go to Editor
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
                {/* Signature preview */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">
                      Template: <span className="font-medium">{signature.template_id}</span>
                    </div>
                    <div 
                      ref={(el) => { previewRefs.current[signature.id] = el; }}
                      className="overflow-x-auto"
                    >
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

                {/* Information and actions */}
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
                        Created: {new Date(signature.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => router.push(`/dashboard?edit=${signature.id}`)}
                        className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                        Edit
                      </button>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleCopy(signature)}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            copiedId === signature.id
                              ? "bg-green-600 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {copiedId === signature.id ? "✓ Copied" : "Copy"}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(signature.id)}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      
                      {/* Export Options */}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="mb-2">
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Export Size:
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => setShowExportMenu(showExportMenu === signature.id ? null : signature.id)}
                              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                              disabled={exporting === signature.id}
                            >
                              <span>{getSizeLabel(exportSize)}</span>
                              <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                            </button>
                            {showExportMenu === signature.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setShowExportMenu(null)}
                                />
                                <div className="absolute left-0 right-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                                  {(["auto", "small", "medium", "large"] as ExportSize[]).map((size) => (
                                    <button
                                      key={size}
                                      onClick={() => {
                                        setExportSize(size);
                                        setShowExportMenu(null);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${
                                        exportSize === size ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                      }`}
                                    >
                                      {getSizeLabel(size)}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleExportPNG(signature)}
                            disabled={exporting === signature.id}
                            className="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-md shadow-purple-500/30 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">image</span>
                            <span>{exporting === signature.id ? "..." : "PNG"}</span>
                          </button>
                          <button
                            onClick={() => handleExportPDF(signature)}
                            disabled={exporting === signature.id}
                            className="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all shadow-md shadow-red-500/30 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                            <span>{exporting === signature.id ? "..." : "PDF"}</span>
                          </button>
                        </div>
                      </div>
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
          Create new signature
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
            onClick={handleDeleteCancel}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-white">warning</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete Signature</h3>
                    <p className="text-sm text-red-100">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this signature?
                </p>
                {deleteError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{deleteError}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

