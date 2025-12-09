"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreProvider, useStore } from '@/lib/canvas/store';
import { Toolbar } from '@/components/canvas/Toolbar';
import { Canvas } from '@/components/canvas/Canvas';
import { PropertiesPanel } from '@/components/canvas/PropertiesPanel';
import { Actions } from '@/components/canvas/Actions';
import { generateSignatureHTML } from '@/lib/canvas/htmlGenerator';


// Mobile Header Component
const MobileHeader = () => {
  const { state, dispatch } = useStore();
  
  const handleExport = () => {
    const html = generateSignatureHTML(state.rows, state.globalStyles, false);
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between z-30">
      <Link 
        href="/dashboard"
        className="flex items-center gap-2 px-2 py-1.5 text-slate-600 hover:text-slate-800 transition-colors active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </Link>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch({ type: 'UNDO' })}
          disabled={state.past.length === 0}
          className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-30 transition-colors active:scale-95"
          title="Undo"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold text-xs transition-colors active:scale-95"
          title="Export"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default function CanvasEditorPage() {
  const [mobilePanel, setMobilePanel] = useState<'toolbar' | 'properties' | null>(null);

  return (
    <StoreProvider>
      <div className="flex h-screen w-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
        {/* Desktop Layout - Keep as is */}
        <div className="hidden md:flex w-full h-full">
          {/* Toolbar - Desktop */}
          <div className="w-80 flex-shrink-0">
            <Toolbar />
          </div>
          
          {/* Main Canvas Area - Desktop */}
          <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
            <div className="hidden md:block">
              <Actions />
            </div>
            <Canvas />
          </main>

          {/* Properties Panel - Desktop */}
          <div className="w-80 flex-shrink-0">
            <PropertiesPanel />
          </div>
        </div>

        {/* Mobile Layout - Completely redesigned with side drawers */}
        <div className="md:hidden flex flex-col h-full w-full relative overflow-hidden">
          {/* Mobile Header */}
          <MobileHeader />

          {/* Canvas Area - Always visible, takes full space */}
          <div className="flex-1 overflow-auto relative" style={{ minHeight: 0 }}>
            <Canvas />
          </div>

          {/* Floating Action Buttons - Bottom right corner */}
          <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 md:hidden">
            {/* Properties Button */}
            <button
              onClick={() => setMobilePanel(mobilePanel === 'properties' ? null : 'properties')}
              className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95 touch-manipulation ${
                mobilePanel === 'properties'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-white hover:bg-slate-800'
              }`}
              aria-label="Properties"
              title="Properties"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            
            {/* Add Elements Button (Main FAB) */}
            <button
              onClick={() => setMobilePanel(mobilePanel === 'toolbar' ? null : 'toolbar')}
              className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95 touch-manipulation ${
                mobilePanel === 'toolbar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label="Add Elements"
              title="Add Elements"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Side Drawer - Toolbar (Mobile) */}
          <div className={`
            fixed inset-y-0 left-0 z-50
            transform transition-transform duration-300 ease-out
            ${mobilePanel === 'toolbar' ? 'translate-x-0' : '-translate-x-full'}
            md:hidden
            w-[85vw] max-w-sm
          `}>
            <div className="bg-white h-full flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex-shrink-0 px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Add Elements</h2>
                <button
                  onClick={() => setMobilePanel(null)}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 active:scale-95"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Toolbar onClose={() => setMobilePanel(null)} />
              </div>
            </div>
          </div>

          {/* Side Drawer - Properties (Mobile) */}
          <div className={`
            fixed inset-y-0 right-0 z-50
            transform transition-transform duration-300 ease-out
            ${mobilePanel === 'properties' ? 'translate-x-0' : 'translate-x-full'}
            md:hidden
            w-[85vw] max-w-sm
          `}>
            <div className="bg-white h-full flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex-shrink-0 px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Properties</h2>
                <button
                  onClick={() => setMobilePanel(null)}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 active:scale-95"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <PropertiesPanel onClose={() => setMobilePanel(null)} />
              </div>
            </div>
          </div>

          {/* Overlay for side drawers */}
          {mobilePanel && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setMobilePanel(null)}
            />
          )}
        </div>
      </div>
    </StoreProvider>
  );
}
