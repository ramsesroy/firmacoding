/**
 * Utilidades para generar elementos de validez y seriedad de la firma
 */

/**
 * Genera un hash SHA-256 de una cadena de texto
 * @param text - Texto a hashear
 * @returns Promise con el hash SHA-256 en hexadecimal
 */
export async function generateSHA256Hash(text: string): Promise<string> {
  // Convertir el texto a bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Generar hash SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convertir el hash a array de bytes
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convertir a hexadecimal
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Formatea una fecha a un formato legible
 * @param date - Fecha a formatear
 * @returns String con la fecha formateada
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };
  
  return new Intl.DateTimeFormat('es-ES', options).format(date);
}

/**
 * Genera información de validez para la firma
 * @param htmlContent - Contenido HTML de la firma
 * @param userName - Nombre del usuario que genera la firma
 * @returns Objeto con timestamp, hash y mensaje formateado
 */
export async function generateValidationInfo(
  htmlContent: string,
  userName: string
): Promise<{
  timestamp: Date;
  timestampFormatted: string;
  hash: string;
  hashShort: string;
  message: string;
}> {
  const timestamp = new Date();
  const timestampFormatted = formatDate(timestamp);
  const hash = await generateSHA256Hash(htmlContent);
  const hashShort = hash.substring(0, 16) + '...';
  
  const message = `Firma generada por ${userName} el ${timestampFormatted}`;
  
  return {
    timestamp,
    timestampFormatted,
    hash,
    hashShort,
    message
  };
}

/**
 * Genera el HTML para el log de validez que se muestra en la firma
 * @param validationInfo - Información de validación
 * @returns String con el HTML del log
 */
export function generateValidationLogHTML(validationInfo: {
  timestampFormatted: string;
  hash: string;
  hashShort: string;
  message: string;
}): string {
  return `
    <tr>
      <td colspan="2" style="border-top: 1px solid #e0e0e0; padding-top: 12px; padding-bottom: 8px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; width: 100%;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 9px; color: #888888; line-height: 1.4;">
                <div style="font-family: Arial, sans-serif; margin-bottom: 4px;">
                  <strong style="color: #666666;">✓ Verificación de integridad:</strong><br/>
                  ${escapeHtml(validationInfo.message)}<br/>
                  <span style="font-family: monospace; font-size: 8px; color: #999999;">
                    Hash SHA-256: ${validationInfo.hashShort}${validationInfo.hash.substring(16)}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  `;
}

/**
 * Escapa caracteres HTML especiales
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

