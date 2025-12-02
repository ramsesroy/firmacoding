"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Verificar si hay un error en la URL
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        
        if (errorParam) {
          setError(errorDescription || "Error en la autenticación con Google");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          return;
        }

        // Supabase con detectSessionInUrl: true debería manejar automáticamente
        // la sesión cuando detecta el código en la URL.
        // Verificar la sesión después de un breve delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError("Error al procesar la autenticación. Por favor intenta nuevamente.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          return;
        }

        if (session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setError("No se pudo establecer la sesión. Por favor intenta nuevamente.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        setError("Error inesperado durante la autenticación.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        {error ? (
          <>
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <p className="text-sm text-gray-600">Redirigiendo al inicio de sesión...</p>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Procesando autenticación...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

