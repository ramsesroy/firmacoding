"use client";

import { useState } from "react";

interface IconPickerProps {
  selectedIcon?: string;
  onSelectIcon: (icon: string) => void;
  label?: string;
}

// Icon catalog organized by categories (email-compatible emojis)
const ICON_CATEGORIES = {
  Communication: ["📞", "📱", "✉️", "📧", "💬", "📨", "📮", "📠"],
  Location: ["📍", "🗺️", "🌍", "🏢", "🏠", "🏪", "🏛️", "🚗"],
  Social: ["🌐", "💼", "🔗", "📱", "💻", "📸", "🎥", "📺"],
  Time: ["🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "⏰", "📅", "🗓️"],
  Information: ["ℹ️", "📋", "📝", "📄", "📎", "📌", "⭐", "✅"],
  Other: ["⚡", "🔥", "💡", "🎯", "🚀", "⭐", "✨", "🎨", "🎭", "🎪", "🎬", "🎤", "🎧", "🎮", "🎲"],
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
          
          {/* Icon selection panel - Ultra compact design */}
          <div 
            className="fixed sm:absolute inset-x-2 sm:inset-x-auto top-auto sm:top-full bottom-2 sm:bottom-auto left-0 right-0 sm:left-0 sm:right-auto sm:mt-2 z-[9999] bg-white border border-gray-300 rounded-lg shadow-2xl p-2 w-auto sm:w-full max-w-full sm:max-w-sm h-auto max-h-[45vh] sm:max-h-[280px] overflow-hidden flex flex-col backdrop-blur-sm bg-white/98"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-gray-200 flex-shrink-0">
              <span className="text-xs font-semibold text-gray-700">Select Icon</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-0.5 hover:bg-gray-100 rounded transition-colors touch-manipulation flex-shrink-0"
                title="Close"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-gray-500 text-sm">close</span>
              </button>
            </div>

            {/* Compact Categories */}
            <div className="flex gap-1 mb-1.5 overflow-x-auto pb-1 custom-scrollbar -mx-1 px-1 flex-shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Compact Icon grid - More columns for better space usage */}
            <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                {displayIcons.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSelectIcon(icon);
                      setIsOpen(false);
                    }}
                    className={`group relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-base sm:text-lg rounded transition-all duration-200 hover:scale-110 ${
                      selectedIcon === icon
                        ? "bg-blue-600 ring-2 ring-blue-300 shadow-md scale-105"
                        : "bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300"
                    }`}
                    title={`Select ${icon}`}
                  >
                    <span className={selectedIcon === icon ? "drop-shadow-sm" : ""}>
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


