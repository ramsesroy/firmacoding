"use client";

import { useState } from "react";

interface IconPickerProps {
  selectedIcon?: string;
  onSelectIcon: (icon: string) => void;
  label?: string;
}

// Catálogo de iconos organizados por categorías (compatibles con emails)
const ICON_CATEGORIES = {
  Comunicación: ["📞", "📱", "✉️", "📧", "💬", "📨", "📮", "📠"],
  Ubicación: ["📍", "🗺️", "🌍", "🏢", "🏠", "🏪", "🏛️", "🚗"],
  Redes: ["🌐", "💼", "🔗", "📱", "💻", "📸", "🎥", "📺"],
  Horarios: ["🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "⏰", "📅", "🗓️"],
  Información: ["ℹ️", "📋", "📝", "📄", "📎", "📌", "⭐", "✅"],
  Otros: ["⚡", "🔥", "💡", "🎯", "🚀", "⭐", "✨", "🎨", "🎭", "🎪", "🎬", "🎤", "🎧", "🎮", "🎲"],
};

const ALL_ICONS = Object.values(ICON_CATEGORIES).flat();

export default function IconPicker({ selectedIcon, onSelectIcon, label }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = ["Todos", ...Object.keys(ICON_CATEGORIES)];
  const displayIcons = selectedCategory === "Todos" 
    ? ALL_ICONS 
    : ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES] || [];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label || "Icono"}
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-12 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-2xl cursor-pointer"
          title="Seleccionar icono"
        >
          {selectedIcon || "🔲"}
        </button>
        {selectedIcon && (
          <button
            type="button"
            onClick={() => onSelectIcon("")}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
            title="Quitar icono"
          >
            Quitar
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel de selección de iconos */}
          <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-full max-w-sm max-h-96 overflow-hidden flex flex-col">
            {/* Categorías */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 border-b border-gray-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid de iconos */}
            <div className="overflow-y-auto flex-1">
              <div className="grid grid-cols-8 gap-2">
                {displayIcons.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSelectIcon(icon);
                      setIsOpen(false);
                    }}
                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg hover:bg-blue-50 transition-colors ${
                      selectedIcon === icon
                        ? "bg-blue-100 ring-2 ring-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    title={`Seleccionar ${icon}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Cerrar */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </div>
  );
}


