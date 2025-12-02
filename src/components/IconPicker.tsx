"use client";

import { useState } from "react";

interface IconPickerProps {
  selectedIcon?: string;
  onSelectIcon: (icon: string) => void;
  label?: string;
}

// Icon catalog - Only essential icons for email signatures
const ICON_CATEGORIES = {
  Contact: ["📞", "📱", "✉️", "📧", "📍", "🌐"],
  Social: ["💼", "🔗", "💻", "📸", "📺"],
  Time: ["🕐", "⏰", "📅"],
};

const ALL_ICONS = Object.values(ICON_CATEGORIES).flat();

export default function IconPicker({ selectedIcon, onSelectIcon, label }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Object.keys(ICON_CATEGORIES)];
  const displayIcons = selectedCategory === "All" 
    ? ALL_ICONS 
    : ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES] || [];

  return (
    <div className="relative w-full sm:w-auto">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2.5">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center justify-center w-14 h-12 border-2 rounded-xl transition-all duration-300 text-2xl cursor-pointer hover:scale-105 touch-manipulation ${
            selectedIcon
              ? "border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:border-blue-500 shadow-md shadow-blue-500/20"
              : "border-gray-300 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:border-blue-300"
          }`}
          title="Select icon"
          aria-label="Select icon"
        >
          {selectedIcon ? (
            <span className="text-xl sm:text-2xl transform group-hover:scale-110 transition-transform duration-300">{selectedIcon}</span>
          ) : (
            <span className="material-symbols-outlined text-gray-400 text-lg sm:text-xl group-hover:text-blue-600 transition-colors">add_circle_outline</span>
          )}
        </button>
        {selectedIcon && (
          <button
            type="button"
            onClick={() => onSelectIcon("")}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-200 font-medium flex items-center gap-1 touch-manipulation"
            title="Remove icon"
            aria-label="Remove icon"
          >
            <span className="material-symbols-outlined text-sm sm:text-base">close</span>
            <span className="hidden sm:inline">Remove</span>
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {/* Overlay to close on outside click */}
          <div
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Icon selection panel - Extra large size for maximum visibility */}
          <div 
            className="fixed sm:absolute inset-x-4 sm:inset-x-auto top-auto sm:bottom-full bottom-4 sm:top-auto left-0 right-0 sm:left-0 sm:right-auto sm:mb-2 z-[9999] bg-white border-2 border-gray-300 rounded-2xl shadow-2xl p-5 sm:p-6 w-auto sm:w-full max-w-full sm:max-w-lg h-auto max-h-[70vh] sm:max-h-[520px] overflow-hidden flex flex-col"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-gray-200 flex-shrink-0">
              <span className="text-lg sm:text-xl font-bold text-gray-900">Select Icon</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation flex-shrink-0"
                title="Close"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-gray-600 text-xl">close</span>
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-3 mb-5 overflow-x-auto pb-2 custom-scrollbar flex-shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 text-base font-semibold rounded-xl whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icon grid - Extra large icons with generous spacing */}
            <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {displayIcons.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSelectIcon(icon);
                      setIsOpen(false);
                    }}
                    className={`group relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl sm:text-5xl rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-xl ${
                      selectedIcon === icon
                        ? "bg-blue-600 ring-4 ring-blue-400 shadow-2xl scale-105"
                        : "bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg"
                    }`}
                    title={`Select ${icon}`}
                  >
                    <span>
                      {icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


