import { SignatureProps, TemplateType, RedSocial } from "@/types/signature";

export function generateSignatureHTML(
  data: SignatureProps,
  template: TemplateType
): string {
  const { nombre, cargo, foto, telefono, redes = [] } = data;

  switch (template) {
    case "classic":
      return generateClassicHTML(nombre, cargo, foto, telefono, redes);
    case "modern":
      return generateModernHTML(nombre, cargo, foto, telefono, redes);
    case "minimal":
      return generateMinimalHTML(nombre, cargo, foto, telefono, redes);
    default:
      return generateClassicHTML(nombre, cargo, foto, telefono, redes);
  }
}

function generateClassicHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; padding-bottom: 10px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; display: block; border: 1px solid #dddddd;" />
      </td>`
    : "";

  const telefonoHTML = telefono
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 5px; line-height: 1.5;">
          <span style="font-family: Arial, sans-serif; color: #666666;">Tel:</span> <span style="font-family: Arial, sans-serif; color: #666666;">${escapeHtml(telefono)}</span>
        </td>
      </tr>`
    : "";

  const redesHTML =
    redes.length > 0
      ? `<tr>
          <td style="padding-top: 8px; font-family: Arial, sans-serif;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
              <tbody>
                <tr>
                  ${redes
                    .map(
                      (red, index) =>
                        `<td style="padding-right: ${
                          index < redes.length - 1 ? "10px" : "0"
                        }; font-family: Arial, sans-serif;">
                          <a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #007bff; text-decoration: none; font-size: 12px;">
                            ${escapeHtml(red.nombre)}
                          </a>
                        </td>`
                    )
                    .join("")}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>`
      : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.5;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="padding-bottom: 10px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 8px; line-height: 1.5;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${telefonoHTML}
            ${redesHTML}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateModernHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const fotoHTML = foto
    ? `<td valign="top" rowspan="3" style="padding-right: 20px; padding-bottom: 10px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; display: block; border: 3px solid #0066cc;" />
      </td>`
    : "";

  const telefonoHTML = telefono
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 8px; line-height: 1.6;">
          <span style="font-family: Arial, sans-serif; color: #666666;">📞</span> <span style="font-family: Arial, sans-serif; color: #666666;">${escapeHtml(telefono)}</span>
        </td>
      </tr>`
    : "";

  const redesHTML =
    redes.length > 0
      ? `<tr>
          <td style="padding-top: 5px; font-family: Arial, sans-serif;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
              <tbody>
                <tr>
                  ${redes
                    .map(
                      (red, index) =>
                        `<td style="padding-right: ${
                          index < redes.length - 1 ? "12px" : "0"
                        }; font-family: Arial, sans-serif;">
                          <a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #007bff; text-decoration: none; font-size: 12px; border-bottom: 1px solid #007bff;">
                            ${escapeHtml(red.nombre)}
                          </a>
                        </td>`
                    )
                    .join("")}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>`
      : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6;">
  <tbody>
    <tr>
      <td style="border-left: 4px solid #0066cc; padding-left: 15px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              ${fotoHTML}
              <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #333333; padding-bottom: 5px; line-height: 1.6;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 8px; line-height: 1.6;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${telefonoHTML}
            ${redesHTML}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateMinimalHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 15px; width: 70px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; display: block;" />
      </td>`
    : "";

  const telefonoHTML = telefono
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 3px; line-height: 1.8;">
          ${escapeHtml(telefono)}
        </td>
      </tr>`
    : "";

  const redesHTML =
    redes.length > 0
      ? `<tr>
          <td style="padding-top: 5px; font-family: Arial, sans-serif;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
              <tbody>
                <tr>
                  ${redes
                    .map(
                      (red, index) =>
                        `<td style="padding-right: ${
                          index < redes.length - 1 ? "8px" : "0"
                        }; font-family: Arial, sans-serif;">
                          <a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #007bff; text-decoration: none; font-size: 11px;">
                            ${escapeHtml(red.nombre)}
                          </a>
                          ${
                            index < redes.length - 1
                              ? '<span style="font-family: Arial, sans-serif; color: #cccccc; padding-left: 8px;">|</span>'
                              : ""
                          }
                        </td>`
                    )
                    .join("")}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>`
      : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px; color: #333333; line-height: 1.8;">
  <tbody>
    <tr>
      <td style="border-top: 1px solid #dddddd; border-bottom: 1px solid #dddddd; padding: 12px 0; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              ${fotoHTML}
              <td valign="top" style="font-family: Arial, sans-serif;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      <td style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #333333; padding-bottom: 3px; line-height: 1.8;">
                        ${escapeHtml(nombre)}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 5px; line-height: 1.8;">
                        ${escapeHtml(cargo)}
                      </td>
                    </tr>
                    ${telefonoHTML}
                    ${redesHTML}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function copyToClipboard(
  data: SignatureProps,
  template: TemplateType
): Promise<boolean> {
  // Generar el contenido HTML
  const htmlContent = generateSignatureHTML(data, template);

  try {
    // Crear un ClipboardItem con ambos formatos
    // text/html: Para que se renderice en Gmail/clientes de correo
    // text/plain: Contiene el HTML crudo para editores de código
    const clipboardItem = new ClipboardItem({
      "text/html": new Blob([htmlContent], { type: "text/html" }),
      "text/plain": new Blob([htmlContent], { type: "text/plain" }),
    });

    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    // Fallback para navegadores que no soportan ClipboardItem con múltiples tipos
    console.warn("ClipboardItem not supported, using fallback:", error);
    
    try {
      // Crear un elemento temporal con el HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      // Seleccionar todo el contenido
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      // Copiar usando el comando execCommand (fallback)
      const success = document.execCommand("copy");
      
      document.body.removeChild(tempDiv);
      selection?.removeAllRanges();

      return success;
    } catch (fallbackError) {
      console.error("Failed to copy to clipboard:", fallbackError);
      return false;
    }
  }
}
