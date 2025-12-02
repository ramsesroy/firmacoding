import { SignatureProps, TemplateType, RedSocial } from "@/types/signature";
import { generateQRCodeURL } from "./qrUtils";

export async function generateSignatureHTML(
  data: SignatureProps,
  template: TemplateType,
  userName: string = "Usuario"
): Promise<string> {
  const { nombre, cargo, foto, telefono, redes = [], horario, textoAdicional, colorPersonalizado, qrLink, logoEmpresa, ctaTexto, telefonoMovil, direccion, iconoTelefono, iconoTelefonoMovil, iconoDireccion } = data;

  let baseHTML: string;
  
  switch (template) {
    case "professional":
      baseHTML = generateProfessionalHTML(nombre, cargo, telefono, redes, logoEmpresa, telefonoMovil, direccion, iconoTelefono, iconoTelefonoMovil, iconoDireccion);
      break;
    case "classic":
      baseHTML = generateClassicHTML(nombre, cargo, foto, telefono, redes);
      break;
    case "modern":
      baseHTML = generateModernHTML(nombre, cargo, foto, telefono, redes);
      break;
    case "modernaSinBarra":
      baseHTML = generateTemplate02HTML(nombre, cargo, foto, telefono, redes, colorPersonalizado);
      break;
    case "qrProfesional":
      baseHTML = generateTemplate06HTML(nombre, cargo, foto, telefono, redes, horario, qrLink);
      break;
    case "developerMinimal2025":
      baseHTML = generateDeveloperMinimal2025HTML(nombre, cargo, foto, telefono, redes);
      break;
    case "ultraMinimal":
      baseHTML = generateUltraMinimalHTML(nombre, cargo, redes);
      break;
    case "growthMarketing":
      baseHTML = generateGrowthMarketingHTML(nombre, cargo, foto, redes, ctaTexto);
      break;
    case "freelanceDesigner":
      baseHTML = generateFreelanceDesignerHTML(nombre, cargo, foto, telefono, redes);
      break;
    case "corporateConsultant":
      baseHTML = generateCorporateConsultantHTML(nombre, cargo, logoEmpresa, telefono, redes, textoAdicional);
      break;
    case "interiorDesign":
      baseHTML = generateInteriorDesignHTML(nombre, cargo, foto, logoEmpresa, telefono, redes, direccion);
      break;
    case "universityProfessor":
      baseHTML = generateUniversityProfessorHTML(nombre, cargo, logoEmpresa, telefono, telefonoMovil, redes, direccion);
      break;
    case "universityBanner":
      baseHTML = generateUniversityBannerHTML(nombre, cargo, foto, telefono, telefonoMovil, redes, direccion, textoAdicional);
      break;
    case "creativePortfolio":
      baseHTML = generateCreativePortfolioHTML(nombre, cargo, foto, telefono, redes);
      break;
    case "militaryProfessional":
      baseHTML = generateMilitaryProfessionalHTML(nombre, cargo, telefono, redes, direccion);
      break;
    case "churchProfessional":
      baseHTML = generateChurchProfessionalHTML(nombre, cargo, logoEmpresa, telefono, telefonoMovil, redes);
      break;
    case "universityPresident":
      baseHTML = generateUniversityPresidentHTML(nombre, cargo, logoEmpresa, telefono, telefonoMovil, redes, direccion, textoAdicional);
      break;
    case "pastorSignature":
      baseHTML = generatePastorSignatureHTML(nombre, cargo, foto, logoEmpresa, telefono, redes, direccion, textoAdicional);
      break;
    case "lawStudent":
      baseHTML = generateLawStudentHTML(nombre, cargo, foto, telefono, telefonoMovil, redes, direccion, textoAdicional);
      break;
    case "greenExecutive":
      baseHTML = generateGreenExecutiveHTML(nombre, cargo, telefono, redes, textoAdicional);
      break;
    default:
      baseHTML = generateClassicHTML(nombre, cargo, foto, telefono, redes);
  }

  // Retornar el HTML sin información de validación
  return baseHTML;
}

