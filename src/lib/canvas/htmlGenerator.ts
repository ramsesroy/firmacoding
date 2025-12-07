import { SignatureRow, SignatureElement, SignatureColumn, GlobalStyles, SignatureState } from '@/types/canvas';

// --- CONFIGURATION ---

const DUMMY_DATA: Record<string, string> = {
  '{{name}}': 'John Doe',
  '{{role}}': 'Managing Director',
  '{{company}}': 'Acme Corp',
  '{{email}}': 'john@acme.com',
  '{{phone}}': '+1 555 0123',
  '{{website}}': 'www.acme.com',
  '{{address}}': '123 Business Rd, NY'
};

// --- SANITIZATION & SECURITY ---

const sanitizeText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sanitizeUrl = (url: string | undefined): string => {
  if (!url) return '#';
  const clean = url.trim();
  if (clean.toLowerCase().startsWith('javascript:') || clean.toLowerCase().startsWith('vbscript:')) {
    return '#';
  }
  return clean;
};

const validateImageUrl = (url: string): string => {
  const clean = sanitizeUrl(url);
  if (clean.startsWith('http:')) {
    return clean.replace('http:', 'https:');
  }
  return clean;
};

// --- PLACEHOLDER SYSTEM ---

const processContent = (content: string, isPreview: boolean): string => {
  if (!content) return '';
  if (!isPreview) return content;

  let processed = content;
  Object.keys(DUMMY_DATA).forEach(key => {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    processed = processed.replace(regex, DUMMY_DATA[key]);
  });
  return processed;
};

// --- STYLING HELPERS ---

const getCommonTdStyles = (globalStyles: GlobalStyles): string => {
  return `font-family: ${globalStyles.fontFamily}; font-size: ${globalStyles.fontSize}px; color: ${globalStyles.textColor}; line-height: 1.4; mso-line-height-rule: exactly;`;
};

// --- RENDERERS ---

const renderSocial = (el: SignatureElement, globalStyles: GlobalStyles, isPreview: boolean): string => {
  const links = el.socialLinks || [];
  if (links.length === 0) return '';

  let iconsHtml = `<table border="0" cellspacing="0" cellpadding="0" role="presentation" style="display: inline-table;"><tr>`;
  
  links.forEach((link) => {
    if (!link.url && !isPreview) return;
    
    const network = link.network.toLowerCase().trim();
    let iconName = network;
    
    // Map network names to Icons8 filenames
    if (network === 'x' || network === 'twitter') iconName = 'twitterx';
    else if (network === 'linkedin') iconName = 'linkedin';
    else if (network === 'facebook') iconName = 'facebook';
    else if (network === 'instagram') iconName = 'instagram-new';
    else if (network === 'youtube') iconName = 'youtube-play';
    else if (network === 'pinterest') iconName = 'pinterest';
    else if (network === 'tiktok') iconName = 'tiktok';
    else if (network === 'whatsapp') iconName = 'whatsapp';
    else if (network === 'telegram') iconName = 'telegram-app';
    else if (network === 'github') iconName = 'github';
    else if (network === 'website') iconName = 'globe';
    
    const iconUrl = `https://img.icons8.com/ios-glyphs/30/000000/${iconName}.png`;
    const safeUrl = sanitizeUrl(link.url);
    
    iconsHtml += `
      <td style="padding-right: 5px;">
        <a href="${safeUrl}" target="_blank" style="border: 0; text-decoration: none;">
          <img src="${iconUrl}" alt="${network}" width="24" height="24" style="display: block; border: 0; outline: none;" />
        </a>
      </td>
    `;
  });
  
  iconsHtml += '</tr></table>';
  return iconsHtml;
};

