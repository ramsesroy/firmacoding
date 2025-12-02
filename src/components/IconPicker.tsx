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
    <div className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2.5">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center justify-center w-14 h-12 border-2 rounded-xl transition-all duration-200 text-2xl cursor-pointer ${
            selectedIcon
              ? "border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400"
              : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400"
          }`}
          title="Select icon"
        >
          {selectedIcon || (
            <span className="material-symbols-outlined text-gray-400 text-xl">add_circle_outline</span>
          )}
        </button>
        {selectedIcon && (
          <button
            type="button"
            onClick={() => onSelectIcon("")}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-200 font-medium flex items-center gap-1.5"
            title="Remove icon"
          >
            <span className="material-symbols-outlined text-base">close</span>
            <span>Remove</span>
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {/* Overlay to close on outside click */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Icon selection panel */}
          <div className="absolute z-50 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-5 w-full max-w-md max-h-[500px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-blue-600">emoji_emotions</span>
                Select Icon
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-gray-600 text-xl">close</span>
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icon grid */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-8 gap-3">
                {displayIcons.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSelectIcon(icon);
                      setIsOpen(false);
                    }}
                    className={`group w-12 h-12 flex items-center justify-center text-2xl rounded-xl transition-all duration-200 hover:scale-110 ${
                      selectedIcon === icon
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 ring-4 ring-blue-200 shadow-lg scale-110"
                        : "bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
                    }`}
                    title={`Select ${icon}`}
                  >
                    <span className={selectedIcon === icon ? "filter drop-shadow-lg" : ""}>
                      {icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t-2 border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {displayIcons.length} icon{displayIcons.length !== 1 ? "s" : ""} available
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold border-2 border-transparent hover:border-gray-300"
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


