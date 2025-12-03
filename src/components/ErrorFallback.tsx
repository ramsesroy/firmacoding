"use client";

import React from "react";
import Link from "next/link";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  variant?: "page" | "component";
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  variant = "page",
}: ErrorFallbackProps) {
  if (variant === "component") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-red-600 text-xl">
            error
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900 mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-red-700 mb-3">
              {error.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={resetErrorBoundary}
              className="text-xs text-red-600 hover:text-red-700 font-medium underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-red-600">
              error
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-left mb-4">
              <p className="text-xs font-mono text-red-600 break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="block w-full text-gray-600 hover:text-gray-900 text-sm underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

