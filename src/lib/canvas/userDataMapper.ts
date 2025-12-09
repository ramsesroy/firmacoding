/**
 * User Data Mapper for Canvas Editor Templates
 * Automatically maps user data to template placeholders and content
 */

import { supabase } from '@/lib/supabaseClient';
import { SignatureRow, SignatureElement } from '@/types/canvas';

export interface UserData {
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  phone?: string;
  website?: string;
  address?: string;
  photo?: string;
  socialLinks?: Array<{ network: string; url: string }>;
}

/**
 * Get user data from dashboard signature or user profile
 */
export async function getUserData(): Promise<UserData> {
  try {
    // First, try to get from localStorage (dashboard signature data)
    if (typeof window !== 'undefined') {
      try {
        const dashboardData = localStorage.getItem('signatureData');
        if (dashboardData) {
          const parsed = JSON.parse(dashboardData);
          // Map dashboard signature format to Canvas format
          const socialLinks = parsed.redes?.map((r: any) => {
            // Map common social network names
            let network = (r.nombre || 'linkedin').toLowerCase();
            if (network.includes('linkedin')) network = 'linkedin';
            else if (network.includes('twitter') || network.includes('x')) network = 'twitter';
            else if (network.includes('github')) network = 'github';
            else if (network.includes('instagram')) network = 'instagram';
            else if (network.includes('facebook')) network = 'facebook';
            else if (network.includes('youtube')) network = 'youtube';
            else network = network.replace(/\s+/g, '');
            
            return {
              network: network,
              url: r.url || '#'
            };
          }).filter((l: any) => l.url && l.url !== '#') || [];
          
          return {
            name: parsed.nombre || '',
            email: parsed.email || '',
            role: parsed.cargo || '',
            company: parsed.empresa || '',
            phone: parsed.telefono || parsed.telefonoMovil || '',
            website: parsed.website || '',
            address: parsed.direccion || '',
            photo: parsed.foto || '',
            socialLinks: socialLinks.length > 0 ? socialLinks : undefined,
          };
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }

    // Try to get from user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return {};
    }

    // Try to get from saved signatures (most recent)
    const { data: signatures, error } = await supabase
      .from('signatures')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (!error && signatures && signatures.length > 0) {
      const sig = signatures[0];
      const socialLinks = sig.social_links 
        ? (Array.isArray(sig.social_links) 
            ? sig.social_links.map((l: any) => ({
                network: (l.network || l.nombre || 'linkedin').toLowerCase(),
                url: l.url || '#'
              }))
            : [])
        : undefined;
      
      return {
        name: sig.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
        email: session.user.email || '',
        role: sig.role || '',
        company: sig.company || '',
        phone: sig.phone || '',
        website: sig.website || '',
        address: sig.address || '',
        photo: sig.image_url || '',
        socialLinks: socialLinks,
      };
    }

    // Fallback to user metadata
    return {
      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
      email: session.user.email || '',
      role: session.user.user_metadata?.role || '',
      company: session.user.user_metadata?.company || '',
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {};
  }
}

/**
 * Smart content replacement - detects and replaces user data in template content
 */
function replaceContent(content: string, userData: UserData): string {
  if (!content || !userData) return content;

  let processed = content;

  // Standard placeholder replacements
  const replacements: Record<string, string> = {
    '{{name}}': userData.name || '',
    '{{role}}': userData.role || '',
    '{{company}}': userData.company || '',
    '{{email}}': userData.email || '',
    '{{phone}}': userData.phone || '',
    '{{website}}': userData.website || '',
    '{{address}}': userData.address || '',
  };

  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    processed = processed.replace(regex, replacements[placeholder]);
  });

  // Smart detection: Replace common patterns if placeholders weren't found
  if (userData.name) {
    const userName = userData.name; // Store in const for TypeScript narrowing
    // Detect common name patterns (all caps, title case, etc.)
    const namePatterns = [
      /\b(?:ALEX|JOHN|JANE|MORGAN|DOE|AMANDA|SARAH|HAPPY)\s+(?:MORGAN|JOHNSON|DOE|SMITH|HELP)\b/gi,
      /\b(?:Alex|John|Jane|Morgan|Doe|Amanda|Sarah|Happy)\s+(?:Morgan|Johnson|Doe|Smith|Help)\b/gi,
      /\b[A-Z][A-Z\s]{3,}(?:MORGAN|JOHN|DOE|ALEX|JANE)\b/gi,
    ];
    namePatterns.forEach(pattern => {
      if (pattern.test(processed) && !processed.includes(userName)) {
        // Preserve original case style if all caps
        const isAllCaps = processed.match(pattern)?.[0]?.toUpperCase() === processed.match(pattern)?.[0];
        const replacement = isAllCaps ? userName.toUpperCase() : userName;
        processed = processed.replace(pattern, replacement);
      }
    });
  }

  if (userData.email) {
    const userEmail = userData.email; // Store in const for TypeScript narrowing
    // Replace email patterns in text and mailto links
    const emailPatterns = [
      /\b[a-z]+@[a-z]+\.[a-z]+\b/gi,
      /\balex@corp\.com\b/gi,
      /\bjohn@acme\.com\b/gi,
      /\b[a-z]+@[a-z-]+\.(?:com|org|net|io)\b/gi,
    ];
    emailPatterns.forEach(pattern => {
      if (pattern.test(processed) && !processed.includes(userEmail)) {
        processed = processed.replace(pattern, userEmail);
      }
    });
    
    // Replace in HTML spans (like "E: alex@corp.com")
    const htmlEmailPattern = /(<span[^>]*>E:<\/span>)\s*[a-z]+@[a-z]+\.[a-z]+/gi;
    if (htmlEmailPattern.test(processed)) {
      processed = processed.replace(htmlEmailPattern, `$1 ${userEmail}`);
    }
    
    // Also replace in mailto: links
    processed = processed.replace(/mailto:[^"'\s<>]+/gi, `mailto:${userEmail}`);
  }

  if (userData.role) {
    const userRole = userData.role; // Store in const for TypeScript narrowing
    // Replace common role patterns (case-insensitive)
    const rolePatterns = [
      /\bExecutive Director\b/gi,
      /\bManaging Director\b/gi,
      /\bSenior Product Designer\b/gi,
      /\bFull Stack Developer\b/gi,
      /\bProduct Manager\b/gi,
      /\bCreative Director\b/gi,
      /\bMarketing Manager\b/gi,
      /\bSales Director\b/gi,
      /\bCEO\b/gi,
      /\bCTO\b/gi,
      /\bCFO\b/gi,
    ];
    rolePatterns.forEach(pattern => {
      if (pattern.test(processed) && !processed.includes(userRole)) {
        processed = processed.replace(pattern, userRole);
      }
    });
  }

  if (userData.phone) {
    const userPhone = userData.phone; // Store in const for TypeScript narrowing
    // Replace phone patterns in HTML content
    const phonePatterns = [
      /\+1\s*555\s*[0-9\s-]+/g,
      /\+1\s*\(555\)\s*[0-9\s()-]+/g,
      /\+1\s*\(555\)\s*123-4567/g,
      /\+1\s*\(555\)\s*0123\s*456/g,
    ];
    
    // Replace in HTML spans (like "M: +1 555...")
    phonePatterns.forEach(pattern => {
      if (pattern.test(processed) && !processed.includes(userPhone)) {
        processed = processed.replace(pattern, userPhone);
      }
    });
    
    // Also replace in structured HTML like <span>M:</span> +1 555...
    const htmlPhonePattern = /(<span[^>]*>M:<\/span>)\s*\+1\s*[0-9\s()-]+/gi;
    if (htmlPhonePattern.test(processed)) {
      processed = processed.replace(htmlPhonePattern, `$1 ${userPhone}`);
    }
  }

  return processed;
}

/**
 * Replace user data in image URLs (for avatar/profile photos)
 */
function replaceImageUrl(url: string, userData: UserData): string {
  if (!url || !userData.name) return url;

  const userName = userData.name; // Store in const for TypeScript narrowing

  // Replace UI Avatars API placeholders
  if (url.includes('ui-avatars.com')) {
    const nameParam = userName.replace(/\s+/g, '+');
    return url.replace(/name=[^&]+/, `name=${nameParam}`);
  }

  // If user has a photo, use it
  if (userData.photo && !url.includes('ui-avatars.com') && !url.includes('picsum.photos')) {
    return userData.photo;
  }

  return url;
}

/**
 * Apply user data to a template row
 */
function applyUserDataToRow(row: SignatureRow, userData: UserData): SignatureRow {
  return {
    ...row,
    columns: row.columns.map(col => ({
      ...col,
      elements: col.elements.map(el => {
        const updatedEl: SignatureElement = { ...el };

        // Replace content in text elements
        if (el.type === 'text' && el.content) {
          updatedEl.content = replaceContent(el.content, userData);
        }

        // Replace URLs in text elements that have mailto: links or email placeholders
        if (el.type === 'text' && el.url) {
          if (el.url.includes('{{email}}')) {
            updatedEl.url = el.url.replace(/{{email}}/gi, userData.email || '');
          } else if (userData.email && el.url.startsWith('mailto:')) {
            // Replace any email in mailto: link
            const userEmail = userData.email; // Store in const for TypeScript narrowing
            updatedEl.url = `mailto:${userEmail}`;
          }
        }

        // Replace image URLs (avatars, profile photos)
        if (el.type === 'image' && el.content) {
          updatedEl.content = replaceImageUrl(el.content, userData);
        }

        // Replace social links if user has them
        if (el.type === 'social' && userData.socialLinks && userData.socialLinks.length > 0) {
          updatedEl.socialLinks = userData.socialLinks.map(link => ({
            network: link.network.toLowerCase(),
            url: link.url || '#'
          }));
        }

        return updatedEl;
      })
    }))
  };
}

/**
 * Apply user data to template rows
 */
export async function applyUserDataToTemplate(rows: SignatureRow[]): Promise<SignatureRow[]> {
  const userData = await getUserData();
  
  // If no user data, return original rows
  if (!userData.name && !userData.email) {
    return rows;
  }

  // Deep clone to avoid mutating original
  const clonedRows = JSON.parse(JSON.stringify(rows));
  
  // Apply user data to each row
  return clonedRows.map((row: SignatureRow) => applyUserDataToRow(row, userData));
}