// Función para obtener solo el HTML base sin validación (útil para calcular hash)
export function getBaseSignatureHTML(
  data: SignatureProps,
  template: TemplateType
): string {
  const { nombre, cargo, foto, telefono, redes = [], horario, textoAdicional, colorPersonalizado, qrLink, logoEmpresa, ctaTexto, telefonoMovil, direccion, iconoTelefono, iconoTelefonoMovil, iconoDireccion } = data;
  
  switch (template) {
    case "professional":
      return generateProfessionalHTML(nombre, cargo, telefono, redes, logoEmpresa, telefonoMovil, direccion, iconoTelefono, iconoTelefonoMovil, iconoDireccion);
    case "classic":
      return generateClassicHTML(nombre, cargo, foto, telefono, redes);
    case "modern":
      return generateModernHTML(nombre, cargo, foto, telefono, redes);
    case "modernaSinBarra":
      return generateTemplate02HTML(nombre, cargo, foto, telefono, redes, colorPersonalizado);
    case "qrProfesional":
      return generateTemplate06HTML(nombre, cargo, foto, telefono, redes, horario, qrLink);
    case "developerMinimal2025":
      return generateDeveloperMinimal2025HTML(nombre, cargo, foto, telefono, redes);
    case "ultraMinimal":
      return generateUltraMinimalHTML(nombre, cargo, redes);
    case "growthMarketing":
      return generateGrowthMarketingHTML(nombre, cargo, foto, redes, ctaTexto);
    case "freelanceDesigner":
      return generateFreelanceDesignerHTML(nombre, cargo, foto, telefono, redes);
    case "corporateConsultant":
      return generateCorporateConsultantHTML(nombre, cargo, logoEmpresa, telefono, redes, textoAdicional);
    case "interiorDesign":
      return generateInteriorDesignHTML(nombre, cargo, foto, logoEmpresa, telefono, redes, direccion);
    case "universityProfessor":
      return generateUniversityProfessorHTML(nombre, cargo, logoEmpresa, telefono, telefonoMovil, redes, direccion);
    case "universityBanner":
      return generateUniversityBannerHTML(nombre, cargo, foto, telefono, telefonoMovil, redes, direccion, textoAdicional);
    case "creativePortfolio":
      return generateCreativePortfolioHTML(nombre, cargo, foto, telefono, redes);
    case "militaryProfessional":
      return generateMilitaryProfessionalHTML(nombre, cargo, telefono, redes, direccion);
    case "churchProfessional":
      return generateChurchProfessionalHTML(nombre, cargo, logoEmpresa, telefono, telefonoMovil, redes);
    case "universityPresident":
      return generateUniversityPresidentHTML(nombre, cargo, logoEmpresa, telefono, telefonoMovil, redes, direccion, textoAdicional);
    case "pastorSignature":
      return generatePastorSignatureHTML(nombre, cargo, foto, logoEmpresa, telefono, redes, direccion, textoAdicional);
    case "lawStudent":
      return generateLawStudentHTML(nombre, cargo, foto, telefono, telefonoMovil, redes, direccion, textoAdicional);
    case "greenExecutive":
      return generateGreenExecutiveHTML(nombre, cargo, telefono, redes, textoAdicional);
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
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="80" height="80" style="width: 80px; height: 80px; display: block; border: 1px solid #dddddd;" />
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
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="100" height="100" style="width: 100px; height: 100px; display: block; border: 3px solid #0066cc;" />
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
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="70" height="70" style="width: 70px; height: 70px; display: block;" />
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

// Professional: Most Popular - Clean two-column design with company logo
function generateProfessionalHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  logoEmpresa?: string,
  telefonoMovil?: string,
  direccion?: string,
  iconoTelefono?: string,
  iconoTelefonoMovil?: string,
  iconoDireccion?: string
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;

  // Iconos por defecto
  const iconoTel = iconoTelefono || "📞";
  const iconoTelMovil = iconoTelefonoMovil || "📱";
  const iconoDir = iconoDireccion || "📍";

  // Buscar email y website en redes sociales
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => r.url.includes("www") || r.url.includes("http") && !r.url.includes("@"));

  // Construir contactos
  const contactos = [];
  
  if (telefono) {
    contactos.push(`<tr>
      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 6px; line-height: 1.6;">
        <span style="font-family: Arial, sans-serif; color: #333333; font-size: 13px;">${iconoTel}</span> <span style="font-family: Arial, sans-serif; color: #666666;">${escapeHtml(telefono)}</span>
      </td>
    </tr>`);
  }
  
  if (telefonoMovil) {
    contactos.push(`<tr>
      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 6px; line-height: 1.6;">
        <span style="font-family: Arial, sans-serif; color: #333333; font-size: 13px;">${iconoTelMovil}</span> <span style="font-family: Arial, sans-serif; color: #666666;">${escapeHtml(telefonoMovil)}</span>
      </td>
    </tr>`);
  }
  
  if (email) {
    const emailIcon = email.icono || "✉️";
    contactos.push(`<tr>
      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 6px; line-height: 1.6;">
        <span style="font-family: Arial, sans-serif; color: #333333; font-size: 13px;">${emailIcon}</span> <a href="${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none;">${escapeHtml(email.url)}</a>
      </td>
    </tr>`);
  }
  
  if (direccion) {
    contactos.push(`<tr>
      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 6px; line-height: 1.6;">
        <span style="font-family: Arial, sans-serif; color: #333333; font-size: 13px;">${iconoDir}</span> <span style="font-family: Arial, sans-serif; color: #666666;">${escapeHtml(direccion)}</span>
      </td>
    </tr>`);
  }
  
  if (website) {
    const websiteIcon = website.icono || "🌐";
    contactos.push(`<tr>
      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.6;">
        <span style="font-family: Arial, sans-serif; color: #333333; font-size: 13px;">${websiteIcon}</span> <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none;">${escapeHtml(website.url)}</a>
      </td>
    </tr>`);
  }

  const logoHTML = logoEmpresa
    ? `<img src="${escapeHtml(logoEmpresa)}" alt="Logo" width="120" height="40" style="width: 120px; max-width: 120px; height: 40px; display: block; border: 0;" />`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      <td valign="top" style="padding-right: 40px; font-family: Arial, sans-serif;">
        ${logoHTML}
      </td>
      <td valign="top" style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #333333; padding-bottom: 8px; line-height: 1.3; text-transform: uppercase;">
                ${escapeHtml(nombre.toUpperCase())}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 11px; color: #cccccc; text-align: center; padding-bottom: 4px; line-height: 1.2; letter-spacing: 2px;">
                &bull; &bull; &bull;
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px; line-height: 1.4;">
                ${escapeHtml(cargoTitle.toUpperCase())}
              </td>
            </tr>
            ${contactos.join("")}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// Minimal Corporate: Dos columnas separadas por línea vertical
function generateTemplate01HTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;
  const company = cargoParts[1] || "";
  const email = redes.find((r) => r.nombre.toLowerCase().includes("email") || r.url.includes("@"));
  const website = redes.find((r) => r.nombre.toLowerCase().includes("website") || r.url.includes("www"));

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6;">
  <tbody>
    <tr>
      <td valign="top" style="padding-right: 30px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #333333; padding-bottom: 8px; line-height: 1.4;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
                ${escapeHtml(cargoTitle)}${company ? ` | ${escapeHtml(company)}` : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      <td valign="top" style="border-left: 1px solid #e0e0e0; padding-left: 30px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 6px; line-height: 1.6;">
                <span style="font-family: Arial, sans-serif; font-weight: 600;">Phone:</span> <span style="font-family: Arial, sans-serif; color: #333333;">${escapeHtml(telefono)}</span>
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 6px; line-height: 1.6;">
                <span style="font-family: Arial, sans-serif; font-weight: 600;">Email:</span> <span style="font-family: Arial, sans-serif; color: #333333;">${escapeHtml(email.url)}</span>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; line-height: 1.6;">
                <span style="font-family: Arial, sans-serif; font-weight: 600;">Website:</span> <span style="font-family: Arial, sans-serif; color: #333333;">${escapeHtml(website.url)}</span>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// Moderna sin barra: Foto circular con borde color personalizable
function generateTemplate02HTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  colorPersonalizado?: string
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;
  const company = cargoParts[1] || "";

  // Color por defecto: #0066cc (azul), o color personalizado
  const accentColor = colorPersonalizado || "#0066cc";

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="100" height="100" style="width: 100px; height: 100px; display: block; border: 3px solid ${accentColor};" />
      </td>`
    : "";

  const redesLinks = redes.slice(0, 3)
    .map(
      (red) =>
        `<td style="padding-right: 12px; font-family: Arial, sans-serif;">
          <a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none; font-size: 12px; border-bottom: 1px solid ${accentColor};">
            ${escapeHtml(red.nombre)}
          </a>
        </td>`
    )
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #000000; padding-bottom: 5px; line-height: 1.4;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: ${accentColor}; padding-bottom: 8px; border-bottom: 1px solid ${accentColor}; line-height: 1.4;">
                ${escapeHtml(cargoTitle)}
              </td>
            </tr>
            ${company ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #999999; padding-bottom: 12px; line-height: 1.4;">
                ${escapeHtml(company)}
              </td>
            </tr>` : ""}
            ${telefono || redesLinks ? `<tr>
              <td style="padding-top: 8px; font-family: Arial, sans-serif;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    ${telefono ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 4px;">
                        <span style="font-family: Arial, sans-serif; color: #666666;">📞</span> ${escapeHtml(telefono)}
                      </td>
                    </tr>` : ""}
                    ${redesLinks ? `<tr>
                      <td style="padding-top: 8px; font-family: Arial, sans-serif;">
                        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                          <tbody>
                            <tr>
                              ${redesLinks}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>` : ""}
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// Enterprise Vintage: Logo de empresa, línea azul, dos columnas, aviso confidencial, texto adicional
function generateTemplate03HTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  textoAdicional?: string,
  logoEmpresa?: string
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;
  const company = cargoParts[1] || "";
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));

  const logoSectionHTML = logoEmpresa
    ? `<tr>
      <td colspan="2" style="background-color: #f5f5f5; padding: 8px 12px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif;">
                <img src="${escapeHtml(logoEmpresa)}" alt="Logo" width="40" height="40" style="width: 40px; height: 40px; display: block; border: 0;" />
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    ${logoSectionHTML}
    <tr>
      <td colspan="2" style="height: 3px; background-color: #1e40af; padding: 0; font-family: Arial, sans-serif;">
        &nbsp;
      </td>
    </tr>
    <tr>
      <td valign="top" style="padding-right: 40px; padding-top: 15px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #000000; padding-bottom: 6px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; padding-bottom: 6px; line-height: 1.4;">
                ${escapeHtml(cargoTitle)}
              </td>
            </tr>
            ${company ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #333333; line-height: 1.4;">
                ${escapeHtml(company)}
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
      <td valign="top" style="padding-top: 15px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 4px; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: bold;">O:</span> ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${textoAdicional ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 4px; line-height: 1.5;">
                ${escapeHtml(textoAdicional)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 4px; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: bold;">E:</span> <a href="${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: underline;">${escapeHtml(email.url)}</a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: bold;">W:</span> <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: underline;">${escapeHtml(website.url)}</a>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border-top: 1px solid #e0e0e0; padding-top: 12px; padding-bottom: 8px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 11px; color: #999999; font-style: italic; line-height: 1.5;">
                CONFIDENTIALITY NOTICE: This email and any attachments are for the sole use of the intended recipient(s) and may contain confidential and privileged information. Any unauthorized review, use, disclosure, or distribution is prohibited.
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// Modern 2: Foto cuadrada redondeada, línea vertical azul
function generateTemplate05HTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;
  const company = cargoParts[1] || "";
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="80" height="80" style="width: 80px; height: 80px; display: block; border: 0;" />
      </td>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="border-left: 2px solid #0066cc; padding-left: 20px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #0066cc; padding-bottom: 6px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 10px; line-height: 1.4;">
                ${escapeHtml(cargoTitle)}${company ? ` | <span style="font-family: Arial, sans-serif; color: #666666;">${escapeHtml(company)}</span>` : ""}
              </td>
            </tr>
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 12px; color: #333333; padding-bottom: 4px; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: 600; color: #0066cc;">P:</span> <span style="font-family: Arial, sans-serif; color: #333333;">${escapeHtml(telefono)}</span>
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 12px; color: #333333; padding-bottom: 4px; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: 600; color: #0066cc;">E:</span> <span style="font-family: Arial, sans-serif; color: #333333;">${escapeHtml(email.url)}</span>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 12px; color: #333333; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: 600; color: #0066cc;">W:</span> <span style="font-family: Arial, sans-serif; color: #333333;">${escapeHtml(website.url)}</span>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// QR Profesional: Con QR code, líneas punteadas, redes sociales, horario
function generateTemplate06HTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  horario?: string,
  qrLink?: string
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www")) || redes.find((r) => r.nombre.toLowerCase().includes("website"));
  const redesLinks = redes.slice(0, 5)
    .map((red) => `<td style="padding-right: 8px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  const qrURL = qrLink ? generateQRCodeURL(qrLink, 80) : "";
  const qrHTML = qrURL
    ? `<td valign="top" style="padding-right: 20px; font-family: Arial, sans-serif;">
        <img src="${qrURL}" alt="QR Code" width="80" height="80" style="width: 80px; height: 80px; display: block; border: 0;" />
      </td>`
    : `<td valign="top" style="padding-right: 20px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 80px; height: 80px; background-color: #000000; border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="width: 80px; height: 80px; font-family: Arial, sans-serif; font-size: 10px; color: #ffffff; text-align: center; vertical-align: middle;">QR</td>
            </tr>
          </tbody>
        </table>
      </td>`;

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      <td style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #333333; padding-bottom: 5px; line-height: 1.4;">
        ${escapeHtml(nombre)}
      </td>
    </tr>
    <tr>
      <td style="font-family: Arial, sans-serif; font-size: 14px; color: #0066cc; padding-bottom: 12px; line-height: 1.4;">
        ${escapeHtml(cargoTitle)}
      </td>
    </tr>
    <tr>
      <td style="border-top: 1px dotted #cccccc; border-bottom: 1px dotted #cccccc; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              ${qrHTML}
              <td valign="top" style="font-family: Arial, sans-serif;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    ${telefono ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #333333; padding-bottom: 4px; line-height: 1.5;">
                        <span style="font-family: Arial, sans-serif; font-weight: bold;">T:</span> ${escapeHtml(telefono)}
                      </td>
                    </tr>` : ""}
                    ${horario ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 4px; line-height: 1.5;">
                        Horario: ${escapeHtml(horario)}
                      </td>
                    </tr>` : ""}
                    ${email ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #333333; padding-bottom: 4px; line-height: 1.5;">
                        <span style="font-family: Arial, sans-serif; font-weight: bold;">M:</span> ${escapeHtml(email.url)}
                      </td>
                    </tr>` : ""}
                    ${website ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #333333; line-height: 1.5;">
                        ${escapeHtml(website.url)}
                      </td>
                    </tr>` : ""}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    ${redesLinks ? `<tr>
      <td style="border-bottom: 1px dotted #cccccc; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              ${redesLinks}
            </tr>
          </tbody>
        </table>
      </td>
    </tr>` : ""}
  </tbody>
