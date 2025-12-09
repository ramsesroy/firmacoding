"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/canvas/store';
import { SignatureRow, SignatureColumn, SignatureElement } from '@/types/canvas';

// We import the icons via URL in the renderer, so no local imports needed for assets.

const ElementRenderer: React.FC<{ element: SignatureElement; isSelected: boolean }> = ({ element, isSelected }) => {
  const { dispatch, state } = useStore();
  const { globalStyles } = state;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT_ITEM', id: element.id, itemType: 'element' });
  };

  const handleDragStart = (e: React.DragEvent) => {
      e.stopPropagation();
      e.dataTransfer.setData('dragId', element.id);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const dragId = e.dataTransfer.getData('dragId');
      // If dragId exists, it means we are moving an existing element
      if (dragId && dragId !== element.id) {
          dispatch({ type: 'MOVE_ELEMENT', dragId, targetId: element.id, targetType: 'element' });
      }
      // If not, maybe it's a new element drop, handled by Column
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
  };

  // Sanitization for Preview (Basic XSS protection)
  const sanitizeHTML = (html: string) => {
      return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                 .replace(/on\w+="[^"]*"/g, "");
  };

  // Preview Mode: Replace placeholders with dummy data for visual feedback
  const getPreviewContent = (text: string) => {
    return text
      .replace(/{{name}}/gi, 'John Doe')
      .replace(/{{role}}/gi, 'Managing Director')
      .replace(/{{company}}/gi, 'Acme Corp')
      .replace(/{{email}}/gi, 'john@acme.com')
      .replace(/{{phone}}/gi, '555-0123');
  };

  const style: React.CSSProperties = {
    ...element.style,
    width: element.style.width ? (typeof element.style.width === 'number' ? `${element.style.width}px` : element.style.width) : 'auto',
    height: element.style.height ? (typeof element.style.height === 'number' ? `${element.style.height}px` : element.style.height) : 'auto',
    cursor: 'grab',
    border: isSelected ? '2px solid #3b82f6' : '1px dashed transparent', // Invisible border unless selected
    textTransform: element.style.uppercase ? 'uppercase' : 'none',
    letterSpacing: element.style.letterSpacing,
    fontFamily: element.style.fontFamily || globalStyles.fontFamily, 
    color: element.style.color || globalStyles.textColor, 
    fontStyle: element.style.fontStyle as any,
    textDecoration: element.style.textDecoration,
    WebkitFontSmoothing: 'antialiased', // Premium rendering
    MozOsxFontSmoothing: 'grayscale',
  };

  // Combined spacing style for wrapper div to simulate table cell padding
  const wrapperStyle: React.CSSProperties = {
      paddingTop: element.style.paddingTop,
      paddingBottom: element.style.paddingBottom,
      paddingLeft: element.style.paddingLeft,
      paddingRight: element.style.paddingRight,
      textAlign: element.style.textAlign as any || 'left',
  };

  const commonProps = {
      onClick: handleClick,
      draggable: true,
      onDragStart: handleDragStart,
      onDrop: handleDrop,
      onDragOver: handleDragOver,
  };

  if (element.type === 'image') {
    return (
      <div {...commonProps} className={`relative group transition-all duration-200 ${isSelected ? '' : 'hover:ring-1 hover:ring-blue-300'}`} style={wrapperStyle}>
        <img 
          src={element.content} 
          alt={element.alt} 
          style={{ 
            width: element.style.width ? (typeof element.style.width === 'number' ? `${element.style.width}px` : element.style.width) : '100%', 
            borderRadius: element.style.borderRadius,
            backgroundColor: element.style.backgroundColor,
            display: 'inline-block' 
          }} 
        />
        {!isSelected && <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors pointer-events-none"></div>}
      </div>
    );
  }

  if (element.type === 'button') {
    return (
        <div {...commonProps} className={`inline-block transition-all duration-200 ${isSelected ? '' : 'hover:opacity-90'}`} style={{ width: style.width, ...wrapperStyle }}>
             <button style={{
                 backgroundColor: element.style.backgroundColor || globalStyles.themeColor || '#000',
                 color: element.style.color || '#fff',
                 padding: element.style.padding || '10px 20px',
                 borderRadius: element.style.borderRadius || 4,
                 fontSize: element.style.fontSize || 14,
                 border: 'none',
                 width: '100%',
                 cursor: 'pointer',
                 fontFamily: globalStyles.fontFamily,
                 fontWeight: 'bold'
             }}>
                 {getPreviewContent(element.content)}
             </button>
        </div>
    );
  }

  if (element.type === 'social') {
      return (
          <div {...commonProps} style={{...style, display: 'flex', gap: '5px', ...wrapperStyle, flexDirection: 'row', justifyContent: style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start'}} className={`transition-all duration-200 ${isSelected ? '' : 'hover:ring-1 hover:ring-blue-300'} p-1 -m-1 rounded`}>
              {(element.socialLinks || []).map((link, i) => {
                  let iconName = link.network.toLowerCase();
                  if (iconName === 'x' || iconName === 'twitter') iconName = 'twitterx';
                  else if (iconName === 'linkedin') iconName = 'linkedin';
                  else if (iconName === 'facebook') iconName = 'facebook';
                  else if (iconName === 'instagram') iconName = 'instagram-new';
                  else if (iconName === 'youtube') iconName = 'youtube-play';
                  else if (iconName === 'pinterest') iconName = 'pinterest';
                  else if (iconName === 'tiktok') iconName = 'tiktok';
                  else if (iconName === 'whatsapp') iconName = 'whatsapp';
                  else if (iconName === 'telegram') iconName = 'telegram-app';
                  else if (iconName === 'github') iconName = 'github';
                  else if (iconName === 'website') iconName = 'globe';
                  
                  return (
                      <div key={i} className="flex-shrink-0">
                          <img 
                              src={`https://img.icons8.com/ios-glyphs/30/000000/${iconName}.png`}
                              alt={link.network}
                              className="w-6 h-6 block"
                          />
                      </div>
                  );
              })}
              {(!element.socialLinks || element.socialLinks.length === 0) && (
                <span className="text-slate-400 text-xs p-2 border border-dashed border-slate-300 w-full block text-center rounded bg-slate-50">Add Social Links</span>
              )}
          </div>
      );
  }

  return (
    <div {...commonProps} style={{...style, ...wrapperStyle}} className={`transition-all duration-200 ${isSelected ? '' : 'hover:bg-blue-50/50 hover:ring-1 hover:ring-blue-300'} rounded-sm`}>
      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(getPreviewContent(element.content || 'Empty Text')) }} />
    </div>
  );
};

