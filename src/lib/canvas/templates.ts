import { SignatureRow } from '@/types/canvas';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  rows: SignatureRow[];
}

const socialDefaults = [
  { network: 'linkedin', url: 'https://linkedin.com' },
  { network: 'twitter', url: 'https://twitter.com' },
  { network: 'instagram', url: 'https://instagram.com' }
];

export const templates: Template[] = [
  // --- CORPORATE & PROFESSIONAL ---
  {
    id: 't1',
    name: 'CEO Standard',
    category: 'Corporate & Professional',
    description: 'Clean, authoritative layout with a strong sidebar.',
    rows: [
      {
        id: 'row-t1-1',
        style: { paddingTop: 15, paddingBottom: 15 },
        columns: [
          {
            id: 'col-t1-1',
            widthPercent: 25,
            verticalAlign: 'top',
            style: { paddingRight: 20 },
            elements: [
              {
                id: 'el-t1-img',
                type: 'image',
                content: 'https://ui-avatars.com/api/?name=Alex+Morgan&background=0f172a&color=fff&size=128',
                style: { width: 100, borderRadius: 4 },
              }
            ]
          },
          {
            id: 'col-t1-2',
            widthPercent: 75,
            verticalAlign: 'top',
            style: { paddingLeft: 20, borderLeft: '1px solid #e2e8f0' },
            elements: [
              {
                id: 'el-t1-name',
                type: 'text',
                content: 'ALEX MORGAN',
                style: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', letterSpacing: '0.5px' }
              },
              {
                id: 'el-t1-role',
                type: 'text',
                content: 'Executive Director',
                style: { fontSize: 13, color: '#3b82f6', fontWeight: 'bold', uppercase: true, paddingBottom: 12, letterSpacing: '1px' }
              },
              {
                id: 'el-t1-contact',
                type: 'text',
                content: '<span style="color:#64748b">M:</span> +1 555 0123 456 &nbsp;&nbsp; <span style="color:#64748b">E:</span> alex@corp.com',
                style: { fontSize: 13, color: '#334155', lineHeight: 1.6 }
              },
              {
                id: 'el-t1-web',
                type: 'text',
                content: '<span style="color:#64748b">W:</span> www.morgan-exec.com',
                style: { fontSize: 13, color: '#334155', lineHeight: 1.6, paddingBottom: 8 }
              },
              {
                id: 'el-t1-social',
                type: 'social',
                content: '',
                socialLinks: socialDefaults,
                style: {}
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't6',
    name: 'Compact Modern',
    category: 'Corporate & Professional',
    description: 'Efficient horizontal layout for brief emails.',
    rows: [
      {
        id: 'row-t6-1',
        style: { paddingTop: 10, paddingBottom: 10 },
        columns: [
          {
            id: 'col-t6-1',
            widthPercent: 15,
            verticalAlign: 'middle',
            style: { paddingRight: 15 },
            elements: [
               {
                 id: 'el-t6-img',
                 type: 'image',
                 content: 'https://api.dicebear.com/7.x/initials/svg?seed=MC&backgroundColor=2563eb&textColor=fff',
                 style: { width: 50, borderRadius: 50 }
               }
            ]
          },
          {
            id: 'col-t6-2',
            widthPercent: 85,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t6-name',
                type: 'text',
                content: '<b>Michael Chen</b> <span style="color:#cbd5e1">|</span> <span style="color:#64748b">Senior Architect</span>',
                style: { fontSize: 14, color: '#0f172a' }
              },
              {
                id: 'el-t6-contact',
                type: 'text',
                content: 'mchen@arch-studio.io  •  +1 (555) 999-0000',
                style: { fontSize: 12, color: '#64748b', paddingTop: 2 }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't12',
    name: 'Brand Centric',
    category: 'Corporate & Professional',
    description: 'Focus on company identity.',
    rows: [
      {
        id: 'row-t12-1',
        style: { paddingBottom: 15 },
        columns: [
          {
            id: 'col-t12-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t12-logo',
                type: 'image',
                content: 'https://placehold.co/180x40/1e293b/FFF?text=COMPANY+LOGO',
                style: { width: 140 }
              }
            ]
          }
        ]
      },
      {
        id: 'row-t12-2',
        style: { borderTop: '2px solid #f1f5f9', paddingTop: 15 },
        columns: [
          {
            id: 'col-t12-2',
            widthPercent: 60,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t12-text',
                type: 'text',
                content: '<b>Sarah Connor</b>',
                style: { fontSize: 16, color: '#1e293b' }
              },
              {
                id: 'el-t12-role',
                type: 'text',
                content: 'Director of Operations',
                style: { fontSize: 13, color: '#64748b' }
              }
            ]
          },
          {
             id: 'col-t12-3',
             widthPercent: 40,
             verticalAlign: 'middle',
             style: { textAlign: 'right' },
             elements: [
                 {
                     id: 'el-t12-soc',
                     type: 'social',
                     content: '',
                     socialLinks: [{network:'linkedin', url:'#'}],
                     style: { textAlign: 'right' }
                 }
             ]
          }
        ]
      }
    ]
  },
  {
    id: 't16',
    name: 'The Grid',
    category: 'Corporate & Professional',
    description: 'Structured quadrants.',
    rows: [
      {
        id: 'row-t16-1',
        style: { border: '1px solid #e2e8f0', borderRadius: 8, padding: '15px' },
        columns: [
          {
             id: 'col-t16-1',
             widthPercent: 50,
             verticalAlign: 'top',
             style: { borderRight: '1px solid #e2e8f0', paddingRight: 15 },
             elements: [
               { id: 'el-t16-n', type: 'text', content: 'Alice Williams', style: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' } },
               { id: 'el-t16-r', type: 'text', content: 'HR Manager', style: { fontSize: 13, color: '#64748b', paddingBottom: 10 } },
               { id: 'el-t16-s', type: 'social', content: '', socialLinks: [{network:'linkedin', url:'#'}, {network:'twitter', url:'#'}], style:{} }
             ]
          },
          {
             id: 'col-t16-2',
             widthPercent: 50,
             verticalAlign: 'top',
             style: { paddingLeft: 15 },
             elements: [
                { id: 'el-t16-e', type: 'text', content: 'alice@company.com', style: { fontSize: 12, color: '#475569', lineHeight: 1.6 } },
                { id: 'el-t16-p', type: 'text', content: '+1 (555) 123-4567', style: { fontSize: 12, color: '#475569', lineHeight: 1.6 } },
                { id: 'el-t16-w', type: 'text', content: 'www.company.com', style: { fontSize: 12, color: '#2563eb', lineHeight: 1.6, fontWeight: 'bold' } }
             ]
          }
        ]
      }
    ]
  },
  {
    id: 't21',
    name: 'Executive Dark Sidebar',
    category: 'Corporate & Professional',
    description: 'Sophisticated dark contrast.',
    rows: [
      {
        id: 'row-t21-1',
        style: { paddingBottom: 10 },
        columns: [
          {
            id: 'col-t21-1',
            widthPercent: 4,
            verticalAlign: 'top',
            style: { backgroundColor: '#1e293b', height: 100 },
            elements: []
          },
          {
            id: 'col-t21-2',
            widthPercent: 96,
            verticalAlign: 'middle',
            style: { paddingLeft: 20 },
            elements: [
              {
                id: 'el-t21-name',
                type: 'text',
                content: 'ROBERT DOWNEY',
                style: { fontSize: 24, fontWeight: '800', color: '#1e293b', letterSpacing: '1px' }
              },
              {
                id: 'el-t21-role',
                type: 'text',
                content: 'Executive Director  |  Stark Industries',
                style: { fontSize: 13, color: '#64748b', paddingBottom: 10, uppercase: true, letterSpacing: '0.5px' }
              },
              {
                id: 'el-t21-contact',
                type: 'text',
                content: 'robert@stark.com &nbsp;&bull;&nbsp; +1 202 555 0192',
                style: { fontSize: 12, color: '#475569' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't22',
    name: 'Blue Note',
    category: 'Corporate & Professional',
    description: 'Subtle blue accents.',
    rows: [
      {
        id: 'row-t22-1',
        style: { borderTop: '4px solid #3b82f6', paddingTop: 20 },
        columns: [
          {
            id: 'col-t22-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t22-name',
                type: 'text',
                content: 'Sarah Connor',
                style: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' }
              },
              {
                id: 'el-t22-role',
                type: 'text',
                content: 'VP of Operations',
                style: { fontSize: 14, color: '#3b82f6', fontWeight: 'bold', paddingBottom: 5 }
              },
               {
                 id: 'el-t22-soc',
                 type: 'social',
                 content: '',
                 socialLinks: [{network: 'linkedin', url: '#'}, {network: 'twitter', url: '#'}],
                 style: { paddingTop: 10 }
               }
            ]
          }
        ]
      }
    ]
  },

  // --- CREATIVE & ARTS ---
  {
    id: 't11',
    name: 'Pink Accent',
    category: 'Creative & Arts',
    description: 'Bold color bar for creatives.',
    rows: [
      {
        id: 'row-t11-1',
        style: { paddingTop: 10, paddingBottom: 10 },
        columns: [
          {
            id: 'col-t11-1',
            widthPercent: 3,
            verticalAlign: 'top',
            style: { backgroundColor: '#db2777', height: 90 },
            elements: []
          },
          {
            id: 'col-t11-2',
            widthPercent: 97,
            verticalAlign: 'middle',
            style: { paddingLeft: 20 },
            elements: [
               {
                 id: 'el-t11-name',
                 type: 'text',
                 content: 'Maria Gonzales',
                 style: { fontSize: 24, color: '#db2777', fontWeight: 'bold' }
               },
               {
                 id: 'el-t11-role',
                 type: 'text',
                 content: 'Senior Fashion Designer',
                 style: { fontSize: 14, color: '#374151', letterSpacing: '0.5px', uppercase: true }
               },
               {
                 id: 'el-t11-soc',
                 type: 'social',
                 content: '',
                 socialLinks: [{network: 'instagram', url: '#'}, {network: 'pinterest', url: '#'}],
                 style: { paddingTop: 10 }
               }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't17',
    name: 'High Voltage',
    category: 'Creative & Arts',
    description: 'Energetic orange border.',
    rows: [
      {
        id: 'row-t17-1',
        style: { borderTop: '4px solid #f97316', paddingTop: 15 },
        columns: [
          {
            id: 'col-t17-1',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t17-dept',
                type: 'text',
                content: 'CREATIVE DEPT.',
                style: { fontSize: 11, fontWeight: 'bold', color: '#f97316', letterSpacing: '2px', paddingBottom: 5 }
              },
              {
                id: 'el-t17-name',
                type: 'text',
                content: 'Johnny Appleseed',
                style: { fontSize: 20, fontWeight: 'bold', color: '#1c1917' }
              },
              {
                id: 'el-t17-info',
                type: 'text',
                content: 'Art Director | +1 555-0101',
                style: { fontSize: 14, color: '#57534e' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't37',
    name: 'Soft Container',
    category: 'Creative & Arts',
    description: 'Friendly rounded container.',
    rows: [
      {
        id: 'row-t37-1',
        style: { backgroundColor: '#f8fafc', borderRadius: 16, paddingLeft: 25, paddingRight: 25, paddingTop: 20, paddingBottom: 20 },
        columns: [
          {
            id: 'col-t37-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: { textAlign: 'center' },
            elements: [
              {
                id: 'el-t37-img',
                type: 'image',
                content: 'https://api.dicebear.com/7.x/notionists/svg?seed=Pablo',
                style: { width: 80, borderRadius: 40, backgroundColor: '#e2e8f0', marginBottom: 10 }
              },
              {
                id: 'el-t37-name',
                type: 'text',
                content: 'Pablo P.',
                style: { fontSize: 20, fontWeight: 'bold', color: '#334155' }
              },
              {
                id: 'el-t37-role',
                type: 'text',
                content: 'Illustrator & Visual Artist',
                style: { fontSize: 14, color: '#64748b', paddingBottom: 10 }
              },
              {
                id: 'el-t37-soc',
                type: 'social',
                content: '',
                socialLinks: [{network: 'instagram', url: '#'}, {network: 'dribbble', url: '#'}],
                style: { textAlign: 'center' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't38',
    name: 'Architect',
    category: 'Creative & Arts',
    description: 'Minimalist structure.',
    rows: [
      {
        id: 'row-t38-1',
        style: { borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '15px 0' },
        columns: [
           {
             id: 'col-t38-1',
             widthPercent: 40,
             verticalAlign: 'middle',
             style: { borderRight: '2px solid #000', paddingRight: 20 },
             elements: [
               {
                 id: 'el-t38-name',
                 type: 'text',
                 content: 'FRANK L.',
                 style: { fontSize: 20, fontWeight: '900', letterSpacing: '2px', color: '#000', textAlign: 'right' }
               }
             ]
           },
           {
             id: 'col-t38-2',
             widthPercent: 60,
             verticalAlign: 'middle',
             style: { paddingLeft: 20 },
             elements: [
               {
                 id: 'el-t38-role',
                 type: 'text',
                 content: 'PRINCIPAL ARCHITECT',
                 style: { fontSize: 12, letterSpacing: '1.5px', color: '#000', fontWeight: 'bold' }
               },
               {
                 id: 'el-t38-web',
                 type: 'text',
                 content: 'wright-studios.com',
                 style: { fontSize: 12, color: '#555' }
               }
             ]
           }
        ]
      }
    ]
  },

  // --- TECH & DIGITAL ---
  {
    id: 't3',
    name: 'Tech Dark Mode',
    category: 'Tech & Digital',
    description: 'Sleek dark theme for devs.',
    rows: [
      {
        id: 'row-t3-1',
        style: { paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, backgroundColor: '#0f172a', borderRadius: 8 },
        columns: [
          {
            id: 'col-t3-1',
            widthPercent: 20,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t3-img',
                type: 'image',
                content: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
                style: { width: 70, borderRadius: 35, border: '2px solid #6366f1' },
              }
            ]
          },
          {
            id: 'col-t3-2',
            widthPercent: 80,
            verticalAlign: 'middle',
            style: { paddingLeft: 20 },
            elements: [
              {
                id: 'el-t3-name',
                type: 'text',
                content: 'Felix Kjellberg',
                style: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' }
              },
              {
                id: 'el-t3-role',
                type: 'text',
                content: 'Senior DevOps Engineer',
                style: { fontSize: 13, color: '#818cf8', paddingBottom: 8, fontWeight: 'medium' }
              },
              {
                id: 'el-t3-link',
                type: 'text',
                content: 'github.com/felixk &nbsp; <span style="color:#475569">|</span> &nbsp; felix@tech.io',
                style: { fontSize: 12, color: '#94a3b8' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't8',
    name: 'Startup Vibrant',
    category: 'Tech & Digital',
    description: 'Friendly and approachable.',
    rows: [
      {
        id: 'row-t8-1',
        style: { paddingTop: 10 },
        columns: [
          {
            id: 'col-t8-1',
            widthPercent: 25,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t8-img',
                type: 'image',
                content: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoey',
                style: { width: 80, borderRadius: 12, backgroundColor: '#f3e8ff' }
              }
            ]
          },
          {
            id: 'col-t8-2',
            widthPercent: 75,
            verticalAlign: 'middle',
            style: { paddingLeft: 15 },
            elements: [
               {
                 id: 'el-t8-hello',
                 type: 'text',
                 content: 'Hi, I\'m Zoey! 👋',
                 style: { fontSize: 20, fontWeight: 'bold', color: '#7c3aed' }
               },
               {
                 id: 'el-t8-desc',
                 type: 'text',
                 content: 'Community Manager @ RocketApp',
                 style: { fontSize: 14, color: '#4b5563', paddingBottom: 10 }
               },
               {
                 id: 'el-t8-btn',
                 type: 'button',
                 content: 'Chat on Discord',
                 url: '#',
                 style: { backgroundColor: '#7c3aed', color: '#fff', fontSize: 12, borderRadius: 6, padding: '8px 16px', fontWeight: 'bold' }
               }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't15',
    name: 'Code Editor',
    category: 'Tech & Digital',
    description: 'Monospace theme.',
    rows: [
      {
        id: 'row-t15-1',
        style: { backgroundColor: '#1e1e1e', paddingTop: 15, paddingBottom: 15, paddingLeft: 20, paddingRight: 20, borderRadius: 6 },
        columns: [
          {
            id: 'col-t15-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t15-code',
                type: 'text',
                content: '<span style="font-family: monospace; color: #c586c0;">const</span> <span style="font-family: monospace; color: #9cdcfe;">dev</span> = <span style="font-family: monospace; color: #ce9178;">"Max"</span>;',
                style: { fontSize: 14, lineHeight: 1.5 }
              },
               {
                 id: 'el-t15-role',
                 type: 'text',
                 content: '<span style="font-family: monospace; color: #6a9955;">// Full Stack Developer</span>',
                 style: { fontSize: 13, fontFamily: 'monospace' }
              },
              {
                 id: 'el-t15-soc',
                 type: 'social',
                 content: '',
                 socialLinks: [{network: 'github', url: '#'}, {network: 'linkedin', url: '#'}],
                 style: { paddingTop: 10 }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't25',
    name: 'Terminal',
    category: 'Tech & Digital',
    description: 'Retro hacker style.',
    rows: [
      {
        id: 'row-t25-1',
        style: { backgroundColor: '#000000', paddingTop: 15, paddingBottom: 15, paddingLeft: 15, paddingRight: 15, borderRadius: 4, border: '1px solid #333' },
        columns: [
          {
            id: 'col-t25-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t25-cmd',
                type: 'text',
                content: '<span style="color: #22c55e; font-family: monospace;">➜  ~</span> <span style="color: #fff; font-family: monospace;">whoami</span>',
                style: { fontFamily: 'monospace', fontSize: 14 }
              },
              {
                id: 'el-t25-res',
                type: 'text',
                content: '<span style="color: #e2e8f0; font-family: monospace;">Neo Anderson</span><br><span style="color: #94a3b8; font-family: monospace;">System Architect</span>',
                style: { fontFamily: 'monospace', fontSize: 14, paddingTop: 8, lineHeight: 1.4 }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't26',
    name: 'SaaS Product',
    category: 'Tech & Digital',
    description: 'Clean product-led growth vibe.',
    rows: [
      {
        id: 'row-t26-1',
        style: { paddingBottom: 15 },
        columns: [
          {
            id: 'col-t26-1',
            widthPercent: 65,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t26-name',
                type: 'text',
                content: 'Jordan Lee',
                style: { fontSize: 18, fontWeight: 'bold', color: '#111827' }
              },
              {
                id: 'el-t26-role',
                type: 'text',
                content: 'Product Manager @ CloudScale',
                style: { fontSize: 14, color: '#4b5563', paddingBottom: 5 }
              },
              {
                id: 'el-t26-link',
                type: 'text',
                content: 'jordan@cloudscale.io',
                style: { fontSize: 12, color: '#6b7280' }
              }
            ]
          },
          {
            id: 'col-t26-2',
            widthPercent: 35,
            verticalAlign: 'middle',
            style: { textAlign: 'right' },
            elements: [
              {
                id: 'el-t26-btn',
                type: 'button',
                content: 'View Roadmap',
                url: '#',
                style: { backgroundColor: '#8b5cf6', color: '#fff', fontSize: 12, borderRadius: 6, padding: '8px 14px', fontWeight: 'bold' }
              }
            ]
          }
        ]
      }
    ]
  },

  // --- LEGAL & FINANCE ---
  {
    id: 't9',
    name: 'Legal Serif',
    category: 'Legal & Finance',
    description: 'Trustworthy and serious.',
    rows: [
      {
        id: 'row-t9-1',
        style: { paddingBottom: 15, borderBottom: '1px solid #e5e7eb' },
        columns: [
          {
            id: 'col-t9-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t9-name',
                type: 'text',
                content: 'James McGill, Esq.',
                style: { fontSize: 24, fontFamily: 'Georgia, serif', color: '#1f2937' }
              },
              {
                id: 'el-t9-role',
                type: 'text',
                content: 'Partner at HHM Legal',
                style: { fontSize: 14, color: '#4b5563', fontFamily: 'Georgia, serif', fontStyle: 'italic' }
              }
            ]
          }
        ]
      },
      {
        id: 'row-t9-2',
        style: { paddingTop: 10 },
        columns: [
          {
             id: 'col-t9-2',
             widthPercent: 100,
             verticalAlign: 'top',
             style: {},
             elements: [
               {
                 id: 'el-t9-disc',
                 type: 'text',
                 content: '<span style="font-weight:bold">Confidentiality Notice:</span> This email and any attachments are confidential and may be privileged. If you are not the intended recipient, please notify the sender immediately.',
                 style: { fontSize: 10, color: '#9ca3af', lineHeight: 1.4 }
               }
             ]
          }
        ]
      }
    ]
  },
  {
    id: 't33',
    name: 'Chambers',
    category: 'Legal & Finance',
    description: 'Classic law firm aesthetic.',
    rows: [
      {
        id: 'row-t33-1',
        style: {},
        columns: [
          {
            id: 'col-t33-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: { borderBottom: '2px solid #9a3412', paddingBottom: 10 },
            elements: [
              {
                id: 'el-t33-name',
                type: 'text',
                content: 'PEARSON & SPECTER',
                style: { fontSize: 20, fontFamily: 'Times New Roman, serif', color: '#0f172a', letterSpacing: '1px', fontWeight: 'bold' }
              }
            ]
          }
        ]
      },
      {
        id: 'row-t33-2',
        style: { paddingTop: 10 },
        columns: [
          {
            id: 'col-t33-2',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t33-details',
                type: 'text',
                content: 'Harvey Specter <span style="color:#cbd5e1">|</span> Senior Partner',
                style: { fontSize: 14, color: '#334155', fontFamily: 'Times New Roman, serif' }
              },
              {
                id: 'el-t33-add',
                type: 'text',
                content: '601 Lexington Avenue, New York, NY',
                style: { fontSize: 12, color: '#64748b', fontFamily: 'Times New Roman, serif', paddingTop: 4 }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't34',
    name: 'Corporate Counsel',
    category: 'Legal & Finance',
    description: 'Blue toned corporate legal.',
    rows: [
      {
        id: 'row-t34-1',
        style: { paddingBottom: 15 },
        columns: [
          {
            id: 'col-t34-1',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t34-name',
                type: 'text',
                content: '<b>Kim Wexler</b> <span style="color:#cbd5e1">|</span> General Counsel',
                style: { fontSize: 16, color: '#1e3a8a' }
              },
              {
                id: 'el-t34-con',
                type: 'text',
                content: 'kwexler@mesa-verde.com  •  (505) 555-0199',
                style: { fontSize: 12, color: '#64748b', paddingTop: 5 }
              }
            ]
          }
        ]
      },
      {
        id: 'row-t34-2',
        style: { borderTop: '1px solid #e5e7eb', paddingTop: 8 },
        columns: [
           {
             id: 'col-t34-2',
             widthPercent: 100,
             verticalAlign: 'top',
             style: {},
             elements: [
               {
                 id: 'el-t34-disc',
                 type: 'text',
                 content: 'Privileged/Confidential Information may be contained in this message.',
                 style: { fontSize: 10, color: '#94a3b8', fontStyle: 'italic' }
               }
             ]
           }
        ]
      }
    ]
  },

  // --- REAL ESTATE ---
  {
    id: 't7',
    name: 'Luxury Estate',
    category: 'Real Estate',
    description: 'Gold accents for high-end agents.',
    rows: [
      {
        id: 'row-t7-1',
        style: { paddingBottom: 0 },
        columns: [
          {
            id: 'col-t7-1',
            widthPercent: 25,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t7-img',
                type: 'image',
                content: 'https://ui-avatars.com/api/?name=Amanda+S&background=b45309&color=fff&size=128',
                style: { width: 80, borderRadius: 0 }
              }
            ]
          },
          {
            id: 'col-t7-2',
            widthPercent: 75,
            verticalAlign: 'middle',
            style: { paddingLeft: 15 },
            elements: [
              {
                id: 'el-t7-name',
                type: 'text',
                content: 'Amanda Sterling',
                style: { fontSize: 22, fontFamily: 'Georgia, serif', color: '#0f172a' }
              },
              {
                id: 'el-t7-role',
                type: 'text',
                content: 'LUXURY ESTATE AGENT',
                style: { fontSize: 11, color: '#b45309', uppercase: true, paddingBottom: 8, letterSpacing: '1px', fontWeight: 'bold' }
              },
              {
                id: 'el-t7-details',
                type: 'text',
                content: '123 Gold Coast Dr, CA 90210',
                style: { fontSize: 12, color: '#64748b' }
              }
            ]
          }
        ]
      },
      {
         id: 'row-t7-2',
         style: {},
         columns: [
             {
                 id: 'col-t7-banner',
                 widthPercent: 100,
                 verticalAlign: 'middle',
                 style: { backgroundColor: '#b45309', paddingTop: 6, paddingBottom: 6, paddingLeft: 15, marginTop: 10 },
                 elements: [
                     {
                         id: 'el-t7-slogan',
                         type: 'text',
                         content: 'Finding your dream home.',
                         style: { color: '#ffffff', fontSize: 11, fontStyle: 'italic', letterSpacing: '0.5px' }
                     }
                 ]
             }
         ]
      }
    ]
  },
  {
    id: 't31',
    name: 'Noir Gold',
    category: 'Real Estate',
    description: 'Black background, premium feel.',
    rows: [
      {
        id: 'row-t31-1',
        style: { backgroundColor: '#1c1917', paddingTop: 25, paddingBottom: 25, paddingLeft: 25, paddingRight: 25 },
        columns: [
          {
             id: 'col-t31-1',
             widthPercent: 100,
             verticalAlign: 'middle',
             style: { textAlign: 'center', border: '1px solid #d97706', padding: '15px' },
             elements: [
               {
                 id: 'el-t31-name',
                 type: 'text',
                 content: 'ELIZABETH YORK',
                 style: { fontSize: 20, color: '#ffffff', letterSpacing: '3px', fontFamily: 'Georgia, serif' }
               },
               {
                 id: 'el-t31-role',
                 type: 'text',
                 content: 'PREMIUM ESTATES',
                 style: { fontSize: 10, color: '#d97706', paddingTop: 8, letterSpacing: '2px', fontWeight: 'bold' }
               }
             ]
          }
        ]
      }
    ]
  },
  {
    id: 't32',
    name: 'Open House Banner',
    category: 'Real Estate',
    description: 'Image heavy for promotions.',
    rows: [
      {
        id: 'row-t32-1',
        style: { paddingBottom: 10 },
        columns: [
          {
            id: 'col-t32-1',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t32-img',
                type: 'image',
                content: 'https://placehold.co/550x120/1e293b/FFF?text=OPEN+HOUSE+SUN+2-4PM',
                style: { width: 400, borderRadius: 4 }
              }
            ]
          }
        ]
      },
      {
        id: 'row-t32-2',
        style: {},
        columns: [
          {
            id: 'col-t32-2',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t32-name',
                type: 'text',
                content: '<b>Tom Hardy</b> | Senior Realtor',
                style: { fontSize: 14, color: '#1e293b' }
              },
              {
                id: 'el-t32-phone',
                type: 'text',
                content: 'Call to book: (555) 123-4567',
                style: { fontSize: 13, color: '#64748b' }
              }
            ]
          }
        ]
      }
    ]
  },

  // --- MARKETING & SALES ---
  {
    id: 't10',
    name: 'Sales Action',
    category: 'Marketing & Sales',
    description: 'Focused on the CTA button.',
    rows: [
      {
        id: 'row-t10-1',
        style: {},
        columns: [
          {
            id: 'col-t10-1',
            widthPercent: 60,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t10-name',
                type: 'text',
                content: 'David Ross',
                style: { fontSize: 18, fontWeight: 'bold', color: '#111827' }
              },
              {
                id: 'el-t10-role',
                type: 'text',
                content: 'VP of Sales',
                style: { fontSize: 14, color: '#6b7280' }
              }
            ]
          },
          {
            id: 'col-t10-2',
            widthPercent: 40,
            verticalAlign: 'middle',
            style: { textAlign: 'right' },
            elements: [
               {
                 id: 'el-t10-btn',
                 type: 'button',
                 content: 'Book a Demo',
                 url: '#',
                 style: { backgroundColor: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 'bold', borderRadius: 6, padding: '10px 18px' }
               }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't35',
    name: 'Growth Hacker',
    category: 'Marketing & Sales',
    description: 'Bold emoji and button.',
    rows: [
      {
        id: 'row-t35-1',
        style: {},
        columns: [
           {
             id: 'col-t35-1',
             widthPercent: 65,
             verticalAlign: 'middle',
             style: {},
             elements: [
               {
                 id: 'el-t35-name',
                 type: 'text',
                 content: '🚀 Let\'s Scale',
                 style: { fontSize: 18, fontWeight: 'bold', color: '#15803d' }
               },
               {
                 id: 'el-t35-role',
                 type: 'text',
                 content: 'Gary V. | Growth Expert',
                 style: { fontSize: 14, color: '#374151' }
               }
             ]
           },
           {
             id: 'col-t35-2',
             widthPercent: 35,
             verticalAlign: 'middle',
             style: { textAlign: 'right' },
             elements: [
               {
                 id: 'el-t35-btn',
                 type: 'button',
                 content: '15min Call',
                 url: '#',
                 style: { backgroundColor: '#15803d', color: '#fff', borderRadius: 30, padding: '8px 16px', fontWeight: 'bold', fontSize: 12 }
               }
             ]
           }
        ]
      }
    ]
  },
  {
    id: 't36',
    name: 'SEO Data',
    category: 'Marketing & Sales',
    description: 'Highlighted stats.',
    rows: [
      {
        id: 'row-t36-1',
        style: { borderLeft: '4px solid #f59e0b', paddingLeft: 15, backgroundColor: '#fffbeb', paddingTop: 15, paddingBottom: 15, borderRadius: 0 },
        columns: [
          {
            id: 'col-t36-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t36-name',
                type: 'text',
                content: 'Jill Analytics',
                style: { fontSize: 16, fontWeight: 'bold', color: '#b45309' }
              },
              {
                id: 'el-t36-stat',
                type: 'text',
                content: '📈 Helping you rank #1 on Google',
                style: { fontSize: 14, color: '#4b5563', paddingTop: 5 }
              },
              {
                id: 'el-t36-link',
                type: 'text',
                content: 'Get your free audit →',
                url: '#',
                style: { fontSize: 12, color: '#d97706', fontWeight: 'bold', textDecoration: 'underline', paddingTop: 5 }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't14',
    name: 'Banner Promo',
    category: 'Marketing & Sales',
    description: 'Header image for campaigns.',
    rows: [
      {
        id: 'row-t14-1',
        style: { paddingBottom: 12 },
        columns: [
           {
             id: 'col-t14-1',
             widthPercent: 100,
             verticalAlign: 'top',
             style: {},
             elements: [
               {
                 id: 'el-t14-ban',
                 type: 'image',
                 content: 'https://placehold.co/600x80/2563eb/FFF?text=SUMMER+SALE+-+50%25+OFF',
                 style: { width: 400, borderRadius: 6 }
               }
             ]
           }
        ]
      },
      {
        id: 'row-t14-2',
        style: {},
        columns: [
           {
             id: 'col-t14-2',
             widthPercent: 100,
             verticalAlign: 'top',
             style: {},
             elements: [
               {
                 id: 'el-t14-name',
                 type: 'text',
                 content: 'Sales Team @ ShopCo',
                 style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' }
               }
             ]
           }
        ]
      }
    ]
  },

  // --- MINIMALIST ---
  {
    id: 't2',
    name: 'Vertical Center',
    category: 'Minimalist',
    description: 'Simple stacked layout.',
    rows: [
      {
        id: 'row-t2-1',
        style: { paddingTop: 20, paddingBottom: 20 },
        columns: [
          {
            id: 'col-t2-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: { textAlign: 'center' },
            elements: [
              {
                id: 'el-t2-img',
                type: 'image',
                content: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=111&color=fff&rounded=true',
                style: { width: 64, borderRadius: 32 },
              },
              {
                id: 'el-t2-name',
                type: 'text',
                content: 'SARAH SMITH',
                style: { fontSize: 18, fontWeight: 'bold', color: '#000000', paddingTop: 12, textAlign: 'center', letterSpacing: '1px' }
              },
              {
                id: 'el-t2-role',
                type: 'text',
                content: 'Creative Director',
                style: { fontSize: 13, color: '#666666', textAlign: 'center', paddingBottom: 12 }
              },
              {
                id: 'el-t2-social',
                type: 'social',
                content: '',
                socialLinks: [{ network: 'instagram', url: '#' }, { network: 'linkedin', url: '#' }],
                style: { textAlign: 'center' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't18',
    name: 'Monogram',
    category: 'Minimalist',
    description: 'Initials instead of photo.',
    rows: [
      {
        id: 'row-t18-1',
        style: {},
        columns: [
          {
            id: 'col-t18-1',
            widthPercent: 15,
            verticalAlign: 'middle',
            style: {},
            elements: [
               {
                 id: 'el-t18-mono',
                 type: 'button',
                 content: 'JD',
                 url: '#',
                 style: { backgroundColor: '#1e293b', color: '#fff', borderRadius: 50, width: 44, height: 44, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }
               }
            ]
          },
          {
            id: 'col-t18-2',
            widthPercent: 85,
            verticalAlign: 'middle',
            style: { paddingLeft: 12 },
            elements: [
               {
                 id: 'el-t18-name',
                 type: 'text',
                 content: 'John Doe',
                 style: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' }
               },
               {
                 id: 'el-t18-em',
                 type: 'text',
                 content: 'john@studio.com',
                 style: { fontSize: 13, color: '#64748b' }
               }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't19',
    name: 'Signature Script',
    category: 'Minimalist',
    description: 'Personal handwriting style.',
    rows: [
      {
        id: 'row-t19-1',
        style: {},
        columns: [
          {
            id: 'col-t19-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t19-sig',
                type: 'text',
                content: 'Sincerely,',
                style: { fontSize: 14, fontFamily: 'cursive', color: '#4b5563' }
              },
              {
                id: 'el-t19-name',
                type: 'text',
                content: 'Jonathan Miller',
                style: { fontSize: 28, fontFamily: 'cursive', color: '#111827', paddingBottom: 8 }
              },
              {
                 id: 'el-t19-block',
                 type: 'text',
                 content: 'General Manager',
                 style: { fontSize: 12, fontFamily: 'Arial, sans-serif', color: '#6b7280', uppercase: true, letterSpacing: '1px' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't23',
    name: 'Typographic',
    category: 'Minimalist',
    description: 'Elegant serif focus.',
    rows: [
      {
        id: 'row-t23-1',
        style: {},
        columns: [
          {
            id: 'col-t23-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: { borderBottom: '1px solid #000', paddingBottom: 10 },
            elements: [
              {
                id: 'el-t23-name',
                type: 'text',
                content: 'ELEANOR RIGBY',
                style: { fontSize: 24, fontFamily: 'Times New Roman, serif', color: '#000', letterSpacing: '1px' }
              }
            ]
          }
        ]
      },
      {
        id: 'row-t23-2',
        style: { paddingTop: 10 },
        columns: [
           {
             id: 'col-t23-2',
             widthPercent: 100,
             verticalAlign: 'top',
             style: {},
             elements: [
               {
                 id: 'el-t23-details',
                 type: 'text',
                 content: 'Writer & Editor  •  London, UK',
                 style: { fontSize: 13, color: '#333', fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }
               }
             ]
           }
        ]
      }
    ]
  },
  {
    id: 't24',
    name: 'Bold Edge',
    category: 'Minimalist',
    description: 'Thick black border.',
    rows: [
      {
        id: 'row-t24-1',
        style: { paddingLeft: 20, borderLeft: '6px solid #000' },
        columns: [
          {
            id: 'col-t24-1',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t24-name',
                type: 'text',
                content: 'MAX POWER',
                style: { fontSize: 18, fontWeight: '900', color: '#000', letterSpacing: '2px' }
              },
              {
                id: 'el-t24-link',
                type: 'text',
                content: 'max@power.com',
                style: { fontSize: 14, color: '#444', paddingTop: 6 }
              }
            ]
          }
        ]
      }
    ]
  },

  // --- HEALTHCARE & MEDICAL ---
  {
    id: 't4',
    name: 'MediCare',
    category: 'Healthcare & Medical',
    description: 'Clean red cross theme.',
    rows: [
      {
        id: 'row-t4-1',
        style: { paddingBottom: 10 },
        columns: [
          {
            id: 'col-t4-1',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
               {
                id: 'el-t4-name',
                type: 'text',
                content: 'Dr. Emily Blunt',
                style: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' }
               },
               {
                id: 'el-t4-role',
                type: 'text',
                content: 'Chief of Surgery',
                style: { fontSize: 14, color: '#dc2626', fontWeight: 'bold', uppercase: true }
               },
               {
                id: 'el-t4-contact',
                type: 'text',
                content: 'emily@hospital.org  |  555-999-8888',
                style: { fontSize: 13, color: '#4b5563', paddingTop: 6 }
               }
            ]
          }
        ]
      },
      {
        id: 'row-t4-2',
        style: { paddingTop: 0, paddingBottom: 0 },
        columns: [
          {
            id: 'col-t4-2',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t4-bar',
                type: 'button',
                content: 'Schedule Consultation',
                url: '#',
                style: { backgroundColor: '#dc2626', color: '#ffffff', borderRadius: 0, width: '100%', textAlign: 'center', fontSize: 12, paddingTop: 8, paddingBottom: 8, fontWeight: 'bold' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't27',
    name: 'Pediatric',
    category: 'Healthcare & Medical',
    description: 'Soft cyan for kids.',
    rows: [
      {
        id: 'row-t27-1',
        style: {},
        columns: [
          {
            id: 'col-t27-1',
            widthPercent: 20,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t27-img',
                type: 'image',
                content: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Baby&backgroundColor=cffafe',
                style: { width: 60, borderRadius: 30 }
              }
            ]
          },
          {
            id: 'col-t27-2',
            widthPercent: 80,
            verticalAlign: 'middle',
            style: { paddingLeft: 15 },
            elements: [
              {
                id: 'el-t27-name',
                type: 'text',
                content: 'Dr. Anna White',
                style: { fontSize: 18, color: '#0891b2', fontWeight: 'bold' }
              },
              {
                id: 'el-t27-role',
                type: 'text',
                content: 'Pediatrician | TinyToes Clinic',
                style: { fontSize: 13, color: '#64748b' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't28',
    name: 'Dental Mint',
    category: 'Healthcare & Medical',
    description: 'Fresh and clean.',
    rows: [
      {
        id: 'row-t28-1',
        style: { borderLeft: '4px solid #14b8a6', paddingLeft: 20 },
        columns: [
          {
            id: 'col-t28-1',
            widthPercent: 100,
            verticalAlign: 'top',
            style: {},
            elements: [
              {
                id: 'el-t28-name',
                type: 'text',
                content: 'Bright Smile Dental',
                style: { fontSize: 18, fontWeight: 'bold', color: '#0f766e' }
              },
              {
                id: 'el-t28-info',
                type: 'text',
                content: 'Book your checkup today:',
                style: { fontSize: 13, color: '#555', paddingTop: 5 }
              },
               {
                id: 'el-t28-ph',
                type: 'text',
                content: '555-TEETH',
                style: { fontSize: 14, color: '#14b8a6', fontWeight: 'bold' }
              }
            ]
          }
        ]
      }
    ]
  },

  // --- INFLUENCER & SOCIAL ---
  {
    id: 't5',
    name: 'Bold Personal',
    category: 'Influencer & Social',
    description: 'High impact name and socials.',
    rows: [
      {
        id: 'row-t5-1',
        style: { paddingTop: 15 },
        columns: [
          {
            id: 'col-t5-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: { textAlign: 'center' },
            elements: [
              {
                id: 'el-t5-name',
                type: 'text',
                content: 'JESSICA V.',
                style: { fontSize: 32, fontWeight: '900', color: '#be185d', textAlign: 'center', letterSpacing: '2px', lineHeight: 1 }
              },
              {
                id: 'el-t5-sub',
                type: 'text',
                content: 'LIFESTYLE & TRAVEL',
                style: { fontSize: 11, color: '#9ca3af', textAlign: 'center', letterSpacing: '3px', paddingBottom: 15, paddingTop: 5 }
              },
              {
                id: 'el-t5-social',
                type: 'social',
                content: '',
                socialLinks: [
                    { network: 'instagram', url: '#' },
                    { network: 'tiktok', url: '#' },
                    { network: 'youtube', url: '#' }
                ],
                style: { textAlign: 'center' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't29',
    name: 'Vlog Gradient',
    category: 'Influencer & Social',
    description: 'Modern gradient feel.',
    rows: [
      {
        id: 'row-t29-1',
        style: {},
        columns: [
          {
            id: 'col-t29-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: { textAlign: 'center' },
            elements: [
              {
                id: 'el-t29-name',
                type: 'text',
                content: 'CASEY CREATES',
                style: { fontSize: 24, fontWeight: 'bold', color: '#a21caf', letterSpacing: '1px' }
              },
              {
                id: 'el-t29-soc',
                type: 'social',
                content: '',
                socialLinks: [{network: 'youtube', url: '#'}, {network: 'instagram', url: '#'}, {network: 'twitter', url: '#'}],
                style: { textAlign: 'center', paddingTop: 12 }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't30',
    name: 'Podcast',
    category: 'Influencer & Social',
    description: 'Promote your show.',
    rows: [
      {
        id: 'row-t30-1',
        style: { borderTop: '2px solid #111', borderBottom: '2px solid #111', paddingTop: 15, paddingBottom: 15 },
        columns: [
          {
            id: 'col-t30-1',
            widthPercent: 60,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t30-name',
                type: 'text',
                content: '<b>The Daily Grind</b> Podcast',
                style: { fontSize: 16, color: '#0f172a' }
              },
              {
                 id: 'el-t30-sub',
                 type: 'text',
                 content: 'New episodes every Tuesday',
                 style: { fontSize: 12, color: '#64748b', fontStyle: 'italic' }
              }
            ]
          },
          {
            id: 'col-t30-2',
            widthPercent: 40,
            verticalAlign: 'middle',
            style: { textAlign: 'right' },
            elements: [
               {
                 id: 'el-t30-btn',
                 type: 'button',
                 content: '▶ Listen',
                 url: '#',
                 style: { backgroundColor: '#0f172a', color: '#fff', borderRadius: 20, fontSize: 11, padding: '6px 16px', fontWeight: 'bold' }
               }
            ]
          }
        ]
      }
    ]
  },

  // --- SUPPORT & SERVICES ---
  {
    id: 't13',
    name: 'Eco Conscious',
    category: 'Support & Services',
    description: 'Green and organic.',
    rows: [
      {
        id: 'row-t13-1',
        style: {},
        columns: [
          {
            id: 'col-t13-1',
            widthPercent: 15,
            verticalAlign: 'top',
            style: {},
            elements: [
               {
                 id: 'el-t13-icon',
                 type: 'text',
                 content: '🌿',
                 style: { fontSize: 36, lineHeight: 1 }
               }
            ]
          },
          {
            id: 'col-t13-2',
            widthPercent: 85,
            verticalAlign: 'top',
            style: { paddingLeft: 10, borderLeft: '1px solid #16a34a' },
            elements: [
               {
                 id: 'el-t13-name',
                 type: 'text',
                 content: 'Leafy Solutions',
                 style: { fontSize: 18, color: '#15803d', fontWeight: 'bold' }
               },
               {
                 id: 'el-t13-addr',
                 type: 'text',
                 content: 'Sustainable Landscaping',
                 style: { fontSize: 13, color: '#4b5563' }
               }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't20',
    name: 'Urgent Alert',
    category: 'Support & Services',
    description: 'High visibility for support.',
    rows: [
      {
        id: 'row-t20-1',
        style: { backgroundColor: '#fef2f2', borderRadius: 8, paddingLeft: 20, paddingRight: 20, paddingTop: 15, paddingBottom: 15, border: '1px solid #fecaca' },
        columns: [
          {
            id: 'col-t20-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: { textAlign: 'center' },
            elements: [
              {
                id: 'el-t20-alert',
                type: 'text',
                content: '<b>🆘 24/7 SUPPORT LINE</b>',
                style: { fontSize: 11, color: '#b91c1c', letterSpacing: '1px' }
              },
              {
                id: 'el-t20-phone',
                type: 'text',
                content: '555-HELP-NOW',
                style: { fontSize: 16, color: '#b91c1c', fontWeight: 'bold', paddingTop: 5 }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't39',
    name: 'Customer Success',
    category: 'Support & Services',
    description: 'Friendly face.',
    rows: [
      {
        id: 'row-t39-1',
        style: {},
        columns: [
          {
            id: 'col-t39-1',
            widthPercent: 20,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t39-img',
                type: 'image',
                content: 'https://ui-avatars.com/api/?name=Happy+Help&background=22c55e&color=fff&rounded=true',
                style: { width: 50, borderRadius: 25 }
              }
            ]
          },
          {
            id: 'col-t39-2',
            widthPercent: 80,
            verticalAlign: 'middle',
            style: { paddingLeft: 15 },
            elements: [
              {
                id: 'el-t39-msg',
                type: 'text',
                content: 'How can I help you today?',
                style: { fontSize: 16, fontWeight: 'bold', color: '#166534' }
              },
              {
                id: 'el-t39-link',
                type: 'text',
                content: 'Rate my support',
                url: '#',
                style: { fontSize: 12, color: '#15803d', textDecoration: 'underline' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 't40',
    name: 'IT Ticket',
    category: 'Support & Services',
    description: 'Ticket submission focus.',
    rows: [
      {
        id: 'row-t40-1',
        style: { backgroundColor: '#eff6ff', borderRadius: 6, padding: '15px', borderLeft: '4px solid #2563eb' },
        columns: [
          {
            id: 'col-t40-1',
            widthPercent: 100,
            verticalAlign: 'middle',
            style: {},
            elements: [
              {
                id: 'el-t40-name',
                type: 'text',
                content: 'IT Support Team',
                style: { fontSize: 15, fontWeight: 'bold', color: '#1e40af' }
              },
              {
                id: 'el-t40-hours',
                type: 'text',
                content: 'Hours: Mon-Fri 9AM - 6PM EST',
                style: { fontSize: 12, color: '#475569', paddingTop: 4 }
              },
              {
                id: 'el-t40-link',
                type: 'button',
                content: 'Submit a Ticket',
                url: '#',
                style: { fontSize: 11, backgroundColor: '#2563eb', color: '#fff', padding: '6px 12px', borderRadius: 4, marginTop: 8 }
              }
            ]
          }
        ]
      }
    ]
  }
];
