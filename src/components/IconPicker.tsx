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
          
          {/* Icon selection panel - Responsive: modal on mobile, dropdown on desktop */}
          <div 
            className="fixed sm:absolute inset-x-4 sm:inset-x-auto bottom-4 sm:top-full sm:bottom-auto sm:mt-2 sm:left-0 sm:right-auto z-[9999] bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-4 sm:p-5 w-auto sm:w-full max-w-full sm:max-w-md max-h-[85vh] sm:max-h-[500px] overflow-hidden flex flex-col backdrop-blur-sm bg-white/95"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 border-b-2 border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg sm:text-xl text-blue-600">emoji_emotions</span>
                <span className="hidden sm:inline">Select Icon</span>
                <span className="sm:hidden">Icons</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-1.5 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                title="Close"
                aria-label="Close icon picker"
              >
                <span className="material-symbols-outlined text-gray-600 text-lg sm:text-xl">close</span>
              </button>
            </div>

            {/* Categories - Responsive scroll */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar -mx-1 px-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icon grid - Responsive columns */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 sm:gap-3">
                {displayIcons.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSelectIcon(icon);
                      setIsOpen(false);
                    }}
                    className={`group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                      selectedIcon === icon
                        ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 ring-2 sm:ring-4 ring-blue-300 ring-offset-1 sm:ring-offset-2 shadow-xl scale-110 transform rotate-3"
                        : "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg"
                    }`}
                    style={selectedIcon === icon ? {
                      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4), 0 4px 6px -2px rgba(59, 130, 246, 0.3)'
                    } : {}}
                    title={`Select ${icon}`}
                  >
                    <span className={`transition-all duration-300 ${selectedIcon === icon ? "filter drop-shadow-xl transform scale-110" : "group-hover:scale-110"}`}>
                      {icon}
                    </span>
                    {selectedIcon === icon && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t-2 border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
              <p className="text-xs text-gray-500 text-center sm:text-left">
                {displayIcons.length} icon{displayIcons.length !== 1 ? "s" : ""} available
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-lg shadow-blue-500/30 touch-manipulation"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


