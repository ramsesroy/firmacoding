"use client";

import React, { useRef, useState } from 'react';
import { useStore } from '@/lib/canvas/store';
import { SocialLink } from '@/types/canvas';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-6 last:border-0">
        <h3 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">{title}</h3>
        <div className="space-y-3 sm:space-y-4">{children}</div>
    </div>
);

const Input = ({ label, value, onChange, type = "text", placeholder }: any) => (
    <div className="flex flex-col">
        {label && <label className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-1 sm:mb-1.5">{label}</label>}
        <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none w-full transition-all duration-200 hover:border-slate-300"
        />
    </div>
);

const RangeInput = ({ label, value, onChange, min, max, unit = "px" }: any) => (
    <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex justify-between items-center">
             <label className="text-[10px] sm:text-xs font-semibold text-slate-600">{label}</label>
             <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 px-1 sm:px-1.5 py-0.5 rounded border border-slate-200">{value}{unit}</span>
        </div>
        <div className="relative w-full h-4 flex items-center">
             <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    background: #2563eb;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    margin-top: -5px; 
                }
                input[type=range]::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    background: #2563eb;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: #e2e8f0;
                    border-radius: 2px;
                }
                input[type=range]::-moz-range-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: #e2e8f0;
                    border-radius: 2px;
                }
            `}</style>
            <input 
                type="range"
                min={min}
                max={max}
                value={value || 0}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1 bg-transparent appearance-none cursor-pointer z-10"
            />
        </div>
    </div>
);

const ColorPicker = ({ label, value, onChange }: any) => (
    <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group relative">
        <label className="text-[10px] sm:text-xs font-medium text-slate-600 pl-0.5 sm:pl-1">{label}</label>
        <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono tracking-wider hidden sm:inline">{value}</span>
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 overflow-hidden rounded-full border border-slate-200 shadow-sm ring-2 ring-white group-hover:scale-110 transition-transform">
                 <div className="absolute inset-0" style={{ backgroundColor: value }}></div>
                 <input 
                    type="color" 
                    value={value || '#000000'} 
                    onChange={(e) => onChange(e.target.value)}
                    className="opacity-0 w-full h-full cursor-pointer absolute inset-0 z-10"
                />
            </div>
        </div>
    </div>
);

const AlignmentControl = ({ value, onChange }: any) => (
    <div className="flex flex-col gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <label className="text-[10px] sm:text-xs font-semibold text-slate-600">Alignment</label>
        <div className="flex p-0.5 sm:p-1 bg-slate-100 rounded-lg border border-slate-200">
            {[
                { id: 'left', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /> },
                { id: 'center', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" /> },
                { id: 'right', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" /> }
            ].map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => onChange(opt.id)}
                    className={`flex-1 py-1 sm:py-1.5 rounded-md flex items-center justify-center transition-all ${value === opt.id || (!value && opt.id === 'left') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {opt.icon}
                    </svg>
                </button>
            ))}
        </div>
    </div>
);

// Expanded list of supported networks
const SUPPORTED_NETWORKS = [
    'linkedin', 
    'facebook', 
    'twitter', 
    'instagram', 
    'youtube', 
    'tiktok', 
    'pinterest', 
    'github', 
    'whatsapp', 
    'telegram',
    'website' 
];

