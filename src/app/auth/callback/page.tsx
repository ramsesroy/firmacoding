"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // Create stable string representation of relevant search params to avoid unnecessary re-renders
  // This prevents the effect from running on every render when searchParams object reference changes
  const searchParamsKey = useMemo(() => {
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    // Create stable key from actual parameter values, not the object reference
    return `${errorParam || ""}_${errorDescription || ""}`;
  }, [searchParams]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's an error in the URL
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        
        if (errorParam) {
          setError(errorDescription || "Error authenticating with Google");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          return;
        }

        // Supabase with detectSessionInUrl: true should automatically handle
        // the session when it detects the code in the URL.
        // Check the session after a brief delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          logger.error("Error getting session", sessionError, "Auth Callback");
          setError("Error processing authentication. Please try again.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          return;
        }

        if (session) {
          // Migrate temp images when user authenticates via OAuth
          try {
            const { migrateTempImages } = await import("@/lib/imageUtils");
            await migrateTempImages(session.user.id);
          } catch (error) {
            logger.error("Error migrating temp images", error instanceof Error ? error : new Error(String(error)), "Auth Callback");
            // Don't block auth if migration fails
          }
          
          router.push("/dashboard");
          router.refresh();
        } else {
          setError("Could not establish session. Please try again.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error("Error in auth callback", err, "Auth Callback");
        setError("Unexpected error during authentication.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    handleAuthCallback();
    // Use searchParamsKey (stable string) instead of searchParams (object reference)
    // This ensures the effect only runs when the actual parameter values change,
    // not when the searchParams object reference changes on each render
  }, [router, searchParamsKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        {error ? (
          <>
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <p className="text-sm text-gray-600">Redirecting to sign in...</p>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Processing authentication...</p>
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

