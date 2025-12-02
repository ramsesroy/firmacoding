import React from "react";

interface ExportLoadingModalProps {
  isOpen: boolean;
  message?: string;
  progress?: number; // 0-100
}

export const ExportLoadingModal: React.FC<ExportLoadingModalProps> = ({
  isOpen,
  message = "Generating your signature in high quality...",
  progress,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-[9998] backdrop-blur-sm animate-in fade-in duration-200" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-2 border-gray-200 overflow-hidden pointer-events-auto animate-in fade-in zoom-in duration-300">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Exporting...</h3>
                <p className="text-sm text-blue-100">{message}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {/* Progress bar */}
            {progress !== undefined && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-right mt-2">{progress}%</p>
              </div>
            )}

            {/* Loading animation */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center">
              This may take a few seconds for ultra-high quality...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

