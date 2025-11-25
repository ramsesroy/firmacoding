/**
 * Genera la URL de un código QR usando una API pública
 * @param text - Texto o URL para generar el QR
 * @param size - Tamaño del QR en píxeles (default: 200)
 * @returns URL de la imagen del código QR
 */
export function generateQRCodeURL(text: string, size: number = 200): string {
  // Usar API pública de QR code (qrcode.tec-it.com o similar)
  // Escapar el texto para la URL
  const encodedText = encodeURIComponent(text);
  
  // API de QR Server - gratuita y confiable
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
}

/**
 * Genera la URL de un código QR para un vCard (contacto)
 * @param contactData - Datos del contacto
 * @param size - Tamaño del QR en píxeles (default: 200)
 * @returns URL de la imagen del código QR
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