const renderButton = (el: SignatureElement, globalStyles: GlobalStyles, isPreview: boolean): string => {
  const text = processContent(el.content, isPreview);
  const bgColor = el.style.backgroundColor || globalStyles.themeColor;
  const color = el.style.color || '#ffffff';
  const radius = el.style.borderRadius || 4;
  const url = sanitizeUrl(el.url);
  const padding = el.style.padding || '10px 20px';
  const fontSize = el.style.fontSize || 14;

  // Bulletproof Button for Outlook & Gmail compatibility
  return `
    <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin: 0;">
      <tr>
        <td align="center" bgcolor="${bgColor}" role="presentation" style="border: none; border-radius: ${radius}px; cursor: auto; mso-padding-alt: ${padding}; background: ${bgColor};" valign="middle">
          <a href="${url}" style="display: inline-block; background: ${bgColor}; color: ${color}; font-family: ${globalStyles.fontFamily}; font-size: ${fontSize}px; font-weight: bold; line-height: 1.2; margin: 0; text-decoration: none; text-transform: none; padding: ${padding}; mso-padding-alt: 0px; border-radius: ${radius}px;" target="_blank">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
};

const renderImage = (el: SignatureElement, globalStyles: GlobalStyles, isPreview: boolean): string => {
  const src = validateImageUrl(el.content);
  const rawWidth = el.style.width !== undefined ? el.style.width : 100;
  
  // Logic: If string contains '%', use it in style but not in width attribute (unless parsed).
  // Outlook needs px in width attribute.
  const isPercentage = typeof rawWidth === 'string' && rawWidth.includes('%');
  
  // Try to parse int if possible, otherwise empty for attribute
  let widthAttr = '';
  if (!isPercentage) {
    widthAttr = `width="${parseInt(rawWidth.toString())}"`;
  }
  
  const styleWidth = typeof rawWidth === 'number' ? `${rawWidth}px` : rawWidth;
  const alt = el.alt || 'Signature Image';
  const borderRadius = el.style.borderRadius ? `border-radius: ${el.style.borderRadius}px;` : '';
  
  const imgTag = `<img src="${src}" alt="${alt}" ${widthAttr} style="display: block; width: ${styleWidth}; max-width: 100%; border: 0; outline: none; text-decoration: none; ${borderRadius}" />`;

  if (el.url) {
    return `<a href="${sanitizeUrl(el.url)}" target="_blank" style="border: 0; text-decoration: none;">${imgTag}</a>`;
  }
  return imgTag;
};

const renderText = (el: SignatureElement, globalStyles: GlobalStyles, isPreview: boolean): string => {
  let content = processContent(el.content, isPreview);
  
  const styles: string[] = [];
  styles.push(`font-family: ${el.style.fontFamily || globalStyles.fontFamily}`);
  styles.push(`font-size: ${el.style.fontSize || globalStyles.fontSize}px`);
  styles.push(`color: ${el.style.color || globalStyles.textColor}`);
  styles.push(`line-height: ${el.style.lineHeight || 1.4}`);
  styles.push(`font-weight: ${el.style.fontWeight || 'normal'}`);
  styles.push(`text-align: ${el.style.textAlign || 'left'}`);
  
  if (el.style.uppercase) styles.push('text-transform: uppercase');
  if (el.style.textDecoration) styles.push(`text-decoration: ${el.style.textDecoration}`);
  if (el.style.letterSpacing) styles.push(`letter-spacing: ${el.style.letterSpacing}`);
  
  const styleString = styles.join('; ');

  if (el.url) {
    return `<a href="${sanitizeUrl(el.url)}" target="_blank" style="${styleString}; text-decoration: underline;">${content}</a>`;
  }

  return `<span style="${styleString}">${content}</span>`;
};

// --- MAIN GENERATOR ---

export const generateSignatureHTML = (rows: SignatureRow[], globalStyles: GlobalStyles, isPreview: boolean = true): string => {
  let html = ``;
  
  rows.forEach(row => {
    const rowBg = row.style.backgroundColor ? `background-color: ${row.style.backgroundColor};` : '';
    const rowPadTop = row.style.paddingTop || 0;
    const rowPadBot = row.style.paddingBottom || 0;
    const rowBorderTop = row.style.borderTop ? `border-top: ${row.style.borderTop};` : '';
    const rowBorderBottom = row.style.borderBottom ? `border-bottom: ${row.style.borderBottom};` : '';
    const rowBorderLeft = row.style.borderLeft ? `border-left: ${row.style.borderLeft};` : '';
    
    html += `
    <!-- ROW -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="${rowBg} ${rowBorderTop} ${rowBorderBottom} ${rowBorderLeft}">
      <tr>
        <td style="padding-top: ${rowPadTop}px; padding-bottom: ${rowPadBot}px; ${row.style.paddingLeft ? `padding-left: ${row.style.paddingLeft}px;` : ''} ${row.style.paddingRight ? `padding-right: ${row.style.paddingRight}px;` : ''}">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>
    `;

    row.columns.forEach(col => {
      const colWidth = col.widthPercent ? `width="${col.widthPercent}%"` : '';
      const colStyleWidth = col.widthPercent ? `width: ${col.widthPercent}%;` : '';
      const valign = col.verticalAlign || 'top';
      const colPad = `padding: ${col.style.paddingTop || 0}px ${col.style.paddingRight || 0}px ${col.style.paddingBottom || 0}px ${col.style.paddingLeft || 0}px;`;
      const colBg = col.style.backgroundColor ? `background-color: ${col.style.backgroundColor};` : '';
      const colBorderL = col.style.borderLeft ? `border-left: ${col.style.borderLeft};` : '';
      const colBorderR = col.style.borderRight ? `border-right: ${col.style.borderRight};` : '';

      html += `
              <!-- COLUMN -->
              <td valign="${valign}" ${colWidth} style="${colStyleWidth} ${colPad} ${colBg} ${colBorderL} ${colBorderR} ${getCommonTdStyles(globalStyles)}">
      `;

      col.elements.forEach(el => {
        let elContent = '';
        if (el.type === 'text') elContent = renderText(el, globalStyles, isPreview);
        else if (el.type === 'image') elContent = renderImage(el, globalStyles, isPreview);
        else if (el.type === 'button') elContent = renderButton(el, globalStyles, isPreview);
        else if (el.type === 'social') elContent = renderSocial(el, globalStyles, isPreview);

        const elPadTop = (el.style.paddingTop || 0) + (el.style.marginTop || 0);
        const elPadBot = (el.style.paddingBottom || 0) + (el.style.marginBottom || 0);
        const elPadLeft = (el.style.paddingLeft || 0) + (el.style.marginLeft || 0);
        const elPadRight = (el.style.paddingRight || 0) + (el.style.marginRight || 0);
        const elAlign = el.style.textAlign || 'left';
        
        // Wrap every element in a table row to ensure block stacking in Outlook
        // FIX: Added padding-left and padding-right to the TD to allow "Spacing" movement
        html += `
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                  <tr>
                    <td align="${elAlign}" style="padding-top: ${elPadTop}px; padding-bottom: ${elPadBot}px; padding-left: ${elPadLeft}px; padding-right: ${elPadRight}px;">
                      ${elContent}
                    </td>
                  </tr>
                </table>
        `;
      });

      html += `
              </td>
      `;
    });

    html += `
            </tr>
          </table>
        </td>
      </tr>
    </table>
    `;
  });

  return html;
};

// --- EXPORT FUNCTION ---

export const exportSignature = (state: SignatureState): string => {
  const bodyContent = generateSignatureHTML(state.rows, state.globalStyles, false);
  const minifiedBody = bodyContent.replace(/>\s+</g, '><').trim();

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<!--[if !mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!--<![endif]-->
<style type="text/css">
  body, table, td { font-family: ${state.globalStyles.fontFamily}, Arial, sans-serif !important; }
  a { text-decoration: none; color: inherit; }
  a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
  a[href^="tel"], a[href^="sms"] { color: inherit; cursor: default; text-decoration: none; }
</style>
<!--[if mso]>
<style type="text/css">
  body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
</style>
<![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  ${minifiedBody}
</body>
</html>`;
};
