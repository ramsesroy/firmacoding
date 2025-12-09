"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/canvas/store';
import { generateSignatureHTML, exportSignature } from '@/lib/canvas/htmlGenerator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface MobileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileExportModal: React.FC<MobileExportModalProps> = ({ isOpen, onClose }) => {
  const { state } = useStore();
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewParentRef = useRef<HTMLDivElement>(null);

  // Generate preview when modal opens
  useEffect(() => {
    if (isOpen && !htmlPreview) {
      const html = generateSignatureHTML(state.rows, state.globalStyles, false);
      setHtmlPreview(html);
      // Wait for DOM to update
      setTimeout(() => {
        if (previewContainerRef.current) {
          // Force reflow
          previewContainerRef.current.offsetHeight;
        }
      }, 100);
    }
  }, [isOpen, htmlPreview, state.rows, state.globalStyles]);

  const handleCopyVisual = async () => {
    if (!htmlPreview || !previewContainerRef.current) return;
    
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(previewContainerRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      try {
        const blobHtml = new Blob([previewContainerRef.current.innerHTML], { type: 'text/html' });
        const blobText = new Blob([previewContainerRef.current.innerText], { type: 'text/plain' });
        const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
        await navigator.clipboard.write(data);
        alert('Signature copied! Paste directly into Gmail/Outlook signature settings.');
      } catch (err) {
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
    if (!previewContainerRef.current || !previewParentRef.current) {
      alert("Please wait for the preview to load.");
      return;
    }
    
    const element = previewContainerRef.current;
    const parent = previewParentRef.current;
    
    try {
      // Make element visible and properly positioned for html2canvas
      if (parent) {
        parent.style.position = 'relative';
        parent.style.width = '600px';
        parent.style.height = 'auto';
        parent.style.opacity = '1';
        parent.style.visibility = 'visible';
        parent.style.left = '0';
        parent.style.top = '0';
        parent.style.zIndex = '1';
      }
      
      // Force consistent dimensions for export
      const fixedWidth = 600;
      const originalWidth = element.style.width || '';
      const originalMaxWidth = element.style.maxWidth || '';
      const originalMinWidth = element.style.minWidth || '';
      
      element.style.width = `${fixedWidth}px`;
      element.style.maxWidth = `${fixedWidth}px`;
      element.style.minWidth = `${fixedWidth}px`;
      element.style.visibility = 'visible';
      element.style.opacity = '1';
      
      // Wait for styles to apply and images to load
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure element is in viewport for html2canvas
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('Element not properly rendered');
      }
      
      const canvas = await html2canvas(element, { 
        scale: 3,
        useCORS: true, 
        backgroundColor: null,
        logging: false,
        allowTaint: false,
        removeContainer: false,
      } as Parameters<typeof html2canvas>[1] & { scale?: number });
      
      // Restore styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.minWidth = originalMinWidth;
      
      // Get content bounds
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      
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
      
      const padding = 60;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);
      
      const width = maxX - minX;
      const height = maxY - minY;
      
      if (width <= 0 || height <= 0) {
        throw new Error('Invalid canvas dimensions');
      }
      
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) throw new Error('Could not get cropped canvas context');
      
      croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
      
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = croppedCanvas.toDataURL('image/png', 1.0);
      link.click();
      
      alert('PNG downloaded successfully!');
    } catch (error) {
      console.error('PNG export error:', error);
      alert("Could not generate PNG. Please try again.");
    } finally {
      // Restore original styles
      if (previewContainerRef.current) {
        const el = previewContainerRef.current;
        el.style.width = '';
        el.style.maxWidth = '';
        el.style.minWidth = '';
        el.style.visibility = '';
        el.style.opacity = '';
      }
      if (parent) {
        parent.style.position = '';
        parent.style.width = '';
        parent.style.height = '';
        parent.style.opacity = '0';
        parent.style.visibility = '';
        parent.style.left = '';
        parent.style.top = '';
        parent.style.zIndex = '';
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewContainerRef.current || !previewParentRef.current) {
      alert("Please wait for the preview to load.");
      return;
    }
    
    const element = previewContainerRef.current;
    const parent = previewParentRef.current;
    
    try {
      // Make element visible and properly positioned for html2canvas
      if (parent) {
        parent.style.position = 'relative';
        parent.style.width = '600px';
        parent.style.height = 'auto';
        parent.style.opacity = '1';
        parent.style.visibility = 'visible';
        parent.style.left = '0';
        parent.style.top = '0';
        parent.style.zIndex = '1';
      }
      
      const fixedWidth = 600;
      const originalWidth = element.style.width || '';
      const originalMaxWidth = element.style.maxWidth || '';
      const originalMinWidth = element.style.minWidth || '';
      
      element.style.width = `${fixedWidth}px`;
      element.style.maxWidth = `${fixedWidth}px`;
      element.style.minWidth = `${fixedWidth}px`;
      element.style.visibility = 'visible';
      element.style.opacity = '1';
      
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure element is in viewport for html2canvas
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('Element not properly rendered');
      }
      
      const canvas = await html2canvas(element, { 
        scale: 3,
        useCORS: true, 
        backgroundColor: null, 
        logging: false,
        allowTaint: false,
        removeContainer: false,
      } as Parameters<typeof html2canvas>[1] & { scale?: number });
      
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.minWidth = originalMinWidth;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      
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
      
      const padding = 60;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);
      
      const width = maxX - minX;
      const height = maxY - minY;
      
      if (width <= 0 || height <= 0) {
        throw new Error('Invalid canvas dimensions');
      }
      
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) throw new Error('Could not get cropped canvas context');
      
      croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
      
      const imgData = croppedCanvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width, height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('signature.pdf');
      
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      // Restore original styles
      if (previewContainerRef.current) {
        const el = previewContainerRef.current;
        el.style.width = '';
        el.style.maxWidth = '';
        el.style.minWidth = '';
        el.style.visibility = '';
        el.style.opacity = '';
      }
      if (parent) {
        parent.style.position = '';
        parent.style.width = '';
        parent.style.height = '';
        parent.style.opacity = '0';
        parent.style.visibility = '';
        parent.style.left = '';
        parent.style.top = '';
        parent.style.zIndex = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Export Signature</h3>
            <p className="text-xs text-slate-500 mt-0.5">Choose export format</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 p-2 rounded-full hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview (hidden but rendered for export) - Must be in viewport for html2canvas */}
        <div 
          ref={previewParentRef}
          className="absolute opacity-0 pointer-events-none overflow-hidden"
          style={{ 
            left: '0',
            top: '0',
            width: '600px',
            height: 'auto',
            minHeight: '200px',
            zIndex: -1
          }}
        >
          {htmlPreview && (
            <div 
              ref={previewContainerRef}
              className="inline-block"
              style={{ 
                width: '600px',
                maxWidth: '100%',
                minWidth: '300px',
                visibility: 'visible',
                display: 'inline-block',
                position: 'relative'
              }}
              dangerouslySetInnerHTML={{ __html: htmlPreview }} 
            />
          )}
        </div>

        {/* Export Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <button 
            onClick={handleCopyVisual}
            className="w-full flex items-center gap-3 bg-blue-600 text-white px-4 py-4 rounded-xl hover:bg-blue-700 shadow-lg font-semibold transition-all active:scale-95"
          >
            <span className="text-2xl">📋</span>
            <div className="text-left flex-1">
              <div className="font-bold">Copy to Clipboard</div>
              <div className="text-xs text-blue-100">Paste into Gmail/Outlook</div>
            </div>
          </button>

          <button 
            onClick={handleDownloadHTML}
            className="w-full flex items-center gap-3 bg-white text-slate-700 border-2 border-slate-200 px-4 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95"
          >
            <span className="text-2xl">💾</span>
            <div className="text-left flex-1">
              <div className="font-bold">Download HTML</div>
              <div className="text-xs text-slate-500">HTML file format</div>
            </div>
          </button>

          <button 
            onClick={handleDownloadPNG}
            className="w-full flex items-center gap-3 bg-white text-slate-700 border-2 border-slate-200 px-4 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95"
          >
            <span className="text-2xl">🖼️</span>
            <div className="text-left flex-1">
              <div className="font-bold">Download PNG</div>
              <div className="text-xs text-slate-500">High quality image</div>
            </div>
          </button>

          <button 
            onClick={handleDownloadPDF}
            className="w-full flex items-center gap-3 bg-white text-slate-700 border-2 border-slate-200 px-4 py-4 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95"
          >
            <span className="text-2xl">📄</span>
            <div className="text-left flex-1">
              <div className="font-bold">Download PDF</div>
              <div className="text-xs text-slate-500">PDF document format</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
