"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/canvas/store';
import { ElementType, SignatureRow } from '@/types/canvas';
import { templates } from '@/lib/canvas/templates';
import { applyUserDataToTemplate } from '@/lib/canvas/userDataMapper';

export const Toolbar = ({ onClose }: { onClose?: () => void }) => {
    const { dispatch } = useStore();
    const [activeTab, setActiveTab] = useState<'build' | 'templates'>('build');
    const [openCategory, setOpenCategory] = useState<string | null>('Corporate & Professional');
    
    // Close toolbar when clicking outside on mobile (handled by parent overlay)
    
    const handleDragStart = (e: React.DragEvent, type: ElementType) => {
        e.dataTransfer.setData('elementType', type);
    };

    // Prebuilt Rows for Add-ons
    const addOnRows: { name: string; desc: string; icon: any; rowData: SignatureRow }[] = [
        {
            name: 'Eco Footer',
            desc: 'Green environment message',
            icon: '🌱',
            rowData: {
                id: 'eco-row',
                style: { paddingTop: 10, paddingBottom: 10, borderTop: '1px solid #16a34a', marginTop: 10 },
                columns: [{
                    id: 'eco-col', widthPercent: 100, verticalAlign: 'middle', style: {}, elements: [
                        { id: 'eco-txt', type: 'text', content: 'Please consider the environment before printing this email.', style: { color: '#16a34a', fontSize: 11, fontStyle: 'italic', textAlign: 'center' } }
                    ]
                }]
            }
        },
        {
            name: 'Legal Disclaimer',
            desc: 'Confidentiality notice',
            icon: '⚖️',
            rowData: {
                id: 'legal-row',
                style: { paddingTop: 10, marginTop: 15, borderTop: '1px solid #e2e8f0' },
                columns: [{
                    id: 'legal-col', widthPercent: 100, verticalAlign: 'top', style: {}, elements: [
                        { id: 'legal-txt', type: 'text', content: 'CONFIDENTIALITY NOTICE: The contents of this email message and any attachments are intended solely for the addressee(s) and may contain confidential and/or privileged information and may be legally protected from disclosure.', style: { color: '#94a3b8', fontSize: 10, lineHeight: 1.4, textAlign: 'justify' } }
                    ]
                }]
            }
        },
        {
            name: 'Call to Action',
            desc: 'Book a meeting button',
            icon: '📅',
            rowData: {
                id: 'cta-row',
                style: { paddingTop: 15, paddingBottom: 5 },
                columns: [{
                    id: 'cta-col', widthPercent: 100, verticalAlign: 'middle', style: { textAlign: 'center' }, elements: [
                        { id: 'cta-btn', type: 'button', content: 'Book a Meeting', url: '#', style: { backgroundColor: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 'bold' } }
                    ]
                }]
            }
        },
        {
            name: 'Promo Banner',
            desc: 'Full width image banner',
            icon: '📢',
            rowData: {
                id: 'promo-row',
                style: { paddingTop: 15 },
                columns: [{
                    id: 'promo-col', widthPercent: 100, verticalAlign: 'top', style: {}, elements: [
                        { id: 'promo-img', type: 'image', content: 'https://placehold.co/600x80/2563eb/FFF?text=SUMMER+SALE+-+50%25+OFF', style: { width: '100%', borderRadius: 8 }, url: '#' }
                    ]
                }]
            }
        },
        {
            name: 'Social Links',
            desc: 'Centered icon row',
            icon: '🔗',
            rowData: {
                id: 'social-row-addon',
                style: { paddingTop: 10, paddingBottom: 10 },
                columns: [{
                    id: 'social-col-addon', widthPercent: 100, verticalAlign: 'middle', style: { textAlign: 'center' }, elements: [
                        { 
                            id: 'social-el-addon', 
                            type: 'social', 
                            content: '', 
                            socialLinks: [
                                { network: 'linkedin', url: 'https://linkedin.com' },
                                { network: 'twitter', url: 'https://twitter.com' },
                                { network: 'instagram', url: 'https://instagram.com' }
                            ], 
                            style: { textAlign: 'center' } 
                        }
                    ]
                }]
            }
        },
        {
            name: 'App Download',
            desc: 'Download buttons',
            icon: '📱',
            rowData: {
                id: 'app-row',
                style: { paddingTop: 15 },
                columns: [
                    {
                        id: 'app-col-1', widthPercent: 50, verticalAlign: 'middle', style: { paddingRight: 5, textAlign: 'right' }, elements: [
                            { id: 'app-ios', type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg', style: { width: 120 }, url: '#' }
                        ]
                    },
                    {
                        id: 'app-col-2', widthPercent: 50, verticalAlign: 'middle', style: { paddingLeft: 5, textAlign: 'left' }, elements: [
                            { id: 'app-android', type: 'image', content: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg', style: { width: 120 }, url: '#' }
                        ]
                    }
                ]
            }
        },
        {
            name: 'Quote / Slogan',
            desc: 'Styled text block',
            icon: '💬',
            rowData: {
                id: 'quote-row',
                style: { paddingTop: 15, paddingBottom: 15, borderTop: '1px dashed #cbd5e1', marginTop: 15 },
                columns: [{
                    id: 'quote-col', widthPercent: 100, verticalAlign: 'middle', style: { textAlign: 'center' }, elements: [
                        { id: 'quote-txt', type: 'text', content: '"Innovation distinguishes between a leader and a follower."', style: { color: '#64748b', fontSize: 12, fontStyle: 'italic', fontFamily: 'Georgia, serif' } }
                    ]
                }]
            }
        },
        {
            name: 'Customer Rating',
            desc: '5 Stars & Review',
            icon: '⭐',
            rowData: {
                id: 'rating-row',
                style: { paddingTop: 10 },
                columns: [{
                    id: 'rating-col', widthPercent: 100, verticalAlign: 'middle', style: {}, elements: [
                        { id: 'rating-stars', type: 'text', content: '⭐⭐⭐⭐⭐', style: { fontSize: 12, lineHeight: 1 } },
                        { id: 'rating-txt', type: 'text', content: 'Rated 4.9/5 by our customers', style: { color: '#475569', fontSize: 11, fontWeight: 'bold' } }
                    ]
                }]
            }
        },
        {
            name: 'Support Alert',
            desc: 'Red alert box',
            icon: '🆘',
            rowData: {
                id: 'alert-row',
                style: { backgroundColor: '#fef2f2', borderRadius: 6, padding: '10px', marginTop: 10, border: '1px solid #fecaca' },
                columns: [{
                    id: 'alert-col', widthPercent: 100, verticalAlign: 'middle', style: { textAlign: 'center' }, elements: [
                        { id: 'alert-txt', type: 'text', content: '<b>Need Help?</b> Contact our 24/7 support line.', style: { color: '#b91c1c', fontSize: 12 } }
                    ]
                }]
            }
        }
    ];

    // Group templates by category
    const groupedTemplates = templates.reduce((acc, t) => {
        const cat = t.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(t);
        return acc;
    }, {} as Record<string, typeof templates>);

    const categories = Object.keys(groupedTemplates);

    return (
        <div className="w-full md:w-80 bg-white md:border-r border-slate-200 flex flex-col z-10 flex-shrink-0 h-full md:shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Header - Hidden in mobile bottom sheet (handled by parent) */}
            <div className="hidden md:block p-4 sm:p-6 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 sm:gap-2">
                        <div className="w-6 h-6 sm:w-6 sm:h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-xs shadow-sm">S</div>
                        <h1 className="text-base sm:text-base md:text-lg font-bold text-slate-800 tracking-tight">Signature<span className="text-blue-600">Builder</span></h1>
                    </div>
                </div>
                <p className="text-xs sm:text-xs text-slate-400 font-medium">Professional Email Editor</p>
            </div>
            
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 border-b border-slate-100">
                <div className="flex p-1 bg-slate-100 rounded-lg sm:rounded-lg">
                    <button 
                        className={`flex-1 py-2.5 sm:py-1.5 text-xs sm:text-xs font-semibold rounded-md transition-all duration-200 active:scale-95 ${activeTab === 'build' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('build')}
                    >
                        Build
                    </button>
                    <button 
                        className={`flex-1 py-2.5 sm:py-1.5 text-xs sm:text-xs font-semibold rounded-md transition-all duration-200 active:scale-95 ${activeTab === 'templates' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('templates')}
                    >
                        Templates
                    </button>
                </div>
            </div>
            
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 overflow-y-auto custom-scrollbar overscroll-contain">
                {activeTab === 'build' && (
                    <>
                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-xs sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">Layout Structure</h3>
                            <div className="grid grid-cols-2 gap-3 sm:gap-3">
                                <button 
                                    onClick={() => dispatch({ type: 'ADD_ROW', cols: 1 })}
                                    className="group p-4 sm:p-4 border-2 border-slate-200 bg-slate-50/50 rounded-xl hover:bg-white hover:border-blue-500 hover:shadow-md active:scale-95 transition-all flex flex-col items-center gap-3 touch-manipulation"
                                >
                                    <div className="w-full h-2 sm:h-2 bg-slate-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                                    <span className="text-xs sm:text-xs font-semibold text-slate-600 group-hover:text-blue-600">1 Column</span>
                                </button>
                                <button 
                                    onClick={() => dispatch({ type: 'ADD_ROW', cols: 2 })}
                                    className="group p-4 sm:p-4 border-2 border-slate-200 bg-slate-50/50 rounded-xl hover:bg-white hover:border-blue-500 hover:shadow-md active:scale-95 transition-all flex flex-col items-center gap-3 touch-manipulation"
                                >
                                    <div className="flex gap-1 sm:gap-1 w-full">
                                        <div className="w-1/2 h-2 sm:h-2 bg-slate-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                                        <div className="w-1/2 h-2 sm:h-2 bg-slate-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                                    </div>
                                    <span className="text-xs sm:text-xs font-semibold text-slate-600 group-hover:text-blue-600">2 Columns</span>
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-xs sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">Elements</h3>
                            <div className="space-y-3 sm:space-y-3">
                                <div 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, 'text')}
                                    className="p-3.5 sm:p-3 bg-white border-2 border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md active:scale-95 transition-all flex items-center gap-3 sm:gap-3 group touch-manipulation"
                                >
                                    <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-serif font-bold text-base sm:text-base group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0 shadow-sm">T</div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm sm:text-sm font-semibold text-slate-700 truncate">Text Block</div>
                                        <div className="text-xs sm:text-[10px] text-slate-400 truncate">Headings, paragraphs, links</div>
                                    </div>
                                </div>
                                <div 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, 'image')}
                                    className="p-3.5 sm:p-3 bg-white border-2 border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md active:scale-95 transition-all flex items-center gap-3 sm:gap-3 group touch-manipulation"
                                >
                                    <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors flex-shrink-0 shadow-sm">
                                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm sm:text-sm font-semibold text-slate-700 truncate">Image</div>
                                        <div className="text-xs sm:text-[10px] text-slate-400 truncate">Profile photo, logo, banner</div>
                                    </div>
                                </div>
                                <div 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, 'social')}
                                    className="p-3.5 sm:p-3 bg-white border-2 border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md active:scale-95 transition-all flex items-center gap-3 sm:gap-3 group touch-manipulation"
                                >
                                    <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors flex-shrink-0 shadow-sm">
                                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm sm:text-sm font-semibold text-slate-700 truncate">Social Icons</div>
                                        <div className="text-xs sm:text-[10px] text-slate-400 truncate">LinkedIn, X, Instagram...</div>
                                    </div>
                                </div>
                                <div 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, 'button')}
                                    className="p-3.5 sm:p-3 bg-white border-2 border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md active:scale-95 transition-all flex items-center gap-3 sm:gap-3 group touch-manipulation"
                                >
                                    <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors flex-shrink-0 shadow-sm">
                                        <div className="w-4 h-2.5 sm:w-4 sm:h-2 border-2 border-current rounded-sm"></div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm sm:text-sm font-semibold text-slate-700 truncate">Button</div>
                                        <div className="text-xs sm:text-[10px] text-slate-400 truncate">CTA link, meeting booking</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pre-built Blocks Section */}
                        <div className="mb-4 sm:mb-6">
                            <h3 className="text-xs sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">Pre-built Blocks</h3>
                            <div className="space-y-2.5 sm:space-y-3">
                                {addOnRows.map((addon, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => dispatch({ type: 'ADD_PREBUILT_ROW', row: addon.rowData })}
                                        className="w-full text-left p-3.5 sm:p-3 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md active:scale-95 transition-all group relative overflow-hidden touch-manipulation"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-3">
                                            <div className="text-2xl sm:text-2xl flex-shrink-0">{addon.icon}</div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-bold text-slate-800 text-sm sm:text-xs group-hover:text-blue-600 truncate">{addon.name}</div>
                                                <div className="text-xs sm:text-[10px] text-slate-400 leading-tight truncate">{addon.desc}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'templates' && (
                    <div className="space-y-2.5 sm:space-y-3">
                        <p className="text-xs sm:text-xs text-slate-400 mb-3 sm:mb-4 font-medium">Select a category to view templates</p>
                        
                        {categories.map(category => (
                            <div key={category} className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
                                <button
                                    onClick={() => setOpenCategory(openCategory === category ? null : category)}
                                    className={`w-full flex items-center justify-between p-3.5 sm:p-3 text-sm sm:text-sm font-semibold transition-all active:scale-95 touch-manipulation ${openCategory === category ? 'bg-slate-50 text-blue-700' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <span className="truncate pr-2">{category}</span>
                                    <span className={`text-xs sm:text-[10px] px-2 sm:px-2 py-1 sm:py-0.5 rounded-full border flex-shrink-0 ${openCategory === category ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                        {groupedTemplates[category].length}
                                    </span>
                                </button>
                                
                                {openCategory === category && (
                                    <div className="bg-slate-50/50 p-2 sm:p-2 space-y-2 sm:space-y-2 border-t border-slate-100">
                                        {groupedTemplates[category].map(t => (
                                            <button
                                                key={t.id}
                                                onClick={async () => {
                                                    // Clone template rows
                                                    const clonedRows = JSON.parse(JSON.stringify(t.rows));
                                                    // Apply user data automatically
                                                    try {
                                                        const adaptedRows = await applyUserDataToTemplate(clonedRows);
                                                        dispatch({ type: 'LOAD_TEMPLATE', rows: adaptedRows });
                                                    } catch (error) {
                                                        // If user data fails, load template as-is
                                                        console.warn('Could not apply user data to template:', error);
                                                        dispatch({ type: 'LOAD_TEMPLATE', rows: clonedRows });
                                                    }
                                                }}
                                                className="w-full text-left p-3.5 sm:p-3 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md active:scale-95 transition-all group relative overflow-hidden touch-manipulation"
                                            >
                                                <div className="font-bold text-slate-800 text-sm sm:text-xs group-hover:text-blue-600 relative z-10 truncate">{t.name}</div>
                                                <div className="text-xs sm:text-[10px] text-slate-400 mt-1 sm:mt-1 leading-tight relative z-10 line-clamp-2">{t.description}</div>
                                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
