"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreProvider } from '@/lib/canvas/store';
import { Toolbar } from '@/components/canvas/Toolbar';
import { Canvas } from '@/components/canvas/Canvas';
import { PropertiesPanel } from '@/components/canvas/PropertiesPanel';
import { Actions } from '@/components/canvas/Actions';

export default function CanvasEditorPage() {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showProperties, setShowProperties] = useState(false);

  return (
    <StoreProvider>
      <div className="flex h-screen w-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
        {/* Back to Dashboard Button */}
        <div className="absolute top-4 left-4 z-30">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-blue-300 transition-colors text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Buttons */}
        <div className="fixed top-3 sm:top-4 right-3 sm:right-4 z-40 flex gap-1.5 sm:gap-2 md:hidden">
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            title="Toggle Toolbar"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setShowProperties(!showProperties)}
            className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            title="Toggle Properties"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
        
        {/* Toolbar - Hidden on mobile, shown as drawer when toggled */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${showToolbar ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          <div className="relative h-full bg-white md:bg-transparent">
            <Toolbar onClose={() => setShowToolbar(false)} />
          </div>
        </div>
        
        {/* Overlay for mobile - must be above panels but below modals */}
        {(showToolbar || showProperties) && (
          <div 
            className="fixed inset-0 bg-black/50 z-[35] md:hidden"
            onClick={() => {
              setShowToolbar(false);
              setShowProperties(false);
            }}
          />
        )}

        {/* Main Canvas Area */}
        <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
          <Actions />
          <Canvas />
        </main>

        {/* Properties Panel - Hidden on mobile, shown as drawer when toggled */}
        <div className={`
          fixed md:static inset-y-0 right-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${showProperties ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0
        `}>
          <div className="relative h-full bg-white md:bg-transparent">
            <PropertiesPanel onClose={() => setShowProperties(false)} />
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}