</table>`;
}

// Modern 3: Foto cuadrada redondeada, línea vertical, iconos de redes
function generateTemplate08HTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;
  const company = cargoParts[1] || "";
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));
  // Iconos mejorados para redes sociales
  const getSocialIcon = (nombre: string): string => {
    const nameLower = nombre.toLowerCase();
    if (nameLower.includes("linkedin")) return "💼";
    if (nameLower.includes("twitter") || nameLower.includes("x.com")) return "🐦";
    if (nameLower.includes("github")) return "💻";
    if (nameLower.includes("instagram")) return "📷";
    if (nameLower.includes("facebook")) return "👤";
    if (nameLower.includes("youtube")) return "▶️";
    return "🔗";
  };

  const redesLinks = redes.slice(0, 4)
    .map((red) => `<td style="padding-right: 10px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none; font-size: 14px;" title="${escapeHtml(red.nombre)}">${getSocialIcon(red.nombre)}</a></td>`)
    .join("");

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="80" height="80" style="width: 80px; height: 80px; display: block; border: 0;" />
      </td>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #0066cc; padding-bottom: 6px; line-height: 1.4;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 5px; line-height: 1.4;">
                ${escapeHtml(cargoTitle)}
              </td>
            </tr>
            ${company ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 12px; line-height: 1.4;">
                ${escapeHtml(company)}
              </td>
            </tr>` : ""}
            ${telefono || email || website ? `<tr>
              <td style="border-top: 1px solid #e0e0e0; padding-top: 10px; font-family: Arial, sans-serif;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    ${telefono ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 5px; line-height: 1.5;">
                        <span style="font-family: Arial, sans-serif; color: #0066cc;">📞</span> ${escapeHtml(telefono)}
                      </td>
                    </tr>` : ""}
                    ${email ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 5px; line-height: 1.5;">
                        <span style="font-family: Arial, sans-serif; color: #0066cc;">✉️</span> <a href="${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none;">${escapeHtml(email.url)}</a>
                      </td>
                    </tr>` : ""}
                    ${website ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 10px; line-height: 1.5;">
                        <span style="font-family: Arial, sans-serif; color: #0066cc;">🌐</span> <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none;">${escapeHtml(website.url)}</a>
                      </td>
                    </tr>` : ""}
                  </tbody>
                </table>
              </td>
            </tr>
            ${redesLinks ? `<tr>
              <td style="padding-top: 8px; font-family: Arial, sans-serif;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesLinks}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// Modern 4: Foto circular, línea vertical con color personalizado, botón CTA personalizable
function generateTemplate09HTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  colorPersonalizado?: string,
  ctaTexto?: string
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;
  const company = cargoParts[1] || "";
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));
  
  // Color por defecto: #20b2aa (teal), o color personalizado
  const accentColor = colorPersonalizado || "#20b2aa";
  const lightColor = `${accentColor}20`; // Versión clara para el botón

  const fotoHTML = foto
    ? `<td valign="top" rowspan="3" style="padding-right: 20px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="100" height="100" style="width: 100px; height: 100px; display: block; border: 3px solid ${accentColor};" />
      </td>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="border-left: 2px solid ${accentColor}; padding-left: 20px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: ${accentColor}; padding-bottom: 5px; line-height: 1.4;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 12px; line-height: 1.4;">
                ${escapeHtml(cargoTitle)}${company ? ` | ${escapeHtml(company)}` : ""}
              </td>
            </tr>
            ${telefono || email || website ? `<tr>
              <td style="padding-bottom: 12px; font-family: Arial, sans-serif;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                            ${telefono ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 4px; line-height: 1.5;">
                        <span style="font-family: Arial, sans-serif; color: ${accentColor};">📞</span> ${escapeHtml(telefono)}
                      </td>
                    </tr>` : ""}
                    ${email ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 4px; line-height: 1.5;">
                        <span style="font-family: Arial, sans-serif; color: ${accentColor};">✉️</span> <a href="${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none;">${escapeHtml(email.url)}</a>
                      </td>
                    </tr>` : ""}
                    ${website ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 12px; line-height: 1.5;">
                        <span style="font-family: Arial, sans-serif; color: ${accentColor};">🌐</span> <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none;">${escapeHtml(website.url)}</a>
                      </td>
                    </tr>` : ""}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      <td style="font-family: Arial, sans-serif; background-color: ${lightColor}; color: ${accentColor}; padding: 8px 16px; text-decoration: none; font-size: 12px; font-weight: 600; border: 1px solid ${accentColor};">
                        <a href="#" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none; font-size: 12px; font-weight: 600;">${escapeHtml(ctaTexto || "Book a Meeting")}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : `<tr>
              <td style="font-family: Arial, sans-serif;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      <td style="font-family: Arial, sans-serif; background-color: ${lightColor}; color: ${accentColor}; padding: 8px 16px; text-decoration: none; font-size: 12px; font-weight: 600; border: 1px solid ${accentColor};">
                        <a href="#" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none; font-size: 12px; font-weight: 600;">${escapeHtml(ctaTexto || "Book a Meeting")}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>`}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// QR Corporated: QR code (sin foto), redes sociales, aviso confidencial
function generateTemplate10HTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  qrLink?: string
): string {
  const cargoParts = cargo.split("|").map((p) => p.trim());
  const cargoTitle = cargoParts[0] || cargo;
  const company = cargoParts[1] || "";
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));
  const redesLinks = redes.slice(0, 3)
    .map((red) => `<td style="padding-right: 12px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  const qrURL = qrLink ? generateQRCodeURL(qrLink, 80) : "";
  const qrHTML = qrURL
    ? `<td valign="top" align="right" style="padding-left: 20px; font-family: Arial, sans-serif;">
        <img src="${qrURL}" alt="QR Code" width="60" height="60" style="width: 60px; height: 60px; display: block; border: 0;" />
      </td>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      <td valign="top" style="padding-bottom: 8px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #000000; padding-bottom: 5px; line-height: 1.4;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 12px; line-height: 1.4;">
                ${escapeHtml(cargoTitle)}${company ? ` at ${escapeHtml(company)}` : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      ${qrHTML}
    </tr>
    ${telefono || email || website ? `<tr>
      <td colspan="2" valign="top" style="padding-bottom: 12px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 4px; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: 600;">phone:</span> ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 4px; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: 600;">email:</span> <a href="${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none;">${escapeHtml(email.url)}</a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; font-weight: 600;">site:</span> <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #666666; text-decoration: none;">${escapeHtml(website.url)}</a>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>` : ""}
    ${redesLinks ? `<tr>
      <td colspan="2" style="border-top: 1px solid #e0e0e0; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              ${redesLinks}
            </tr>
          </tbody>
        </table>
      </td>
    </tr>` : ""}
    <tr>
      <td colspan="2" style="border-top: 1px solid #e0e0e0; padding-top: 12px; font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 11px; color: #999999; font-style: italic; line-height: 1.5;">
                The content of this email is strictly confidential and only intended for the specified recipient. It is forbidden to share the email or its contents with any third party without the sender's written consent. If this email reached you by mistake, please let us know so that we can ensure that this doesn't happen in the future and delete the message.
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// Developer Minimal 2025: Minimal design for developers
function generateDeveloperMinimal2025HTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const email = redes.find((r) => r.url.includes("@"));
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const github = redes.find((r) => r.nombre.toLowerCase().includes("github"));
  const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && 
           !url.includes("linkedin") && 
           !url.includes("github") && 
           !url.includes("twitter") &&
           !url.includes("x.com");
  });

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; vertical-align: top;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="80" height="80" style="width: 80px; height: 80px; border-radius: 12px; object-fit: cover; display: block; border: 3px solid #1f2937; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
      </td>`
    : "";

  const linksHTML = [];
  if (telefono) {
    linksHTML.push(`<td style="padding-right: 16px; padding-bottom: 6px;">
      <a href="tel:${telefono.replace(/[^0-9+]/g, "")}" style="color: #1f2937; text-decoration: none; font-size: 13px; font-weight: 500; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; border-bottom: 1px solid transparent; transition: border-color 0.2s;">
        ${escapeHtml(telefono)}
      </a>
    </td>`);
  }
  if (email) {
    linksHTML.push(`<td style="padding-right: 16px; padding-bottom: 6px;">
      <a href="mailto:${escapeHtml(email.url)}" style="color: #1f2937; text-decoration: none; font-size: 13px; font-weight: 500; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">
        ${escapeHtml(email.url)}
      </a>
    </td>`);
  }
  if (website) {
    linksHTML.push(`<td style="padding-right: 16px; padding-bottom: 6px;">
      <a href="${escapeHtml(website.url)}" style="color: #6366f1; text-decoration: none; font-size: 13px; font-weight: 600; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">
        ${escapeHtml(website.nombre || website.url.replace(/^https?:\/\//, "").replace(/^www\./, ""))}
      </a>
    </td>`);
  }

  // Social icons row (GitHub, LinkedIn, Twitter)
  const socialLinksHTML = [];
  if (github) {
    socialLinksHTML.push(`<a href="${escapeHtml(github.url)}" style="color: #6b7280; text-decoration: none; font-size: 12px; margin-right: 12px; font-weight: 500; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">GitHub</a>`);
  }
  if (linkedin) {
    socialLinksHTML.push(`<a href="${escapeHtml(linkedin.url)}" style="color: #6b7280; text-decoration: none; font-size: 12px; margin-right: 12px; font-weight: 500; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">LinkedIn</a>`);
  }
  if (twitter) {
    socialLinksHTML.push(`<a href="${escapeHtml(twitter.url)}" style="color: #6b7280; text-decoration: none; font-size: 12px; margin-right: 12px; font-weight: 500; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">Twitter</a>`);
  }

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.6;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="vertical-align: top;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding-bottom: 8px;">
                <span style="font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  ${escapeHtml(nombre)}
                </span>
                <span style="color: #cbd5e1; margin: 0 10px; font-weight: 300;">/</span>
                <span style="font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  ${escapeHtml(cargo)}
                </span>
              </td>
            </tr>
            ${linksHTML.length > 0 ? `<tr>
              <td style="padding-bottom: 8px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tbody>
                    <tr>
                      ${linksHTML.join("")}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
            ${socialLinksHTML.length > 0 ? `<tr>
              <td style="padding-top: 4px; border-top: 1px solid #e2e8f0;">
                ${socialLinksHTML.join("")}
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateUltraMinimalHTML(
  nombre: string,
  cargo: string,
  redes: RedSocial[] = []
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const github = redes.find((r) => r.nombre.toLowerCase().includes("github"));
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    const name = r.nombre.toLowerCase();
    return (url.includes("www") || url.includes("http")) && 
           !url.includes("github") && 
           !url.includes("linkedin") &&
           !name.includes("github") &&
           !name.includes("linkedin");
  });

  // Construir los links
  const links: string[] = [];
  
  if (email) {
    const emailUrl = email.url.includes("@") ? `mailto:${email.url}` : email.url;
    links.push(`<a href="${escapeHtml(emailUrl)}" style="color: #374151; text-decoration: none;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>`);
  }
  
  if (github) {
    const githubUrl = github.url.includes("http") ? github.url : `https://${github.url}`;
    const githubText = github.url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    links.push(`<a href="${escapeHtml(githubUrl)}" style="color: #374151; text-decoration: none;">${escapeHtml(githubText)}</a>`);
  }

  if (linkedin) {
    const linkedinUrl = linkedin.url.includes("http") ? linkedin.url : `https://${linkedin.url}`;
    const linkedinText = linkedin.url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/in\//, "").replace(/\/$/, "");
    links.push(`<a href="${escapeHtml(linkedinUrl)}" style="color: #374151; text-decoration: none;">${escapeHtml(linkedinText)}</a>`);
  }

  if (website) {
    const websiteUrl = website.url.includes("http") ? website.url : `https://${website.url}`;
    const websiteText = website.url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    links.push(`<a href="${escapeHtml(websiteUrl)}" style="color: #374151; text-decoration: none;">${escapeHtml(websiteText)}</a>`);
  }

  const linksHTML = links.length > 0 
    ? links.join(`<span style="color: #cbd5e1; margin: 0 8px; font-weight: 300;">·</span>`)
    : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #334155; line-height: 1.7;">
  <tbody>
    <tr>
      <td>
        <div style="font-size: 17px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em; margin-bottom: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          ${escapeHtml(nombre)}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          ${escapeHtml(cargo)}
        </div>
        ${linksHTML ? `<div style="font-size: 13px; color: #475569; line-height: 1.8; margin-top: 4px;">
          ${linksHTML}
        </div>` : ""}
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateGrowthMarketingHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  redes: RedSocial[] = [],
  ctaTexto?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const calendly = redes.find((r) => r.url.toLowerCase().includes("calendly") || r.nombre.toLowerCase().includes("book") || r.nombre.toLowerCase().includes("call"));
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; vertical-align: top;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="72" height="72" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; display: block; border: 3px solid #f3f4f6; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);" />
      </td>`
    : "";

  const emailHTML = email
    ? `<td style="padding-right: 24px; padding-bottom: 10px;">
        <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 500;">
          ${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}
        </a>
      </td>`
    : "";

  const calendlyHTML = calendly
    ? `<td style="padding-right: 24px; padding-bottom: 10px;">
        <a href="${escapeHtml(calendly.url)}" style="color: #6366f1; text-decoration: none; font-size: 14px; font-weight: 600;">
          📅 Book a call
        </a>
      </td>`
    : "";

  const linkedinHTML = linkedin
    ? `<td style="padding-right: 24px; padding-bottom: 10px;">
        <a href="${escapeHtml(linkedin.url)}" style="color: #6366f1; text-decoration: none; font-size: 14px; font-weight: 500;">
          LinkedIn
        </a>
      </td>`
    : "";

  const ctaHTML = ctaTexto
    ? `<td colspan="3" style="padding-top: 12px;">
        <a href="#" style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-block; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4); letter-spacing: 0.01em;">
          ${escapeHtml(ctaTexto)}
        </a>
      </td>`
    : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="vertical-align: top;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding-bottom: 8px;">
                <span style="font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;">${escapeHtml(nombre)}</span>
                <span style="color: #cbd5e1; margin: 0 12px; font-weight: 300;">·</span>
                <span style="font-size: 13px; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 0.1em;">${escapeHtml(cargo)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 6px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tbody>
                    <tr>
                      ${emailHTML}
                      ${calendlyHTML}
                      ${linkedinHTML}
                    </tr>
                    ${ctaHTML ? `<tr>${ctaHTML}</tr>` : ""}
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

function generateFreelanceDesignerHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    const name = r.nombre.toLowerCase();
    return (url.includes("http") || url.includes("www") || url.includes(".")) && 
           !url.includes("behance") &&
           !name.includes("behance");
  });
  const behance = redes.find((r) => r.url.toLowerCase().includes("behance") || r.nombre.toLowerCase().includes("behance"));
  const dribbble = redes.find((r) => r.url.toLowerCase().includes("dribbble") || r.nombre.toLowerCase().includes("dribbble"));
  const instagram = redes.find((r) => r.url.toLowerCase().includes("instagram") || r.nombre.toLowerCase().includes("instagram"));

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; vertical-align: top;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="70" height="70" style="width: 70px; height: 70px; border-radius: 14px; object-fit: cover; display: block; border: 3px solid #fff7ed; box-shadow: 0 8px 16px rgba(251, 146, 60, 0.2);" />
      </td>`
    : "";

  const telefonoHTML = telefono
    ? `<td style="padding-right: 20px; padding-bottom: 8px;">
        <a href="tel:${telefono.replace(/[^0-9+]/g, "")}" style="color: #ea580c; text-decoration: none; font-size: 14px; font-weight: 500;">
          ${escapeHtml(telefono)}
        </a>
      </td>`
    : "";

  const websiteHTML = website
    ? `<td style="padding-right: 20px; padding-bottom: 8px;">
        <a href="${escapeHtml(website.url.includes("http") ? website.url : `https://${website.url}`)}" style="color: #ea580c; text-decoration: none; font-size: 14px; font-weight: 600;">
          ${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, ""))}
        </a>
      </td>`
    : "";

  const behanceHTML = behance
    ? `<td style="padding-right: 20px; padding-bottom: 8px;">
        <a href="${escapeHtml(behance.url.includes("http") ? behance.url : `https://${behance.url}`)}" style="color: #ea580c; text-decoration: none; font-size: 14px; font-weight: 600;">
          Behance
        </a>
      </td>`
    : "";

  const dribbbleHTML = dribbble
    ? `<td style="padding-right: 20px; padding-bottom: 8px;">
        <a href="${escapeHtml(dribbble.url.includes("http") ? dribbble.url : `https://${dribbble.url}`)}" style="color: #ea580c; text-decoration: none; font-size: 14px; font-weight: 600;">
          Dribbble
        </a>
      </td>`
    : "";

  const instagramHTML = instagram
    ? `<td style="padding-right: 20px; padding-bottom: 8px;">
        <a href="${escapeHtml(instagram.url.includes("http") ? instagram.url : `https://${instagram.url}`)}" style="color: #ea580c; text-decoration: none; font-size: 14px; font-weight: 600;">
          Instagram
        </a>
      </td>`
    : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6; background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); padding: 16px; border-radius: 12px;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="vertical-align: top;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding-bottom: 10px;">
                <span style="font-size: 22px; font-weight: 700; color: #1c1917; letter-spacing: -0.02em;">${escapeHtml(nombre)}</span>
                <span style="color: #fed7aa; margin: 0 12px; font-weight: 300; font-size: 18px;">•</span>
                <span style="font-size: 13px; font-weight: 600; color: #ea580c; text-transform: uppercase; letter-spacing: 0.12em;">${escapeHtml(cargo)}</span>
              </td>
            </tr>
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tbody>
                    <tr>
                      ${telefonoHTML}
                      ${websiteHTML}
                      ${behanceHTML}
                      ${dribbbleHTML}
                      ${instagramHTML}
                    </tr>
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

function generateCorporateConsultantHTML(
  nombre: string,
  cargo: string,
  logoEmpresa?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  textoAdicional?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));

  const logoHTML = logoEmpresa
    ? `<td valign="top" style="padding-right: 24px; vertical-align: top; padding-bottom: 4px;">
        <img src="${escapeHtml(logoEmpresa)}" alt="Company Logo" width="140" height="45" style="display: block; max-width: 140px; height: auto;" />
      </td>`
    : "";

  const telefonoHTML = telefono
    ? `<a href="tel:${telefono.replace(/[^0-9+]/g, "")}" style="color: #1e40af; text-decoration: none; margin-right: 24px; font-size: 14px; font-weight: 500;">
        ${escapeHtml(telefono)}
      </a>`
    : "";

  const emailHTML = email
    ? `<a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #1e40af; text-decoration: none; font-size: 14px; font-weight: 500;">
        ${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}
      </a>`
    : "";

  const linkedinHTML = linkedin
    ? `<a href="${escapeHtml(linkedin.url)}" style="color: #1e40af; text-decoration: none; margin-left: 24px; font-size: 14px; font-weight: 500;">
        LinkedIn
      </a>`
    : "";

  const disclaimerHTML = textoAdicional
    ? `<tr>
        <td style="padding-top: 12px; font-size: 10px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; margin-top: 12px;">
          ${escapeHtml(textoAdicional)}
        </td>
      </tr>`
    : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      ${logoHTML}
      <td valign="top" style="vertical-align: top;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding-bottom: 8px;">
                <span style="font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">${escapeHtml(nombre)}</span>
                <span style="color: #cbd5e1; margin: 0 12px; font-weight: 300;">|</span>
                <span style="font-size: 13px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.1em;">${escapeHtml(cargo)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 6px;">
                ${telefonoHTML}
                ${emailHTML}
                ${linkedinHTML}
              </td>
            </tr>
            ${disclaimerHTML}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateInteriorDesignHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  logoEmpresa?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  direccion?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
  });

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 0; vertical-align: top; position: relative;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="80" height="80" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; display: block; position: relative; z-index: 2;" />
        <div style="position: absolute; left: 40px; top: 0; bottom: 0; width: 2px; background-color: #000000; z-index: 1;"></div>
      </td>`
    : "";

  const nombreEmpresa = logoEmpresa ? "" : "COMPANY NAME";
  const logoHTML = logoEmpresa
    ? `<td style="padding-bottom: 12px;">
        <img src="${escapeHtml(logoEmpresa)}" alt="Company Logo" height="30" style="height: 30px; max-width: 200px; display: block;" />
      </td>`
    : `<td style="padding-bottom: 12px;">
        <div style="font-size: 18px; font-weight: 700; color: #000000; letter-spacing: 0.1em; text-transform: uppercase;">${escapeHtml(nombreEmpresa)}</div>
      </td>`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #000000; line-height: 1.6;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td valign="top" style="vertical-align: top; padding-left: 20px;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%;">
          <tbody>
            <tr>
              <td style="padding-bottom: 8px;">
                <div style="font-size: 18px; font-weight: 700; color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${escapeHtml(nombre)}</div>
                <div style="font-size: 11px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px;">${escapeHtml(cargo)}</div>
              </td>
            </tr>
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tbody>
                    ${logoHTML}
                    ${telefono ? `<tr>
                      <td style="padding-bottom: 6px; font-size: 13px; color: #000000;">
                        📞 ${escapeHtml(telefono)}
                      </td>
                    </tr>` : ""}
                    ${website ? `<tr>
                      <td style="padding-bottom: 6px; font-size: 13px; color: #000000;">
                        🌐 <a href="${escapeHtml(website.url)}" style="color: #000000; text-decoration: none;">${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, ""))}</a>
                      </td>
                    </tr>` : ""}
                    ${email ? `<tr>
                      <td style="padding-bottom: 6px; font-size: 13px; color: #000000;">
                        ✉️ <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #000000; text-decoration: none;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>
                      </td>
                    </tr>` : ""}
                    ${direccion ? `<tr>
                      <td style="padding-bottom: 6px; font-size: 13px; color: #000000;">
                        📍 ${escapeHtml(direccion)}
                      </td>
                    </tr>` : ""}
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