const EMAIL_SAFE_FONTS = [
    { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace' },
];

export const PropertiesPanel = ({ onClose }: { onClose?: () => void }) => {
  const { state, dispatch } = useStore();
  const { selectedId, selectionType, rows, globalStyles } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newNetwork, setNewNetwork] = useState('instagram');

  // Helper to find selected object in the deep tree
  const getSelectedObject = () => {
      if (!selectedId) return null;
      if (selectionType === 'row') return rows.find(r => r.id === selectedId);
      
      for (const row of rows) {
          if (selectionType === 'column') {
              const col = row.columns.find(c => c.id === selectedId);
              if (col) return col;
          }
          if (selectionType === 'element') {
              for (const col of row.columns) {
                  const el = col.elements.find(e => e.id === selectedId);
                  if (el) return el;
              }
          }
      }
      return null;
  };

  const selectedItem = getSelectedObject();

  const updateStyle = (key: string, value: any) => {
      dispatch({ 
          type: 'UPDATE_STYLE', 
          id: selectedId!, 
          style: { [key]: value } 
      });
  };

  const updateGlobal = (key: string, value: any) => {
      dispatch({ 
          type: 'UPDATE_GLOBAL_STYLE', 
          styles: { [key]: value }
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                dispatch({ type: 'UPDATE_CONTENT', id: selectedId!, content: reader.result as string });
            }
        };
        reader.readAsDataURL(file);
    }
  };

  // --- SOCIAL MANAGEMENT LOGIC ---
  const socialLinks = (selectedItem as any)?.socialLinks || [];

  const updateSocialUrl = (index: number, url: string) => {
      const newLinks = [...socialLinks];
      newLinks[index].url = url;
      dispatch({ type: 'UPDATE_SOCIAL_LINKS', id: selectedId!, socialLinks: newLinks });
  };

  const removeSocial = (index: number) => {
      const newLinks = [...socialLinks];
      newLinks.splice(index, 1);
      dispatch({ type: 'UPDATE_SOCIAL_LINKS', id: selectedId!, socialLinks: newLinks });
  };

  const addSocial = () => {
      const newLinks = [...socialLinks, { network: newNetwork, url: '' }];
      dispatch({ type: 'UPDATE_SOCIAL_LINKS', id: selectedId!, socialLinks: newLinks });
  };

  const moveSocial = (index: number, direction: 'up' | 'down') => {
      const newLinks = [...socialLinks];
      if (direction === 'up' && index > 0) {
          [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
      } else if (direction === 'down' && index < newLinks.length - 1) {
          [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
      }
      dispatch({ type: 'UPDATE_SOCIAL_LINKS', id: selectedId!, socialLinks: newLinks });
  };


  // --- RENDER GLOBAL SETTINGS PANEL ---
  if (!selectedId || !selectedItem) {
      return (
        <div className="w-80 max-w-[85vw] bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-20">
             <div className="p-4 sm:p-6 border-b border-slate-100">
                 <div className="flex items-center justify-between">
                     <div className="min-w-0 flex-1 pr-2">
                         <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 tracking-tight truncate">Global Design</h2>
                         <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">Default styles for your signature</p>
                     </div>
                     {/* Close button for mobile */}
                     {onClose && (
                         <button
                             onClick={onClose}
                             className="md:hidden p-1 text-slate-400 hover:text-slate-600"
                         >
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                         </button>
                     )}
                 </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                
                {/* Font Settings */}
                <Section title="Typography">
                    <div className="flex flex-col gap-4 sm:gap-5">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-600 mb-1.5 sm:mb-2">Font Family</label>
                            <div className="relative">
                                <select 
                                    value={globalStyles.fontFamily}
                                    onChange={(e) => updateGlobal('fontFamily', e.target.value)}
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none pr-8 transition-all"
                                >
                                    {EMAIL_SAFE_FONTS.map(font => (
                                        <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                                            {font.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <RangeInput 
                            label="Base Font Size"
                            value={globalStyles.fontSize}
                            min={10}
                            max={24}
                            onChange={(v: number) => updateGlobal('fontSize', v)}
                        />
                    </div>
                </Section>

                {/* Color Palette */}
                <Section title="Color Palette">
                    <div className="space-y-2 sm:space-y-3">
                        <ColorPicker 
                            label="Theme Accent" 
                            value={globalStyles.themeColor} 
                            onChange={(v: string) => updateGlobal('themeColor', v)} 
                        />
                        <ColorPicker 
                            label="Main Text" 
                            value={globalStyles.textColor} 
                            onChange={(v: string) => updateGlobal('textColor', v)} 
                        />
                        <ColorPicker 
                            label="Background" 
                            value={globalStyles.backgroundColor} 
                            onChange={(v: string) => updateGlobal('backgroundColor', v)} 
                        />
                    </div>
                </Section>

                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex gap-1.5 sm:gap-2">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-[10px] sm:text-xs text-blue-700 leading-relaxed">Global styles apply to everything unless you override them in specific elements.</p>
                    </div>
                </div>
             </div>
        </div>
      );
  }

  // --- RENDER SELECTED ITEM PANEL ---
  return (
    <div className="w-80 max-w-[85vw] bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-20">
        {/* Back Button */}
        <div className="p-3 border-b border-slate-100">
            <div className="flex items-center justify-between gap-2">
                <button 
                    onClick={() => dispatch({ type: 'SELECT_ITEM', id: null, itemType: null })}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex-1"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span className="hidden sm:inline">Back to Global Settings</span>
                    <span className="sm:hidden">Back</span>
                </button>
                {/* Close button for mobile */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-600"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>

        <div className="p-4 sm:p-6 border-b border-slate-100 bg-white">
             <h2 className="text-lg font-bold capitalize text-slate-800 tracking-tight">{selectionType} Properties</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {/* CONTENT EDITING */}
            {(selectionType === 'element') && (
                <Section title="Content">
                    {(selectedItem as any).type === 'social' ? (
                        <div className="space-y-4">
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Active Networks</div>
                            
                            {/* Active Links List with Reordering */}
                            <div className="flex flex-col gap-2">
                                {socialLinks.map((link: SocialLink, idx: number) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 sm:p-2 group hover:bg-white hover:border-slate-300 transition-all">
                                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase flex-1 truncate">{link.network}</span>
                                            <div className="flex gap-0.5 sm:gap-1">
                                                <button onClick={() => moveSocial(idx, 'up')} disabled={idx === 0} className="p-0.5 sm:p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 disabled:opacity-30">
                                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                </button>
                                                <button onClick={() => moveSocial(idx, 'down')} disabled={idx === socialLinks.length - 1} className="p-0.5 sm:p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 disabled:opacity-30">
                                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </button>
                                                <button onClick={() => removeSocial(idx)} className="p-0.5 sm:p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500">
                                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <Input 
                                            placeholder="URL..." 
                                            value={link.url}
                                            onChange={(val: string) => updateSocialUrl(idx, val)}
                                        />
                                    </div>
                                ))}
                                {socialLinks.length === 0 && <div className="text-xs sm:text-sm text-slate-400 text-center italic py-1.5 sm:py-2">No social links added.</div>}
                            </div>

                            {/* Add New Network */}
                            <div className="pt-3 sm:pt-4 border-t border-slate-100">
                                <label className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-1 sm:mb-1.5 block">Add Network</label>
                                <div className="flex gap-1.5 sm:gap-2">
                                    <select 
                                        value={newNetwork} 
                                        onChange={(e) => setNewNetwork(e.target.value)}
                                        className="flex-1 bg-white border border-slate-200 rounded-lg px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-700 outline-none focus:border-blue-500"
                                    >
                                        {SUPPORTED_NETWORKS.map(net => (
                                            <option key={net} value={net}>{net}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={addSocial}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm font-semibold shadow-sm transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {/* Image Specific Upload Control */}
                            {(selectedItem as any).type === 'image' && (
                                <div className="mb-2">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-1.5 sm:py-2 bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center gap-1.5 sm:gap-2"
                                    >
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        <span className="hidden sm:inline">Upload Image (Local)</span>
                                        <span className="sm:hidden">Upload Image</span>
                                    </button>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 sm:mt-1.5 text-center">Or paste URL below:</p>
                                </div>
                            )}

                            <Input 
                                label={(selectedItem as any).type === 'image' ? "Image URL" : "Text Content"} 
                                value={(selectedItem as any).content} 
                                onChange={(val: string) => dispatch({ type: 'UPDATE_CONTENT', id: selectedId!, content: val })} 
                                placeholder="Enter content..."
                            />
                            {/* Always show URL input for Button type, or if URL is present for others */}
                            {((selectedItem as any).type === 'button' || (selectedItem as any).url !== undefined) && (selectedItem as any).type !== 'social' && (
                                <Input 
                                    label="Hyperlink" 
                                    value={(selectedItem as any).url || ''} 
                                    onChange={(val: string) => updateStyle('url', val)} 
                                    placeholder="https://"
                                />
                            )}
                        </div>
                    )}
                </Section>
            )}

            {/* DIMENSIONS */}
            <Section title="Dimensions & Spacing">
                {/* Column Width Control (For Columns) */}
                {(selectedItem as any).widthPercent !== undefined && (
                    <div className="mb-4">
                        <RangeInput 
                            label="Column Width (%)"
                            value={(selectedItem as any).widthPercent}
                            min={10}
                            max={100}
                            unit="%"
                            onChange={(v: number) => dispatch({ type: 'UPDATE_COLUMN_WIDTH', id: selectedId!, widthPercent: v })}
                        />
                    </div>
                )}

                {/* Image Width Control */}
                {(selectedItem as any).type === 'image' && (
                    <div className="mb-3 sm:mb-4">
                         <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                             <label className="text-[10px] sm:text-xs font-semibold text-slate-600">Image Width</label>
                             <input 
                                type="number" 
                                min="50"
                                max="600"
                                value={typeof (selectedItem as any).style.width === 'number' ? (selectedItem as any).style.width : ''} 
                                onChange={(e) => updateStyle('width', parseInt(e.target.value))}
                                className="w-16 sm:w-20 text-right bg-slate-50 border border-slate-200 rounded px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs focus:border-blue-500 outline-none"
                                placeholder="px"
                            />
                        </div>
                        <input 
                            type="range"
                            min="50"
                            max="600"
                            value={typeof (selectedItem as any).style.width === 'number' ? (selectedItem as any).style.width : 100}
                            onChange={(e) => updateStyle('width', parseInt(e.target.value))}
                            className="w-full h-1 sm:h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 block"
                        />
                    </div>
                )}
                
                {/* Alignment Control */}
                <AlignmentControl 
                    value={selectedItem.style.textAlign} 
                    onChange={(v: string) => updateStyle('textAlign', v)} 
                />

                {/* Spacing Controls (Replaced Numeric Inputs with Sliders) */}
                <div className="space-y-3 sm:space-y-4">
                     <RangeInput 
                        label="Space Above" 
                        value={selectedItem.style.paddingTop || 0} 
                        onChange={(v: number) => updateStyle('paddingTop', v)} 
                        min={0}
                        max={50}
                    />
                    <RangeInput 
                        label="Space Below" 
                        value={selectedItem.style.paddingBottom || 0} 
                        onChange={(v: number) => updateStyle('paddingBottom', v)} 
                        min={0}
                        max={50}
                    />
                    <RangeInput 
                        label="Side Spacing (Left)" 
                        value={selectedItem.style.paddingLeft || 0} 
                        onChange={(v: number) => updateStyle('paddingLeft', v)} 
                        min={0}
                        max={50}
                    />
                    <RangeInput 
                        label="Side Spacing (Right)" 
                        value={selectedItem.style.paddingRight || 0} 
                        onChange={(v: number) => updateStyle('paddingRight', v)} 
                        min={0}
                        max={50}
                    />
                </div>
            </Section>

            {/* TYPOGRAPHY */}
            {(selectionType === 'element' && (selectedItem as any).type !== 'image' && (selectedItem as any).type !== 'social') && (
                <Section title="Typography">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <Input label="Size (px)" type="number" value={selectedItem.style.fontSize || 14} onChange={(v: string) => updateStyle('fontSize', parseInt(v))} />
                        <Input label="Line Height" type="number" step="0.1" value={selectedItem.style.lineHeight || 1.4} onChange={(v: string) => updateStyle('lineHeight', parseFloat(v))} />
                    </div>
                    <div className="mb-3 sm:mb-4">
                        <ColorPicker label="Text Color" value={selectedItem.style.color} onChange={(v: string) => updateStyle('color', v)} />
                    </div>
                    <div className="flex gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-slate-100 rounded-lg">
                         <button onClick={() => updateStyle('fontWeight', 'bold')} className={`flex-1 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded ${selectedItem.style.fontWeight === 'bold' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Bold</button>
                         <button onClick={() => updateStyle('fontWeight', 'normal')} className={`flex-1 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded ${!selectedItem.style.fontWeight || selectedItem.style.fontWeight === 'normal' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Reg</button>
                    </div>
                </Section>
            )}

            {/* DECORATION */}
            <Section title="Decoration">
                <ColorPicker label="Background" value={selectedItem.style.backgroundColor} onChange={(v: string) => updateStyle('backgroundColor', v)} />
                {(selectedItem as any).type === 'image' || (selectedItem as any).type === 'button' ? (
                    <div className="mt-3 sm:mt-4">
                         <Input label="Border Radius" type="number" value={selectedItem.style.borderRadius || 0} onChange={(v: string) => updateStyle('borderRadius', parseInt(v))} />
                    </div>
                ) : null}
            </Section>

            {selectionType === 'element' && (
                <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-100 flex flex-col gap-2 sm:gap-3">
                     <button 
                        className="w-full py-2 sm:py-2.5 bg-white text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-blue-50 border border-blue-200 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                        onClick={() => dispatch({ type: 'DUPLICATE_ITEM', id: selectedId!, itemType: 'element' })}
                    >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <span className="hidden sm:inline">Duplicate Element</span>
                        <span className="sm:hidden">Duplicate</span>
                    </button>
                    <button 
                        className="w-full py-2 sm:py-2.5 bg-red-50 text-red-600 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-red-100 border border-red-100 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                        onClick={() => dispatch({ type: 'DELETE_ITEM', id: selectedId! })}
                    >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        <span className="hidden sm:inline">Delete Element</span>
                        <span className="sm:hidden">Delete</span>
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};