const ColumnRenderer: React.FC<{ col: SignatureColumn; isSelected: boolean }> = ({ col, isSelected }) => {
  const { dispatch, state } = useStore();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragId = e.dataTransfer.getData('dragId');
    const elementType = e.dataTransfer.getData('elementType') as any;

    if (dragId) {
        // Move existing element to this column (append)
        dispatch({ type: 'MOVE_ELEMENT', dragId, targetId: col.id, targetType: 'column' });
    } else if (elementType) {
        // Add new element
        dispatch({ type: 'ADD_ELEMENT', columnId: col.id, elementType });
    }
  };

  const style: React.CSSProperties = {
      width: `${col.widthPercent}%`, 
      verticalAlign: col.verticalAlign,
      padding: `${col.style.paddingTop || 0}px ${col.style.paddingRight || 0}px ${col.style.paddingBottom || 0}px ${col.style.paddingLeft || 0}px`,
      border: isSelected ? '1px solid #3b82f6' : '1px dashed transparent',
      backgroundColor: col.style.backgroundColor,
      height: col.style.height ? (typeof col.style.height === 'number' ? `${col.style.height}px` : col.style.height) : 'auto',
      borderLeft: col.style.borderLeft,
      borderRight: col.style.borderRight,
      borderTop: col.style.borderTop,
      fontFamily: state.globalStyles.fontFamily,
      color: state.globalStyles.textColor,
  };

  return (
    <td 
        className={`relative transition-all duration-200 ${isSelected ? 'bg-blue-50/40' : 'hover:border-slate-300'} border border-transparent`}
        style={style}
        onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: 'SELECT_ITEM', id: col.id, itemType: 'column' });
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
    >
      {col.elements.length === 0 && (
          <div className="text-[9px] sm:text-[10px] text-slate-300 text-center py-6 sm:py-8 pointer-events-none uppercase tracking-widest font-medium border-2 border-dashed border-slate-100 rounded m-0.5 sm:m-1">
              Drop Element
          </div>
      )}
      {col.elements.map(el => (
          <div key={el.id} className="mb-0">
             <ElementRenderer element={el} isSelected={state.selectedId === el.id} />
          </div>
      ))}
    </td>
  );
};