function generateUniversityProfessorHTML(
  nombre: string,
  cargo: string,
  logoEmpresa?: string,
  telefono?: string,
  telefonoMovil?: string,
  redes: RedSocial[] = [],
  direccion?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
  });
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
  const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));

  const nombreEmpresa = "UNIVERSITY NAME";
  const logoHTML = logoEmpresa
    ? `<td style="padding-bottom: 12px;">
        <img src="${escapeHtml(logoEmpresa)}" alt="University Logo" height="50" style="height: 50px; max-width: 250px; display: block;" />
      </td>`
    : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      <td style="padding-bottom: 12px;">
        <div style="font-size: 20px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.02em;">${escapeHtml(nombre)}</div>
        <div style="font-size: 12px; font-weight: 400; color: #64748b; text-transform: uppercase; margin-top: 4px;">${escapeHtml(cargo)}</div>
        <div style="border-top: 1px solid #e2e8f0; margin-top: 12px; margin-bottom: 12px;"></div>
      </td>
    </tr>
    ${logoHTML ? `<tr>${logoHTML}</tr>` : ""}
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding-bottom: 8px; font-size: 14px; color: #1e293b;">
                ${telefono ? `<span style="color: #2563eb; font-weight: 600;">Office:</span> <span style="color: #2563eb;">${escapeHtml(telefono)}</span>` : ""}
                ${telefono && telefonoMovil ? `<span style="color: #cbd5e1; margin: 0 8px;">|</span>` : ""}
                ${telefonoMovil ? `<span style="color: #2563eb; font-weight: 600;">Cell:</span> <span style="color: #2563eb;">${escapeHtml(telefonoMovil)}</span>` : ""}
              </td>
            </tr>
            ${direccion ? `<tr>
              <td style="padding-bottom: 8px; font-size: 14px; color: #64748b;">${escapeHtml(direccion)}</td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="padding-bottom: 8px; font-size: 14px;">
                <a href="${escapeHtml(website.url)}" style="color: #2563eb; text-decoration: none; font-weight: 700; text-transform: uppercase;">${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, "").toUpperCase())}</a>
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="padding-bottom: 12px;">
                <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>
              </td>
            </tr>` : ""}
            ${(linkedin || twitter || facebook) ? `<tr>
              <td style="padding-top: 12px; border-top: 1px solid #e2e8f0;">
                ${linkedin ? `<a href="${escapeHtml(linkedin.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #2563eb; color: white; text-align: center; line-height: 32px; margin-right: 8px; text-decoration: none; font-weight: 700; font-size: 12px;">in</a>` : ""}
                ${twitter ? `<a href="${escapeHtml(twitter.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #1e293b; color: white; text-align: center; line-height: 32px; margin-right: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">X</a>` : ""}
                ${facebook ? `<a href="${escapeHtml(facebook.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #2563eb; color: white; text-align: center; line-height: 32px; margin-right: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">f</a>` : ""}
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateUniversityBannerHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  telefonoMovil?: string,
  redes: RedSocial[] = [],
  direccion?: string,
  textoAdicional?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
  });
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
  const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 20px; text-align: right;">
        ${foto ? `<img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="80" height="80" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; display: inline-block; border: 3px solid rgba(255,255,255,0.3);" />` : ""}
        <div style="font-size: 24px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 12px;">${escapeHtml(nombre)}</div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #ffffff;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%;">
          <tbody>
            <tr>
              <td style="padding-bottom: 12px; font-size: 14px; color: #64748b;">
                ${escapeHtml(cargo)}
                ${textoAdicional ? ` | ${escapeHtml(textoAdicional)}` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px; font-size: 14px; color: #1e293b;">
                ${telefono ? `<span style="color: #2563eb; margin-right: 16px;">📞 ${escapeHtml(telefono)}</span>` : ""}
                ${telefonoMovil ? `<span style="color: #2563eb;">📱 ${escapeHtml(telefonoMovil)}</span>` : ""}
              </td>
            </tr>
            ${direccion ? `<tr>
              <td style="padding-bottom: 8px; font-size: 14px; color: #64748b;">${escapeHtml(direccion)}</td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="padding-bottom: 12px; font-size: 14px;">
                <a href="${escapeHtml(website.url)}" style="color: #2563eb; text-decoration: none; font-weight: 700; text-transform: uppercase;">${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, "").toUpperCase())}</a>
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="padding-bottom: 12px;">
                <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>
              </td>
            </tr>` : ""}
            ${(linkedin || twitter || facebook) ? `<tr>
              <td style="text-align: center; padding-top: 12px;">
                ${linkedin ? `<a href="${escapeHtml(linkedin.url)}" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #2563eb; color: white; text-align: center; line-height: 36px; margin: 0 6px; text-decoration: none; font-weight: 700; font-size: 13px;">in</a>` : ""}
                ${twitter ? `<a href="${escapeHtml(twitter.url)}" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #1e293b; color: white; text-align: center; line-height: 36px; margin: 0 6px; text-decoration: none; font-weight: 700; font-size: 16px;">X</a>` : ""}
                ${facebook ? `<a href="${escapeHtml(facebook.url)}" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #2563eb; color: white; text-align: center; line-height: 36px; margin: 0 6px; text-decoration: none; font-weight: 700; font-size: 18px;">f</a>` : ""}
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateCreativePortfolioHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = []
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && !url.includes("behance") && !url.includes("dribbble");
  });
  const behance = redes.find((r) => r.url.toLowerCase().includes("behance") || r.nombre.toLowerCase().includes("behance"));
  const dribbble = redes.find((r) => r.url.toLowerCase().includes("dribbble") || r.nombre.toLowerCase().includes("dribbble"));

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      ${foto ? `<td valign="top" style="padding-right: 20px; vertical-align: top;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="90" height="90" style="width: 90px; height: 90px; border-radius: 8px; object-fit: cover; display: block; border: 1px solid #e2e8f0;" />
      </td>` : ""}
      <td valign="top" style="vertical-align: top;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding-bottom: 8px;">
                <div style="font-size: 18px; font-weight: 700; color: #0f172a;">${escapeHtml(nombre)}</div>
                <div style="border-left: 2px solid #cbd5e1; padding-left: 12px; margin-top: 4px; margin-left: 0;">
                  <span style="font-size: 14px; color: #64748b; font-weight: 500;">${escapeHtml(cargo)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 12px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tbody>
                    ${email ? `<tr>
                      <td style="padding-bottom: 6px; font-size: 14px; color: #64748b;">
                        ✉️ <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #64748b; text-decoration: none;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>
                      </td>
                    </tr>` : ""}
                    ${telefono ? `<tr>
                      <td style="padding-bottom: 6px; font-size: 14px; color: #64748b;">
                        📞 ${escapeHtml(telefono)}
                      </td>
                    </tr>` : ""}
                    ${website ? `<tr>
                      <td style="padding-bottom: 12px; font-size: 14px; color: #64748b;">
                        🌐 <a href="${escapeHtml(website.url)}" style="color: #64748b; text-decoration: none;">${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, ""))}</a>
                      </td>
                    </tr>` : ""}
                  </tbody>
                </table>
              </td>
            </tr>
            ${(behance || dribbble) ? `<tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tbody>
                    <tr>
                      ${behance ? `<td style="padding-right: 8px;">
                        <a href="${escapeHtml(behance.url)}" style="display: inline-block; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 12px; text-decoration: none; background-color: #ffffff;">
                          <span style="color: #2563eb; font-weight: 700; font-size: 16px; margin-right: 8px;">Bē</span>
                          <span style="color: #64748b; font-size: 13px; border-left: 1px solid #e2e8f0; padding-left: 8px;">My Behance portfolio</span>
                        </a>
                      </td>` : ""}
                      ${dribbble ? `<td>
                        <a href="${escapeHtml(dribbble.url)}" style="display: inline-block; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 12px; text-decoration: none; background-color: #ffffff;">
                          <span style="color: #ea4c89; font-size: 18px; margin-right: 8px;">🏀</span>
                          <span style="color: #64748b; font-size: 13px; border-left: 1px solid #e2e8f0; padding-left: 8px;">My Dribbble shots</span>
                        </a>
                      </td>` : ""}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateMilitaryProfessionalHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  direccion?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
  });
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
  const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));
  const instagram = redes.find((r) => r.nombre.toLowerCase().includes("instagram"));

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      <td style="padding-bottom: 12px;">
        <div style="font-size: 20px; font-weight: 700; color: #365314; letter-spacing: 0.02em;">${escapeHtml(nombre)}</div>
        <div style="font-size: 14px; font-weight: 600; color: #1e293b; text-transform: uppercase; margin-top: 4px;">${escapeHtml(cargo)}</div>
      </td>
    </tr>
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            ${telefono ? `<tr>
              <td style="padding-bottom: 6px; font-size: 14px; color: #1e293b;">
                <span style="color: #365314; margin-right: 8px;">📞</span>${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="padding-bottom: 6px; font-size: 14px; color: #1e293b;">
                <span style="color: #365314; margin-right: 8px;">✉️</span><a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #1e293b; text-decoration: none;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="padding-bottom: 6px; font-size: 14px; color: #1e293b;">
                <span style="color: #365314; margin-right: 8px;">🌐</span><a href="${escapeHtml(website.url)}" style="color: #1e293b; text-decoration: none;">${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, ""))}</a>
              </td>
            </tr>` : ""}
            ${direccion ? `<tr>
              <td style="padding-bottom: 12px; font-size: 14px; color: #1e293b;">
                <span style="color: #365314; margin-right: 8px;">📍</span>${escapeHtml(direccion)}
              </td>
            </tr>` : ""}
            ${(linkedin || twitter || facebook || instagram) ? `<tr>
              <td style="padding-top: 12px; border-top: 1px solid #cbd5e1;">
                <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Follow us</div>
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tbody>
                    <tr>
                      ${linkedin ? `<td style="padding-right: 8px;">
                        <a href="${escapeHtml(linkedin.url)}" style="display: inline-block; width: 32px; height: 32px; background-color: #365314; color: white; text-align: center; line-height: 32px; text-decoration: none; font-weight: 700; font-size: 12px;">in</a>
                      </td>` : ""}
                      ${twitter ? `<td style="padding-right: 8px;">
                        <a href="${escapeHtml(twitter.url)}" style="display: inline-block; width: 32px; height: 32px; background-color: #365314; color: white; text-align: center; line-height: 32px; text-decoration: none; font-weight: 700; font-size: 14px;">🐦</a>
                      </td>` : ""}
                      ${facebook ? `<td style="padding-right: 8px;">
                        <a href="${escapeHtml(facebook.url)}" style="display: inline-block; width: 32px; height: 32px; background-color: #365314; color: white; text-align: center; line-height: 32px; text-decoration: none; font-weight: 700; font-size: 16px;">f</a>
                      </td>` : ""}
                      ${instagram ? `<td>
                        <a href="${escapeHtml(instagram.url)}" style="display: inline-block; width: 32px; height: 32px; background-color: #365314; color: white; text-align: center; line-height: 32px; text-decoration: none; font-weight: 700; font-size: 16px;">📷</a>
                      </td>` : ""}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateChurchProfessionalHTML(
  nombre: string,
  cargo: string,
  logoEmpresa?: string,
  telefono?: string,
  telefonoMovil?: string,
  redes: RedSocial[] = []
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
  });
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
  const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));
  const instagram = redes.find((r) => r.nombre.toLowerCase().includes("instagram"));
  const youtube = redes.find((r) => r.nombre.toLowerCase().includes("youtube"));

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      <td style="padding-right: 30px; vertical-align: top;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding-bottom: 8px;">
                <div style="font-size: 22px; font-weight: 700; color: #14b8a6; text-transform: uppercase; letter-spacing: 0.05em;">${escapeHtml(nombre)}</div>
                <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">${escapeHtml(cargo)}</div>
              </td>
            </tr>
            <tr>
              <td style="border-top: 2px solid #14b8a6; margin-top: 8px; margin-bottom: 8px; padding-top: 8px; padding-bottom: 8px;">
                ${telefono ? `<div style="font-size: 14px; color: #1e293b; margin-bottom: 4px;">Office: ${escapeHtml(telefono)}</div>` : ""}
                ${telefonoMovil ? `<div style="font-size: 14px; color: #1e293b; margin-bottom: 4px;">Cell: ${escapeHtml(telefonoMovil)}</div>` : ""}
                ${email ? `<div style="font-size: 14px; color: #1e293b;">Email: <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #1e293b; text-decoration: none;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a></div>` : ""}
              </td>
            </tr>
            ${(linkedin || twitter || facebook || instagram || youtube) ? `<tr>
              <td style="border-top: 2px solid #14b8a6; padding-top: 8px; padding-bottom: 8px;">
                ${linkedin ? `<a href="${escapeHtml(linkedin.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 12px;">in</a>` : ""}
                ${twitter ? `<a href="${escapeHtml(twitter.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 14px;">🐦</a>` : ""}
                ${facebook ? `<a href="${escapeHtml(facebook.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 16px;">f</a>` : ""}
                ${instagram ? `<a href="${escapeHtml(instagram.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 16px;">📷</a>` : ""}
                ${youtube ? `<a href="${escapeHtml(youtube.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 14px;">▶</a>` : ""}
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="padding-top: 8px;">
                <a href="${escapeHtml(website.url)}" style="color: #14b8a6; text-decoration: none; font-size: 14px; font-weight: 600;">${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, ""))}</a>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
      ${logoEmpresa ? `<td style="vertical-align: top; text-align: right;">
        <img src="${escapeHtml(logoEmpresa)}" alt="Church Logo" height="80" style="height: 80px; max-width: 200px; display: block;" />
        <div style="font-size: 16px; font-weight: 700; color: #14b8a6; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 8px; text-align: center;">CHURCH</div>
      </td>` : ""}
    </tr>
  </tbody>
</table>`;
}

