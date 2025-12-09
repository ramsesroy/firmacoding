"use client";

import React, { useState, useRef } from 'react';
import { useStore, useAutosaveStatus } from '@/lib/canvas/store';
import { generateSignatureHTML, exportSignature } from '@/lib/canvas/htmlGenerator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const Actions = () => {
    const { state, dispatch } = useStore();
    const { status: autosaveStatus } = useAutosaveStatus();
    const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
    const [exportTab, setExportTab] = useState<'preview' | 'gmail' | 'outlook'>('preview');
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const handleExport = () => {
        // Generate the HTML for export (Clean version)
        const html = generateSignatureHTML(state.rows, state.globalStyles, false); // False = Keep placeholders
        setHtmlPreview(html);
        setExportTab('preview');
    };

    const handleCopyVisual = async () => {
        if (!htmlPreview || !previewContainerRef.current) return;
        
        try {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(previewContainerRef.current);
            selection?.removeAllRanges();
            selection?.addRange(range);
            
            try {
                // Clipboard API with strict HTML type for best results in Gmail/Outlook
                const blobHtml = new Blob([previewContainerRef.current.innerHTML], { type: 'text/html' });
                const blobText = new Blob([previewContainerRef.current.innerText], { type: 'text/plain' });
                const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
                await navigator.clipboard.write(data);
                alert('Signature copied! Paste directly into Gmail/Outlook signature settings.');
            } catch (err) {
                // Fallback
                document.execCommand('copy');
                alert('Signature copied! Paste directly into Gmail/Outlook.');
            }
            selection?.removeAllRanges();
        } catch (err) {
            console.warn('Copy failed', err);
            alert('Failed to copy. Please manually select and copy.');
        }
    };

    const handleDownloadHTML = () => {
        const fullHtml = exportSignature(state);
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'signature.html';
        link.click();
    };

    const handleDownloadPNG = async () => {
        if (!previewContainerRef.current) return;
        const element = previewContainerRef.current;
        try {
            // Type cast includes scale option which is valid but not in TypeScript types
            const canvas = await html2canvas(element, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: null,
                logging: false,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            } as Parameters<typeof html2canvas>[1] & { scale?: number });
            
            // Get the actual content bounds by finding non-transparent pixels
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let minX = canvas.width;
            let minY = canvas.height;
            let maxX = 0;
            let maxY = 0;
            
            // Find bounding box of non-transparent pixels
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const alpha = data[(y * canvas.width + x) * 4 + 3];
                    if (alpha > 0) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            
            // Add small padding (20px scaled)
            const padding = 40; // 20px * scale 2
            minX = Math.max(0, minX - padding);
            minY = Math.max(0, minY - padding);
            maxX = Math.min(canvas.width, maxX + padding);
            maxY = Math.min(canvas.height, maxY + padding);
            
            const width = maxX - minX;
            const height = maxY - minY;
            
            // Create new canvas with cropped content
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = width;
            croppedCanvas.height = height;
            const croppedCtx = croppedCanvas.getContext('2d');
            if (!croppedCtx) throw new Error('Could not get cropped canvas context');
            
            croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
            
            const link = document.createElement('a');
            link.download = 'signature.png';
            link.href = croppedCanvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('PNG export error:', error);
            alert("Could not generate PNG.");
        }
    };

    const handleDownloadPDF = async () => {
        if (!previewContainerRef.current) return;
        const element = previewContainerRef.current;
        try {
            // Type cast includes scale option which is valid but not in TypeScript types
            const canvas = await html2canvas(element, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: null, 
                logging: false,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            } as Parameters<typeof html2canvas>[1] & { scale?: number });
            
            // Get the actual content bounds by finding non-transparent pixels
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let minX = canvas.width;
            let minY = canvas.height;
            let maxX = 0;
            let maxY = 0;
            
            // Find bounding box of non-transparent pixels
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const alpha = data[(y * canvas.width + x) * 4 + 3];
                    if (alpha > 0) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            
            // Add small padding (20px scaled)
            const padding = 40; // 20px * scale 2
            minX = Math.max(0, minX - padding);
            minY = Math.max(0, minY - padding);
            maxX = Math.min(canvas.width, maxX + padding);
            maxY = Math.min(canvas.height, maxY + padding);
            
            const width = maxX - minX;
            const height = maxY - minY;
            
            // Create new canvas with cropped content
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = width;
            croppedCanvas.height = height;
            const croppedCtx = croppedCanvas.getContext('2d');
            if (!croppedCtx) throw new Error('Could not get cropped canvas context');
            
            croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
            
            const imgData = croppedCanvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: width > height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [width, height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save('signature.pdf');
        } catch (error) {
            console.error('PDF export error:', error);
            alert("Could not generate PDF.");
        }
    };

    return (
        <>
            {/* Top Bar with Undo/Redo & Export - Desktop only (mobile handled in page.tsx) */}
            <div className="hidden md:flex absolute top-2 sm:top-4 md:top-6 right-2 sm:right-4 md:right-6 z-20 gap-2 sm:gap-2 md:gap-3 flex-wrap justify-end items-center">
                {/* Autosave Status Indicator */}
                {autosaveStatus !== 'idle' && (
                    <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium ${
                        autosaveStatus === 'saving' 
                            ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                            : 'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                        {autosaveStatus === 'saving' ? (
                            <>
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                <span className="hidden sm:inline">Saving...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="hidden sm:inline">Saved</span>
                            </>
                        )}
                    </div>
                )}
                 {/* Clear Canvas Button - Improved for mobile */}
                 <button 
                    onClick={() => {
                        if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
                            dispatch({ type: 'RESET_CANVAS' });
                        }
                    }}
                    className="p-3 sm:p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl sm:rounded-md transition-all active:scale-95 touch-manipulation bg-white border-2 border-red-200 shadow-lg sm:shadow-sm"
                    title="Clear Canvas"
                    aria-label="Clear Canvas"
                >
                    <svg className="w-5 h-5 sm:w-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>

                <div className="flex bg-white rounded-xl sm:rounded-lg shadow-lg sm:shadow-sm border-2 sm:border border-slate-200 p-1">
                    <button 
                        onClick={() => dispatch({ type: 'UNDO' })}
                        disabled={state.past.length === 0}
                        className="p-3 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg sm:rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95 touch-manipulation"
                        title="Undo"
                        aria-label="Undo"
                    >
                        <svg className="w-5 h-5 sm:w-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    </button>
                    <div className="w-px bg-slate-200 my-1 mx-1"></div>
                    <button 
                        onClick={() => dispatch({ type: 'REDO' })}
                        disabled={state.future.length === 0}
                        className="p-3 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg sm:rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95 touch-manipulation"
                        title="Redo"
                        aria-label="Redo"
                    >
                        <svg className="w-5 h-5 sm:w-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
                    </button>
                </div>

                <button 
                    onClick={handleExport}
                    className="bg-slate-900 hover:bg-black text-white px-4 sm:px-3 md:px-5 py-2.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-lg shadow-lg hover:shadow-xl font-semibold text-xs sm:text-xs md:text-sm transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 sm:gap-1.5 md:gap-2 whitespace-nowrap touch-manipulation"
                >
                    <span className="hidden sm:inline">Export Signature</span>
                    <span className="sm:hidden">Export</span>
                    <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
            </div>

            {htmlPreview && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden transform transition-all scale-100">
                        
                        {/* Modal Header */}
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div className="min-w-0 flex-1 pr-2">
                                <h3 className="font-bold text-base sm:text-xl text-slate-800 truncate">Export Signature</h3>
                                <p className="text-xs sm:text-sm text-slate-500 truncate">Your signature is generated and email-ready.</p>
                            </div>
                            <button onClick={() => setHtmlPreview(null)} className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 p-1.5 sm:p-2 rounded-full hover:bg-slate-100 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex border-b border-slate-200 px-2 sm:px-6 overflow-x-auto">
                            <button 
                                onClick={() => setExportTab('preview')}
                                className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${exportTab === 'preview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <span className="hidden sm:inline">Preview & Download</span>
                                <span className="sm:hidden">Preview</span>
                            </button>
                            <button 
                                onClick={() => setExportTab('gmail')}
                                className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${exportTab === 'gmail' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <span className="hidden sm:inline">Gmail Instructions</span>
                                <span className="sm:hidden">Gmail</span>
                            </button>
                            <button 
                                onClick={() => setExportTab('outlook')}
                                className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${exportTab === 'outlook' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                <span className="hidden sm:inline">Outlook Instructions</span>
                                <span className="sm:hidden">Outlook</span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-auto bg-slate-50/50 flex flex-col p-4 sm:p-6 md:p-8">
                            
                            {exportTab === 'preview' && (
                                <div className="flex flex-col items-center">
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 w-full max-w-2xl">
                                        <button 
                                            onClick={handleCopyVisual}
                                            className="col-span-2 sm:col-span-2 md:col-span-1 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-1 active:scale-95 group"
                                        >
                                            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">📋</span> 
                                            <span className="text-center">Copy to Clipboard</span>
                                        </button>
                                        <button 
                                            onClick={handleDownloadHTML}
                                            className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-white text-slate-700 border border-slate-200 px-3 sm:px-4 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all active:scale-95"
                                        >
                                            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">💾</span> 
                                            <span className="font-medium text-xs sm:text-sm text-center">HTML File</span>
                                        </button>
                                        <button 
                                            onClick={handleDownloadPNG}
                                            className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-white text-slate-700 border border-slate-200 px-3 sm:px-4 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all active:scale-95"
                                        >
                                            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">🖼️</span> 
                                            <span className="font-medium text-xs sm:text-sm text-center">PNG Image</span>
                                        </button>
                                        <button 
                                            onClick={handleDownloadPDF}
                                            className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-white text-slate-700 border border-slate-200 px-3 sm:px-4 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all active:scale-95"
                                        >
                                            <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">📄</span> 
                                            <span className="font-medium text-xs sm:text-sm text-center">PDF File</span>
                                        </button>
                                    </div>

                                    {/* Preview Card */}
                                    <div className="w-full flex justify-center mb-2 sm:mb-4 px-2">
                                        <div className="bg-white shadow-2xl shadow-slate-200/50 rounded-lg sm:rounded-xl p-4 sm:p-8 md:p-12 overflow-auto border border-slate-100 w-full max-w-full">
                                            <div 
                                                ref={previewContainerRef}
                                                className="inline-block min-w-[250px] sm:min-w-[300px]"
                                                style={{ 
                                                    width: 'fit-content',
                                                    maxWidth: '100%'
                                                }}
                                                dangerouslySetInnerHTML={{ __html: htmlPreview }} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {exportTab === 'gmail' && (
                                <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-2">
                                    <div className="flex items-start gap-2 sm:gap-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-xs sm:text-sm">1</div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm sm:text-base text-slate-800">Copy the Signature</h4>
                                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Click the <span className="font-semibold text-blue-600">"Copy to Clipboard"</span> button in the Preview tab.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-xs sm:text-sm">2</div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm sm:text-base text-slate-800">Go to Gmail Settings</h4>
                                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Open Gmail, click the Gear icon (⚙️) &gt; <span className="font-semibold">See all settings</span>.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-xs sm:text-sm">3</div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm sm:text-base text-slate-800">Paste & Save</h4>
                                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Scroll down to the <span className="font-semibold">Signature</span> section. Create a new one or edit existing.</p>
                                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Paste (Ctrl+V or Cmd+V) into the text box. Then scroll to the bottom and click <span className="font-semibold">Save Changes</span>.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {exportTab === 'outlook' && (
                                <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-2">
                                    <div className="flex items-start gap-2 sm:gap-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-xs sm:text-sm">1</div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm sm:text-base text-slate-800">Copy the Signature</h4>
                                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Click the <span className="font-semibold text-blue-600">"Copy to Clipboard"</span> button in the Preview tab.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-xs sm:text-sm">2</div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm sm:text-base text-slate-800">Open Outlook Signatures</h4>
                                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Go to <span className="font-semibold">File &gt; Options &gt; Mail &gt; Signatures</span>.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-xs sm:text-sm">3</div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm sm:text-base text-slate-800">Paste & Save</h4>
                                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Select your signature to edit, then Paste (Ctrl+V) the design into the edit box. Click OK to save.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
