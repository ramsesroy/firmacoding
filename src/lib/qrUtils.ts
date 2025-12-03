/**
 * Generates the URL of a QR code using a public API
 * @param text - Text or URL to generate the QR code
 * @param size - QR code size in pixels (default: 200)
 * @returns URL of the QR code image
 */
export function generateQRCodeURL(text: string, size: number = 200): string {
  // Use public QR code API (qrcode.tec-it.com or similar)
  // Escape text for URL
  const encodedText = encodeURIComponent(text);
  
  // QR Server API - free and reliable
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
}

/**
 * Generates the URL of a QR code for a vCard (contact)
 * @param contactData - Contact data
 * @param size - QR code size in pixels (default: 200)
 * @returns URL of the QR code image
 */
export function generateVCardQRCodeURL(
  contactData: {
    nombre: string;
    telefono?: string;
    email?: string;
    cargo?: string;
    empresa?: string;
    website?: string;
  },
  size: number = 200
): string {
  // Construir vCard format
  let vCard = "BEGIN:VCARD\n";
  vCard += "VERSION:3.0\n";
  vCard += `FN:${contactData.nombre}\n`;
  
  if (contactData.cargo) {
    vCard += `TITLE:${contactData.cargo}\n`;
  }
  
  if (contactData.telefono) {
    vCard += `TEL:${contactData.telefono}\n`;
  }
  
  if (contactData.email) {
    vCard += `EMAIL:${contactData.email}\n`;
  }
  
  if (contactData.empresa) {
    vCard += `ORG:${contactData.empresa}\n`;
  }
  
  if (contactData.website) {
    vCard += `URL:${contactData.website}\n`;
  }
  
  vCard += "END:VCARD";
  
  return generateQRCodeURL(vCard, size);
}