function generateUniversityPresidentHTML(
  nombre: string,
  cargo: string,
  logoEmpresa?: string,
  telefono?: string,
  telefonoMovil?: string,
  redes: RedSocial[] = [],
  direccion?: string,
  textoAdicional?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
  const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Georgia, serif; font-size: 14px; color: #1e293b; line-height: 1.7; background-color: #ffffff; border-radius: 8px; padding: 20px;">
  <tbody>
    <tr>
      <td style="padding-bottom: 16px;">
        <div style="font-size: 24px; font-weight: 700; color: #7c2d12; font-family: Georgia, serif;">${escapeHtml(nombre)}</div>
        <div style="font-size: 14px; color: #64748b; font-family: Georgia, serif; margin-top: 4px;">${escapeHtml(cargo)}</div>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 12px; font-size: 14px; color: #1e293b;">
        ${telefono ? `Office: <span style="color: #7c2d12;">${escapeHtml(telefono)}</span>` : ""}
        ${telefono && telefonoMovil ? ` <span style="color: #cbd5e1;">•</span> ` : ""}
        ${telefonoMovil ? `Mobile: <span style="color: #7c2d12;">${escapeHtml(telefonoMovil)}</span>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 12px;">
        ${email ? `<a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #7c2d12; text-decoration: none; font-size: 14px;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding-bottom: 16px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              ${logoEmpresa ? `<td style="padding-right: 16px; vertical-align: top;">
                <img src="${escapeHtml(logoEmpresa)}" alt="University Logo" width="60" height="60" style="width: 60px; height: 60px; display: block;" />
              </td>` : ""}
              <td style="vertical-align: top;">
                <div style="font-size: 16px; font-weight: 700; color: #1e293b; font-family: Georgia, serif;">UNIVERSITY NAME</div>
                <div style="font-size: 14px; color: #64748b; font-family: Georgia, serif;">Christian University</div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    ${(linkedin || twitter || facebook) ? `<tr>
      <td style="padding-bottom: 16px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <div style="font-size: 14px; color: #7c2d12;">
          ${linkedin ? `<a href="${escapeHtml(linkedin.url)}" style="color: #7c2d12; text-decoration: none; margin-right: 8px;">LinkedIn</a>` : ""}
          ${linkedin && (twitter || facebook) ? `<span style="color: #cbd5e1;">|</span>` : ""}
          ${twitter ? `<a href="${escapeHtml(twitter.url)}" style="color: #7c2d12; text-decoration: none; margin-right: 8px; margin-left: 8px;">Twitter</a>` : ""}
          ${(linkedin || twitter) && facebook ? `<span style="color: #cbd5e1;">|</span>` : ""}
          ${facebook ? `<a href="${escapeHtml(facebook.url)}" style="color: #7c2d12; text-decoration: none; margin-left: 8px;">Facebook</a>` : ""}
        </div>
      </td>
    </tr>` : ""}
    ${textoAdicional ? `<tr>
      <td style="padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <div style="font-size: 13px; font-style: italic; color: #7c2d12; font-family: Georgia, serif;">~ ${escapeHtml(textoAdicional)}</div>
      </td>
    </tr>` : ""}
  </tbody>
</table>`;
}

function generatePastorSignatureHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  logoEmpresa?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  direccion?: string,
  textoAdicional?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
  const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));
  const youtube = redes.find((r) => r.nombre.toLowerCase().includes("youtube"));

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      <td style="padding-right: 30px; vertical-align: top; border-right: 1px solid #cbd5e1;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding-bottom: 12px;">
                <div style="font-size: 20px; font-weight: 700; color: #14b8a6;">${escapeHtml(nombre)}</div>
                <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${escapeHtml(cargo)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px; font-size: 14px; color: #64748b;">
                ${telefono ? `<div>M. ${escapeHtml(telefono)}</div>` : ""}
                ${email ? `<div>E. <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #64748b; text-decoration: none;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a></div>` : ""}
                ${direccion ? `<div>A. ${escapeHtml(direccion)}</div>` : ""}
              </td>
            </tr>
            ${textoAdicional ? `<tr>
              <td style="padding-top: 12px; padding-bottom: 12px; font-style: italic; color: #14b8a6; font-size: 14px;">
                ${escapeHtml(textoAdicional)}
              </td>
            </tr>` : ""}
            ${(linkedin || twitter || facebook || youtube) ? `<tr>
              <td style="padding-top: 8px;">
                ${linkedin ? `<a href="${escapeHtml(linkedin.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 12px;">in</a>` : ""}
                ${twitter ? `<a href="${escapeHtml(twitter.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 14px;">🐦</a>` : ""}
                ${facebook ? `<a href="${escapeHtml(facebook.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 16px;">f</a>` : ""}
                ${youtube ? `<a href="${escapeHtml(youtube.url)}" style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: #64748b; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 14px;">▶</a>` : ""}
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
      <td style="padding-left: 30px; vertical-align: middle; text-align: center;">
        ${logoEmpresa ? `<img src="${escapeHtml(logoEmpresa)}" alt="Church Logo" width="80" height="80" style="width: 80px; height: 80px; border-radius: 50%; display: block; margin: 0 auto;" />` : ""}
        <div style="font-size: 18px; font-weight: 700; color: #14b8a6; margin-top: 12px; text-transform: uppercase;">CHURCH NAME</div>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateLawStudentHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  telefonoMovil?: string,
  redes: RedSocial[] = [],
  direccion?: string,
  textoAdicional?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
  });
  const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
  const instagram = redes.find((r) => r.nombre.toLowerCase().includes("instagram"));
  const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6;">
  <tbody>
    <tr>
      <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 20px;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            <tr>
              ${foto ? `<td style="padding-right: 16px; vertical-align: middle;">
                <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="70" height="70" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; display: block; border: 3px solid rgba(255,255,255,0.3);" />
              </td>` : ""}
              <td style="vertical-align: middle;">
                <div style="font-size: 11px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">${escapeHtml(cargo)}</div>
                <div style="font-size: 22px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">${escapeHtml(nombre)}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #ffffff;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tbody>
            ${direccion ? `<tr>
              <td style="padding-bottom: 6px; font-size: 14px; color: #059669;">
                <strong>A:</strong> <span style="color: #1e293b;">${escapeHtml(direccion)}</span>
              </td>
            </tr>` : ""}
            ${telefonoMovil ? `<tr>
              <td style="padding-bottom: 6px; font-size: 14px; color: #059669;">
                <strong>M:</strong> <span style="color: #1e293b;">${escapeHtml(telefonoMovil)}</span>
              </td>
            </tr>` : ""}
            ${telefono ? `<tr>
              <td style="padding-bottom: 6px; font-size: 14px; color: #059669;">
                <strong>T:</strong> <span style="color: #1e293b;">${escapeHtml(telefono)}</span>
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="padding-bottom: 12px; font-size: 14px; color: #059669;">
                <strong>E:</strong> <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #1e293b; text-decoration: none;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="padding-bottom: 12px; font-size: 14px;">
                <a href="${escapeHtml(website.url)}" style="color: #059669; text-decoration: none; font-weight: 600;">${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, ""))}</a>
              </td>
            </tr>` : ""}
            ${(linkedin || instagram || facebook) ? `<tr>
              <td style="padding-top: 8px; padding-bottom: 12px;">
                ${linkedin ? `<a href="${escapeHtml(linkedin.url)}" style="display: inline-block; width: 32px; height: 32px; background-color: #059669; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 12px;">in</a>` : ""}
                ${instagram ? `<a href="${escapeHtml(instagram.url)}" style="display: inline-block; width: 32px; height: 32px; background-color: #059669; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 16px;">📷</a>` : ""}
                ${facebook ? `<a href="${escapeHtml(facebook.url)}" style="display: inline-block; width: 32px; height: 32px; background-color: #059669; color: white; text-align: center; line-height: 32px; margin-right: 6px; text-decoration: none; font-weight: 700; font-size: 16px;">f</a>` : ""}
              </td>
            </tr>` : ""}
            ${textoAdicional ? `<tr>
              <td style="padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #059669; line-height: 1.6;">
                🌳 ${escapeHtml(textoAdicional)}
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

function generateGreenExecutiveHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  textoAdicional?: string
): string {
  const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
  const website = redes.find((r) => {
    const url = r.url.toLowerCase();
    return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
  });

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.7;">
  <tbody>
    <tr>
      <td style="padding-right: 40px; vertical-align: top; border-right: 1px solid #86efac;">
        <div style="font-size: 32px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 4px;">${escapeHtml(nombre.split(" ")[0] || nombre)}</div>
        <div style="font-size: 32px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 16px;">${escapeHtml(nombre.split(" ").slice(1).join(" ") || "")}</div>
        ${telefono ? `<div style="font-size: 14px; color: #86efac; margin-bottom: 4px;">${escapeHtml(telefono)}</div>` : ""}
        ${email ? `<div style="font-size: 14px; color: #86efac; margin-bottom: 4px;">
          <a href="mailto:${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}" style="color: #86efac; text-decoration: none;">${escapeHtml(email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, ""))}</a>
        </div>` : ""}
        ${website ? `<div style="font-size: 14px; color: #86efac;">
          <a href="${escapeHtml(website.url)}" style="color: #86efac; text-decoration: none;">${escapeHtml(website.url.replace(/^https?:\/\//, "").replace(/^www\./, ""))}</a>
        </div>` : ""}
      </td>
      <td style="padding-left: 40px; vertical-align: top;">
        <div style="font-size: 16px; font-weight: 600; color: #86efac; margin-bottom: 8px;">${escapeHtml(cargo)}</div>
        <div style="font-size: 14px; color: #86efac; margin-bottom: 16px;">B2B Marketing</div>
        <div style="font-size: 20px; color: #166534; margin-bottom: 16px;">🌳</div>
        ${textoAdicional ? `<div style="font-size: 12px; color: #86efac; line-height: 1.6;">
          ${escapeHtml(textoAdicional)}
        </div>` : ""}
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
  template: TemplateType,
  userName: string = "Usuario"
): Promise<boolean> {
  // Generar el contenido HTML con validación
  const htmlContent = await generateSignatureHTML(data, template, userName);

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
      return false;
    }
  }
}