const RowRenderer: React.FC<{ row: SignatureRow }> = ({ row }) => {
  const { state, dispatch } = useStore();
  const isSelected = state.selectedId === row.id;

  const style: React.CSSProperties = {
      paddingTop: row.style.paddingTop,
      paddingBottom: row.style.paddingBottom,
      paddingLeft: row.style.paddingLeft,
      paddingRight: row.style.paddingRight,
      backgroundColor: row.style.backgroundColor,
      borderTop: row.style.borderTop,
      borderBottom: row.style.borderBottom,
      borderLeft: row.style.borderLeft,
      borderRight: row.style.borderRight,
      border: row.style.border,
      borderRadius: row.style.borderRadius,
  };

  return (
    <div 
        className={`relative group transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 z-10 rounded-sm' : 'hover:ring-1 hover:ring-slate-300'}`}
        onClick={() => dispatch({ type: 'SELECT_ITEM', id: row.id, itemType: 'row' })}
    >
        <table className="w-full border-collapse" style={style}>
            <tbody>
                <tr>
                    {row.columns.map(col => (
                        <ColumnRenderer 
                            key={col.id} 
                            col={col} 
                            isSelected={state.selectedId === col.id} 
                        />
                    ))}
                </tr>
            </tbody>
        </table>
        
        {/* Row Actions - Desktop: Hidden on mobile, shown on hover/select */}
        <div className={`absolute -right-10 sm:-right-12 top-0 hidden md:flex ${isSelected ? 'flex' : 'group-hover:flex'} flex-col gap-1.5 sm:gap-2 animate-in fade-in zoom-in duration-200`}>
            {/* Delete Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_ITEM', id: row.id }); }}
                className="p-1.5 sm:p-2 bg-white border border-slate-200 text-red-500 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors"
                title="Delete Row"
            >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            {/* Duplicate Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DUPLICATE_ITEM', id: row.id, itemType: 'row' }); }}
                className="p-1.5 sm:p-2 bg-white border border-slate-200 text-blue-500 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
                title="Duplicate Row"
            >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            </button>
        </div>
        
        {/* Mobile Row Actions - Bottom bar when selected */}
        {isSelected && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-2xl z-50 p-3 flex gap-3 items-center justify-center">
                <button 
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DUPLICATE_ITEM', id: row.id, itemType: 'row' }); }}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 touch-manipulation shadow-lg"
                    aria-label="Duplicate Row"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    <span>Duplicate</span>
                </button>
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if (confirm('Delete this row?')) {
                            dispatch({ type: 'DELETE_ITEM', id: row.id }); 
                        }
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 touch-manipulation shadow-lg"
                    aria-label="Delete Row"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    <span>Delete</span>
                </button>
            </div>
        )}
    </div>
  );
};

// --- CLIENT SIMULATORS ---

type PreviewMode = 'gmail' | 'outlook' | 'apple' | 'yahoo';

