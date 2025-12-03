"use client";

import React from "react";

interface WatermarkProps {
  enabled?: boolean;
}

export const Watermark: React.FC<WatermarkProps> = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"
      style={{
        background: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(255,255,255,0.1) 100px, rgba(255,255,255,0.1) 200px)',
      }}
    >
      {/* Logo marca de agua */}
      <div 
        className="absolute inset-0 flex items-center justify-center opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='80' viewBox='0 0 200 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='50' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='%23636363'%3ESignature For Me%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 150px',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Overlay semi-transparent */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
      
      {/* Larger central logo */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-2 border-gray-300/50 transform rotate-[-5deg]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}>
              draw
            </span>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Signature</div>
            <div className="text-sm font-semibold text-blue-600 -mt-1">For Me</div>
          </div>
        </div>
      </div>
      
      {/* Upgrade message */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-blue-600/95 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-2xl border-2 border-blue-400/50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined">lock</span>
          <span className="font-semibold text-sm">Upgrade to unlock this template</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </div>
      </div>
    </div>
  );
};

