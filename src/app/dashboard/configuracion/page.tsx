"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ConfiguracionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({ totalFirmas: 0 });
  
  // Estados para cambio de email
  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setNewEmail(user.email || "");
      loadStats();
    } else {
      router.push("/register");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const loadStats = async () => {
    if (!user) return;
    
    setStatsLoading(true);
    try {
      const { count, error } = await supabase
        .from("signatures")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) throw error;
      setStats({ totalFirmas: count || 0 });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newEmail === user.email) {
      setEmailMessage({
        type: "error",
        text: "El nuevo email debe ser diferente al actual",
      });
      setTimeout(() => setEmailMessage(null), 3000);
      return;
    }

    setLoading(true);
    setEmailMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      setEmailMessage({
        type: "success",
        text: "Se ha enviado un enlace de confirmación a tu nuevo email. Por favor, verifica tu nuevo email para completar el cambio.",
      });
    } catch (error: any) {
      setEmailMessage({
        type: "error",
        text: error.message || "Error al actualizar el email",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validaciones
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Las contraseñas no coinciden",
      });
      setTimeout(() => setPasswordMessage(null), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "La contraseña debe tener al menos 6 caracteres",
      });
      setTimeout(() => setPasswordMessage(null), 3000);
      return;
    }

    setLoading(true);
    setPasswordMessage(null);

    try {
      // Primero verificar la contraseña actual intentando iniciar sesión
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: passwordData.currentPassword,
      });

      if (signInError) {
        throw new Error("La contraseña actual es incorrecta");
      }

      // Si la contraseña actual es correcta, actualizar
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) throw updateError;

      setPasswordMessage({
        type: "success",
        text: "Contraseña actualizada exitosamente",
      });

      // Limpiar formulario
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setPasswordMessage({
        type: "error",
        text: error.message || "Error al actualizar la contraseña",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Configuración
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Gestiona las preferencias de tu cuenta
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Estadísticas */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
            📊 Estadísticas
          </h2>
          {statsLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Cargando...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  {stats.totalFirmas}
                </div>
                <div className="text-sm text-blue-700 font-medium">
                  Firmas Guardadas
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Información de la Cuenta */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
            👤 Información de la Cuenta
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Actual
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este es tu email actual de la cuenta
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de Usuario
              </label>
              <input
                type="text"
                value={user.id}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Registro
              </label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Cambiar Email */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
            ✉️ Cambiar Email
          </h2>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                placeholder="nuevo@email.com"
              />
            </div>
            {emailMessage && (
              <div
                className={`px-4 py-3 rounded-lg text-sm ${
                  emailMessage.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {emailMessage.text}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || newEmail === user.email}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading || newEmail === user.email
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
            >
              {loading ? "Actualizando..." : "Actualizar Email"}
            </button>
          </form>
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
            🔒 Cambiar Contraseña
          </h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900"
                placeholder="Repite la nueva contraseña"
              />
            </div>
            {passwordMessage && (
              <div
                className={`px-4 py-3 rounded-lg text-sm ${
                  passwordMessage.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        </div>

        {/* Zona de Peligro */}
        <div className="bg-red-50 rounded-xl sm:rounded-2xl border-2 border-red-200 shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-red-900">
            ⚠️ Zona de Peligro
          </h2>
          <p className="text-sm text-red-700 mb-4">
            Las acciones en esta sección son permanentes y no se pueden deshacer.
          </p>
          <button
            onClick={async () => {
              if (
                confirm(
                  "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
                )
              ) {
                // Aquí podrías implementar la eliminación de cuenta
                alert(
                  "Funcionalidad de eliminación de cuenta próximamente. Por favor, contacta con soporte."
                );
              }
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