const GmailHeader = ({ darkMode }: { darkMode: boolean }) => (
    <div className={`border-b ${darkMode ? 'border-slate-700 bg-[#1f1f1f]' : 'border-slate-200 bg-white'}`}>
        <div className={`flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2 ${darkMode ? 'bg-[#2d2d2d]' : 'bg-[#f6f8fc]'}`}>
             <div className="flex items-center gap-2 sm:gap-4">
                 <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
                 <div className={`h-1.5 sm:h-2 w-20 sm:w-32 rounded ${darkMode ? 'bg-slate-600' : 'bg-slate-200'}`}></div>
             </div>
        </div>
        <div className="p-2 sm:p-4 pb-1 sm:pb-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm sm:text-lg shadow-sm flex-shrink-0">J</div>
                 <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2">
                          <span className={`font-bold text-xs sm:text-sm truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>John Doe</span>
                          <span className={`text-[10px] sm:text-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>&lt;john@acme.com&gt;</span>
                      </div>
                      <div className={`text-[10px] sm:text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>to me <span className="text-[9px]">▼</span></div>
                 </div>
            </div>
            <div className={`h-px w-full mb-2 sm:mb-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
        </div>
    </div>
);

const OutlookHeader = ({ darkMode }: { darkMode: boolean }) => (
    <div className={darkMode ? 'bg-[#333]' : 'bg-white'}>
        <div className="bg-[#0078d4] h-8 sm:h-10 flex items-center px-2 sm:px-4 justify-between">
             <div className="flex gap-2 sm:gap-4">
                 <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-white/20 rounded"></div>
                 <div className="w-8 sm:w-12 h-1.5 sm:h-2 bg-white/20 rounded"></div>
             </div>
        </div>
        <div className={`border-b p-1.5 sm:p-2 flex gap-1 sm:gap-2 ${darkMode ? 'bg-[#2b2b2b] border-[#444]' : 'bg-[#f3f2f1] border-[#edebe9]'}`}>
            <div className={`border px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold shadow-sm ${darkMode ? 'bg-[#333] border-[#444] text-blue-400' : 'bg-white border-[#edebe9] text-[#0078d4]'}`}>Send</div>
            <div className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Attach</div>
        </div>
        <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
             <div className={`flex border-b pb-1 text-xs sm:text-sm ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                 <span className={`w-12 sm:w-16 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>To</span>
                 <span className={`px-1 sm:px-2 rounded text-xs ${darkMode ? 'text-white bg-slate-700' : 'text-slate-800 bg-slate-100'}`}>Recipient Name</span>
             </div>
             <div className={`flex border-b pb-1 text-xs sm:text-sm ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                 <span className={`w-12 sm:w-16 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Subject</span>
                 <span className={`text-xs sm:text-sm truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>Project Update Q4</span>
             </div>
        </div>
    </div>
);

const AppleHeader = ({ darkMode }: { darkMode: boolean }) => (
    <div className={`pt-6 sm:pt-8 rounded-t-[2rem] sm:rounded-t-[2.5rem] border-b ${darkMode ? 'bg-[#1c1c1e] border-[#38383a]' : 'bg-[#f2f2f7] border-slate-300'}`}>
        <div className={`px-3 sm:px-5 py-2 sm:py-3 flex justify-between items-center ${darkMode ? 'bg-[#1c1c1e]' : 'bg-[#f2f2f7]'}`}>
            <span className="text-blue-500 text-sm sm:text-base">Cancel</span>
            <span className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>New Message</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center">
                 <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </div>
        </div>
        <div className={`px-3 sm:px-5 py-2 sm:py-3 border-b flex gap-2 sm:gap-3 text-xs sm:text-sm ${darkMode ? 'bg-[#2c2c2e] border-[#38383a]' : 'bg-white border-slate-200'}`}>
            <span className={darkMode ? 'text-slate-400' : 'text-slate-400'}>To:</span>
            <span className={`truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>Client Name</span>
        </div>
        <div className={`px-3 sm:px-5 py-2 sm:py-3 border-b flex gap-2 sm:gap-3 text-xs sm:text-sm ${darkMode ? 'bg-[#2c2c2e] border-[#38383a]' : 'bg-white border-slate-200'}`}>
            <span className={darkMode ? 'text-slate-400' : 'text-slate-400'}>Subject:</span>
            <span className={`truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>Meeting Confirmation</span>
        </div>
    </div>
);

const YahooHeader = ({ darkMode }: { darkMode: boolean }) => (
    <div className={`border-b ${darkMode ? 'bg-[#1d1d1d] border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="bg-[#6001d2] h-10 sm:h-12 flex items-center px-2 sm:px-4">
             <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full"></div>
        </div>
        <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center">
                 <div className={`text-sm sm:text-lg font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Report</div>
                 <div className="text-[10px] sm:text-xs text-slate-400 flex-shrink-0 ml-2">Today at 10:42 AM</div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
                 <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">JD</div>
                 <div className="text-xs sm:text-sm min-w-0"><span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>John Doe</span> <span className="text-slate-500">&lt;john@yahoo.com&gt;</span></div>
            </div>
        </div>
    </div>
);


export const Canvas = () => {
  const { state, dispatch } = useStore();
  const { globalStyles } = state;
  const [previewMode, setPreviewMode] = useState<PreviewMode>('gmail');
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div 
        className="w-full h-full overflow-auto flex flex-col items-center p-3 sm:p-4 md:p-6 lg:p-8 relative bg-[#F8FAFC]"
        style={{
            backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}
        onClick={() => dispatch({ type: 'SELECT_ITEM', id: null, itemType: null })}
    >
        
        {/* Client Selector & Tools - Improved for mobile */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 mb-4 sm:mb-4 md:mb-6 lg:mb-8 sticky top-0 z-30 mx-auto max-w-2xl w-full items-center px-2 sm:px-2 bg-[#F8FAFC]/95 backdrop-blur-sm py-3 sm:py-2">
             <div className="bg-white p-1.5 sm:p-1 rounded-xl sm:rounded-xl shadow-lg sm:shadow-sm border-2 sm:border border-slate-200 flex gap-1 sm:gap-1 flex-1 w-full sm:w-auto">
                 {[
                     { id: 'gmail', label: 'Gmail', icon: 'M' },
                     { id: 'outlook', label: 'Outlook', icon: 'O' },
                     { id: 'apple', label: 'iPhone', icon: 'i' },
                     { id: 'yahoo', label: 'Yahoo', icon: 'Y' },
                 ].map((mode) => (
                     <button 
                        key={mode.id}
                        onClick={() => setPreviewMode(mode.id as PreviewMode)}
                        className={`px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-xs font-bold rounded-lg sm:rounded-lg transition-all flex items-center gap-1 sm:gap-2 flex-1 justify-center active:scale-95 touch-manipulation ${previewMode === mode.id ? 'bg-slate-800 text-white shadow-md transform scale-105' : 'text-slate-500 hover:bg-slate-50'}`}
                     >
                        {mode.label}
                     </button>
                 ))}
            </div>

            <div className="flex gap-2 sm:gap-2 items-center bg-white p-1.5 sm:p-1 rounded-xl sm:rounded-xl shadow-lg sm:shadow-sm border-2 sm:border border-slate-200">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-10 h-10 sm:w-10 sm:h-10 rounded-lg sm:rounded-lg flex items-center justify-center transition-all active:scale-95 touch-manipulation ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                    title="Toggle Dark Mode"
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? (
                        <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                        <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                </button>

                {/* Grid Toggle Button */}
                <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`w-10 h-10 sm:w-10 sm:h-10 rounded-lg sm:rounded-lg flex items-center justify-center transition-all active:scale-95 touch-manipulation ${showGrid ? 'bg-blue-100 text-blue-600' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                    title="Toggle Alignment Grid"
                    aria-label="Toggle Alignment Grid"
                >
                    <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16M10 4v16M14 4v16M6 4v16M18 4v16" />
                    </svg>
                </button>
                
                {/* Grid Density Slider */}
                {showGrid && (
                    <div className="w-20 sm:w-24 px-2 sm:px-2 animate-in fade-in slide-in-from-left-2">
                        <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            step="10"
                            value={gridSize}
                            onChange={(e) => setGridSize(parseInt(e.target.value))}
                            className="w-full h-2 sm:h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 block touch-manipulation"
                            title="Grid Density"
                        />
                    </div>
                )}
            </div>
        </div>

        {/* Simulator Stage - Improved for mobile */}
        <div className="flex-1 flex justify-center w-full pb-16 sm:pb-16 md:pb-20 items-start px-2 sm:px-4">
            
            {/* The Frame Wrapper */}
            <div 
                className={`transition-all duration-500 ease-out relative shadow-2xl w-full ${
                    previewMode === 'apple' 
                    ? 'max-w-[320px] sm:max-w-[375px] rounded-[2rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] md:border-[12px] border-slate-900 bg-black' 
                    : `max-w-[98%] sm:max-w-[600px] md:max-w-[750px] rounded-xl sm:rounded-xl border-2 sm:border ${darkMode ? 'border-slate-700 bg-[#121212]' : 'border-slate-200 bg-white'} ring-1 ring-slate-900/5`
                }`}
            >
                {/* Notch for iPhone */}
                {previewMode === 'apple' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-32 md:w-40 h-3 sm:h-4 md:h-6 bg-black rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl z-20"></div>
                )}

                {/* Client Headers */}
                <div className={`overflow-hidden ${previewMode === 'apple' ? 'rounded-t-[2.5rem]' : 'rounded-t-xl'}`}>
                    {previewMode === 'gmail' && <GmailHeader darkMode={darkMode} />}
                    {previewMode === 'outlook' && <OutlookHeader darkMode={darkMode} />}
                    {previewMode === 'apple' && <AppleHeader darkMode={darkMode} />}
                    {previewMode === 'yahoo' && <YahooHeader darkMode={darkMode} />}
                </div>

                {/* Email Body Content */}
                <div 
                    className={`relative ${previewMode === 'apple' ? 'min-h-[400px] md:min-h-[500px] rounded-b-[2.5rem] px-3 md:px-5 pb-6 md:pb-10' : 'min-h-[300px] md:min-h-[400px] rounded-b-xl px-4 md:px-8 lg:px-12 pb-6 md:pb-12'} ${darkMode ? 'bg-[#121212]' : 'bg-white'}`}
                    style={{
                        fontFamily: globalStyles.fontFamily
                    }}
                >
                     {/* Fake Email Body Text */}
                     <div className="pt-4 md:pt-6 pb-4 md:pb-8 space-y-2 md:space-y-4 opacity-70 select-none">
                          <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Hi there,</p>
                          <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Here is the proposed design for the new email signature. Let me know if you need any changes.</p>
                          <p className={`text-xs md:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Best regards,</p>
                     </div>

                    {/* Signature Area (The Real Canvas) - Improved for mobile */}
                    <div 
                        className="relative border-2 sm:border border-dashed border-slate-300 rounded-xl p-3 sm:p-2 md:p-4 hover:border-blue-400 hover:bg-blue-50/10 transition-all duration-300 group touch-manipulation"
                        style={{ backgroundColor: globalStyles.backgroundColor }}
                    >
                        {/* Photoshop-style Grid Overlay */}
                        {showGrid && (
                            <div 
                                className="absolute inset-0 pointer-events-none z-50 opacity-100 mix-blend-multiply rounded-xl overflow-hidden"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                                        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                                    `,
                                    backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, 10px 10px, 10px 10px`,
                                    backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px'
                                }}
                            >
                            </div>
                        )}

                        <div className="absolute -top-2 sm:-top-2.5 left-2 sm:left-4 bg-white px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-blue-400 transition-colors pointer-events-none z-10">
                            Signature
                        </div>

                        {state.rows.length === 0 ? (
                            <div className="h-20 sm:h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
                                <p className="text-[10px] sm:text-xs font-medium text-slate-400 text-center px-2">Drag & Drop Elements Here</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto relative z-10">
                                {state.rows.map(row => <RowRenderer key={row.id} row={row} />)}
                            </div>
                        )}
                    </div>
                </div>

                {/* iPhone Home Indicator */}
                {previewMode === 'apple' && (
                    <div className="absolute bottom-1 sm:bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 w-20 sm:w-24 md:w-32 h-0.5 sm:h-1 md:h-1.5 bg-slate-700 rounded-full"></div>
                )}
            </div>
        </div>
    </div>
  );
};
