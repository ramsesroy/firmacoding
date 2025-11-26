import { SignatureProps, TemplateType, RedSocial } from "@/types/signature";
import { generateQRCodeURL } from "./qrUtils";

export async function generateSignatureHTML(
  data: SignatureProps,
  template: TemplateType,
  userName: string = "Usuario"
): Promise<string> {
  const { nombre, cargo, foto, telefono, redes = [], horario, textoAdicional, colorPersonalizado, qrLink, logoEmpresa, ctaTexto, telefonoMovil, direccion, iconoTelefono, iconoTelefonoMovil, iconoDireccion, stackTecnologico, testimonio, certificaciones, horarioConsulta, portfolio, tarifas, listings, calendarioCitas, publicaciones, afiliacionInstitucional, orcid, mision, donaciones, idiomas } = data;

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
    case "minimal":
      baseHTML = generateMinimalHTML(nombre, cargo, foto, telefono, redes);
      break;
    case "minimalCorporate":
      baseHTML = generateTemplate01HTML(nombre, cargo, foto, telefono, redes);
      break;
    case "modernaSinBarra":
      baseHTML = generateTemplate02HTML(nombre, cargo, foto, telefono, redes, colorPersonalizado);
      break;
    case "enterpriseVintage":
      baseHTML = generateTemplate03HTML(nombre, cargo, foto, telefono, redes, textoAdicional, logoEmpresa);
      break;
    case "modern2":
      baseHTML = generateTemplate05HTML(nombre, cargo, foto, telefono, redes);
      break;
    case "qrProfesional":
      baseHTML = generateTemplate06HTML(nombre, cargo, foto, telefono, redes, horario, qrLink);
      break;
    case "modern3":
      baseHTML = generateTemplate08HTML(nombre, cargo, foto, telefono, redes);
      break;
    case "modern4":
      baseHTML = generateTemplate09HTML(nombre, cargo, foto, telefono, redes, colorPersonalizado, ctaTexto);
      break;
    case "qrCorporated":
      baseHTML = generateTemplate10HTML(nombre, cargo, telefono, redes, qrLink);
      break;
    case "techDeveloper":
      baseHTML = generateTechDeveloperHTML(nombre, cargo, telefono, redes, stackTecnologico, qrLink);
      break;
    case "salesProfessional":
      baseHTML = generateSalesProfessionalHTML(nombre, cargo, telefono, redes, ctaTexto, testimonio);
      break;
    case "boldExecutive":
      baseHTML = generateBoldExecutiveHTML(nombre, cargo, telefono, redes, colorPersonalizado);
      break;
    case "medicalProfessional":
      baseHTML = generateMedicalProfessionalHTML(nombre, cargo, telefono, redes, certificaciones, horarioConsulta, qrLink);
      break;
    case "consultant":
      baseHTML = generateConsultantHTML(nombre, cargo, foto, telefono, redes, portfolio, tarifas, testimonio);
      break;
    case "realEstateAgent":
      baseHTML = generateRealEstateAgentHTML(nombre, cargo, foto, telefono, redes, listings, calendarioCitas, qrLink);
      break;
    case "academicResearcher":
      baseHTML = generateAcademicResearcherHTML(nombre, cargo, telefono, redes, publicaciones, afiliacionInstitucional, orcid);
      break;
    case "nonProfit":
      baseHTML = generateNonProfitHTML(nombre, cargo, telefono, redes, mision, donaciones, qrLink);
      break;
    case "bilingual":
      baseHTML = generateBilingualHTML(nombre, cargo, telefono, redes, idiomas, colorPersonalizado);
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
    case "minimal":
      return generateMinimalHTML(nombre, cargo, foto, telefono, redes);
    case "minimalCorporate":
      return generateTemplate01HTML(nombre, cargo, foto, telefono, redes);
    case "modernaSinBarra":
      return generateTemplate02HTML(nombre, cargo, foto, telefono, redes, colorPersonalizado);
    case "enterpriseVintage":
      return generateTemplate03HTML(nombre, cargo, foto, telefono, redes, textoAdicional, logoEmpresa);
    case "modern2":
      return generateTemplate05HTML(nombre, cargo, foto, telefono, redes);
    case "qrProfesional":
      return generateTemplate06HTML(nombre, cargo, foto, telefono, redes, horario, qrLink);
    case "modern3":
      return generateTemplate08HTML(nombre, cargo, foto, telefono, redes);
    case "modern4":
      return generateTemplate09HTML(nombre, cargo, foto, telefono, redes, colorPersonalizado, ctaTexto);
    case "qrCorporated":
      return generateTemplate10HTML(nombre, cargo, telefono, redes, qrLink);
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

// Tech Developer: Para desarrolladores - GitHub destacado, stack tecnológico, QR opcional
function generateTechDeveloperHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  stackTecnologico?: string,
  qrLink?: string
): string {
  const github = redes.find((r) => r.url.includes("github.com"));
  const linkedin = redes.find((r) => r.url.includes("linkedin.com"));
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www") && !r.url.includes("github") && !r.url.includes("linkedin"));

  const qrURL = qrLink ? generateQRCodeURL(qrLink, 70) : null;
  const qrHTML = qrURL
    ? `<td valign="top" style="padding-left: 20px; font-family: 'Courier New', monospace;">
        <img src="${qrURL}" alt="QR Code" width="70" height="70" style="width: 70px; height: 70px; display: block; border: 1px solid #333333;" />
      </td>`
    : "";

  const stackHTML = stackTecnologico
    ? `<tr>
        <td style="font-family: 'Courier New', monospace; font-size: 11px; color: #666666; padding-top: 8px; padding-bottom: 10px; line-height: 1.6;">
          <span style="color: #333333; font-weight: bold;">Stack:</span> ${escapeHtml(stackTecnologico)}
        </td>
      </tr>`
    : "";

  const redesHTML = redes.filter((r) => r !== github && r !== linkedin && r !== email && r !== website)
    .slice(0, 3)
    .map((red) => `<td style="padding-right: 10px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none; font-size: 11px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745;">
  <tbody>
    <tr>
      <td style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: bold; color: #28a745; padding-bottom: 5px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 10px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${stackHTML}
            <tr>
              <td style="font-family: Arial, sans-serif; padding-top: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${github ? `<td style="padding-right: 15px; font-family: Arial, sans-serif;">
                        <a href="${escapeHtml(github.url)}" style="font-family: Arial, sans-serif; color: #333333; text-decoration: none; font-size: 12px; font-weight: bold;">
                          💻 GitHub: ${escapeHtml(github.url.replace("https://", "").replace("http://", ""))}
                        </a>
                      </td>` : ""}
                      ${linkedin ? `<td style="padding-right: 15px; font-family: Arial, sans-serif;">
                        <a href="${escapeHtml(linkedin.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none; font-size: 12px;">
                          💼 LinkedIn
                        </a>
                      </td>` : ""}
                      ${email ? `<td style="padding-right: 15px; font-family: Arial, sans-serif;">
                        <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none; font-size: 12px;">
                          ✉️ ${escapeHtml(email.url)}
                        </a>
                      </td>` : ""}
                      ${telefono ? `<td style="font-family: Arial, sans-serif;">
                        <span style="font-family: Arial, sans-serif; color: #666666; font-size: 12px;">📞 ${escapeHtml(telefono)}</span>
                      </td>` : ""}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 5px; padding-bottom: 5px;">
                <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none; font-size: 11px;">
                  🌐 ${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}
                </a>
              </td>
            </tr>` : ""}
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 8px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
      ${qrHTML}
    </tr>
  </tbody>
</table>`;
}

// Sales Professional: Para comerciales - CTA destacado, teléfono visible, orientado a conversión
function generateSalesProfessionalHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  ctaTexto?: string,
  testimonio?: string
): string {
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));

  const ctaHTML = ctaTexto
    ? `<tr>
        <td style="font-family: Arial, sans-serif; padding-top: 12px; padding-bottom: 10px;">
          <a href="${email ? `mailto:${escapeHtml(email.url)}` : "#"}" style="font-family: Arial, sans-serif; display: inline-block; background-color: #ff6b35; color: #ffffff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-size: 14px; font-weight: bold; text-align: center;">
            ${escapeHtml(ctaTexto)}
          </a>
        </td>
      </tr>`
    : "";

  const testimonioHTML = testimonio
    ? `<tr>
        <td style="font-family: Arial, sans-serif; padding-top: 10px; padding-bottom: 8px; border-top: 1px solid #e0e0e0;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <tbody>
              <tr>
                <td style="font-family: Arial, sans-serif; font-size: 11px; color: #999999; font-style: italic; line-height: 1.5;">
                  "${escapeHtml(testimonio)}"
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>`
    : "";

  const redesHTML = redes.filter((r) => r !== email && r !== website)
    .slice(0, 4)
    .map((red) => `<td style="padding-right: 12px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      <td style="font-family: Arial, sans-serif; border-left: 5px solid #ff6b35; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #1a1a1a; padding-bottom: 5px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 12px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ff6b35; padding-bottom: 8px; line-height: 1.5;">
                📞 ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none;">
                  ✉️ ${escapeHtml(email.url)}
                </a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 10px; line-height: 1.5;">
                <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none;">
                  🌐 ${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}
                </a>
              </td>
            </tr>` : ""}
            ${ctaHTML}
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 10px; padding-bottom: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
            ${testimonioHTML}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// Bold Executive: Para ejecutivos - Tipografía grande, fondo sutil, sin foto
function generateBoldExecutiveHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  colorPersonalizado?: string
): string {
  // Color de fondo sutil (por defecto #f5f5f5, o color personalizado con opacidad)
  const bgColor = colorPersonalizado ? `${colorPersonalizado}15` : "#f5f5f5";
  const accentColor = colorPersonalizado || "#1a1a1a";

  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));

  const redesHTML = redes.filter((r) => r !== email && r !== website)
    .slice(0, 3)
    .map((red) => `<td style="padding-right: 15px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none; font-size: 13px; font-weight: 600;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 16px; color: #333333; background-color: ${bgColor}; padding: 20px;">
  <tbody>
    <tr>
      <td style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; color: ${accentColor}; padding-bottom: 8px; line-height: 1.2; letter-spacing: -0.5px;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 16px; color: #666666; padding-bottom: 15px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; padding-top: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    ${telefono ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; padding-bottom: 5px; line-height: 1.6;">
                        <span style="font-family: Arial, sans-serif; font-weight: 600;">Tel:</span> ${escapeHtml(telefono)}
                      </td>
                    </tr>` : ""}
                    ${email ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; padding-bottom: 5px; line-height: 1.6;">
                        <span style="font-family: Arial, sans-serif; font-weight: 600;">Email:</span> <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none;">${escapeHtml(email.url)}</a>
                      </td>
                    </tr>` : ""}
                    ${website ? `<tr>
                      <td style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; padding-bottom: 10px; line-height: 1.6;">
                        <span style="font-family: Arial, sans-serif; font-weight: 600;">Web:</span> <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none;">${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}</a>
                      </td>
                    </tr>` : ""}
                  </tbody>
                </table>
              </td>
            </tr>
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 12px; padding-bottom: 5px; border-top: 1px solid #e0e0e0;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
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

// Medical Professional: Para profesionales de salud - Certificaciones, horario, QR
function generateMedicalProfessionalHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  certificaciones?: string,
  horarioConsulta?: string,
  qrLink?: string
): string {
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));
  const qrURL = qrLink ? generateQRCodeURL(qrLink, 80) : null;

  const certificacionesHTML = certificaciones
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #0066cc; padding-top: 8px; padding-bottom: 5px; line-height: 1.5;">
          <strong style="font-family: Arial, sans-serif; color: #333333;">Certificaciones:</strong> ${escapeHtml(certificaciones)}
        </td>
      </tr>`
    : "";

  const horarioHTML = horarioConsulta
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-bottom: 8px; line-height: 1.5;">
          <span style="font-family: Arial, sans-serif; color: #0066cc;">🕐</span> <strong style="font-family: Arial, sans-serif; color: #333333;">Horario:</strong> ${escapeHtml(horarioConsulta)}
        </td>
      </tr>`
    : "";

  const redesHTML = redes.filter((r) => r !== email && r !== website)
    .slice(0, 3)
    .map((red) => `<td style="padding-right: 12px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; background-color: #f0f8ff; padding: 15px; border-left: 4px solid #0066cc;">
  <tbody>
    <tr>
      <td style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #0066cc; padding-bottom: 5px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 10px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${certificacionesHTML}
            ${horarioHTML}
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <span style="font-family: Arial, sans-serif; color: #0066cc;">📞</span> ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none;">
                  ✉️ ${escapeHtml(email.url)}
                </a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 10px; line-height: 1.5;">
                <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #0066cc; text-decoration: none;">
                  🌐 ${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}
                </a>
              </td>
            </tr>` : ""}
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
      ${qrURL ? `<td valign="top" style="padding-left: 20px; font-family: Arial, sans-serif;">
        <img src="${qrURL}" alt="QR Code" width="80" height="80" style="width: 80px; height: 80px; display: block; border: 1px solid #0066cc;" />
      </td>` : ""}
    </tr>
  </tbody>
</table>`;
}

// Consultant: Para consultores independientes - Portfolio, tarifas, testimonios
function generateConsultantHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  portfolio?: string,
  tarifas?: string,
  testimonio?: string
): string {
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="100" height="100" style="width: 100px; height: 100px; display: block; border-radius: 50%; object-fit: cover; border: 2px solid #ff9800;" />
      </td>`
    : "";

  const portfolioHTML = portfolio
    ? `<tr>
        <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
          <a href="${escapeHtml(portfolio)}" style="font-family: Arial, sans-serif; color: #ff9800; text-decoration: none; font-size: 13px; font-weight: bold;">
            📁 Ver Portfolio
          </a>
        </td>
      </tr>`
    : "";

  const tarifasHTML = tarifas
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-top: 5px; padding-bottom: 8px; line-height: 1.5;">
          <span style="font-family: Arial, sans-serif; color: #ff9800; font-weight: bold;">Tarifas desde:</span> ${escapeHtml(tarifas)}
        </td>
      </tr>`
    : "";

  const testimonioHTML = testimonio
    ? `<tr>
        <td style="font-family: Arial, sans-serif; padding-top: 10px; padding-bottom: 8px; border-top: 1px solid #e0e0e0;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <tbody>
              <tr>
                <td style="font-family: Arial, sans-serif; font-size: 11px; color: #999999; font-style: italic; line-height: 1.5;">
                  "${escapeHtml(testimonio)}"
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>`
    : "";

  const redesHTML = redes.filter((r) => r !== email && r !== website)
    .slice(0, 3)
    .map((red) => `<td style="padding-right: 12px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #ff9800; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td style="font-family: Arial, sans-serif; border-left: 3px solid #ff9800; padding-left: 20px;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #ff9800; padding-bottom: 5px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 10px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${portfolioHTML}
            ${tarifasHTML}
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                📞 ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #ff9800; text-decoration: none;">
                  ✉️ ${escapeHtml(email.url)}
                </a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 10px; line-height: 1.5;">
                <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #ff9800; text-decoration: none;">
                  🌐 ${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}
                </a>
              </td>
            </tr>` : ""}
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
            ${testimonioHTML}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
}

// Real Estate Agent: Para agentes inmobiliarios - Listings, calendario, QR
function generateRealEstateAgentHTML(
  nombre: string,
  cargo: string,
  foto?: string,
  telefono?: string,
  redes: RedSocial[] = [],
  listings?: string,
  calendarioCitas?: string,
  qrLink?: string
): string {
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));
  const qrURL = qrLink ? generateQRCodeURL(qrLink, 80) : null;

  const fotoHTML = foto
    ? `<td valign="top" style="padding-right: 20px; font-family: Arial, sans-serif;">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(nombre)}" width="100" height="100" style="width: 100px; height: 100px; display: block; border-radius: 8px; object-fit: cover; border: 2px solid #4caf50;" />
      </td>`
    : "";

  const listingsHTML = listings
    ? `<tr>
        <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
          <a href="${escapeHtml(listings)}" style="font-family: Arial, sans-serif; display: inline-block; background-color: #4caf50; color: #ffffff; padding: 8px 16px; border-radius: 5px; text-decoration: none; font-size: 13px; font-weight: bold;">
            🏠 Ver Propiedades
          </a>
        </td>
      </tr>`
    : "";

  const calendarioHTML = calendarioCitas
    ? `<tr>
        <td style="font-family: Arial, sans-serif; padding-top: 5px; padding-bottom: 8px;">
          <a href="${escapeHtml(calendarioCitas)}" style="font-family: Arial, sans-serif; color: #4caf50; text-decoration: none; font-size: 13px; font-weight: bold;">
            📅 Agendar Cita
          </a>
        </td>
      </tr>`
    : "";

  const redesHTML = redes.filter((r) => r !== email && r !== website)
    .slice(0, 3)
    .map((red) => `<td style="padding-right: 12px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #4caf50; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; background-color: #f1f8f4; padding: 15px; border-left: 4px solid #4caf50;">
  <tbody>
    <tr>
      ${fotoHTML}
      <td style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #4caf50; padding-bottom: 5px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 10px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${listingsHTML}
            ${calendarioHTML}
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                📞 ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #4caf50; text-decoration: none;">
                  ✉️ ${escapeHtml(email.url)}
                </a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 10px; line-height: 1.5;">
                <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #4caf50; text-decoration: none;">
                  🌐 ${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}
                </a>
              </td>
            </tr>` : ""}
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
      ${qrURL ? `<td valign="top" style="padding-left: 20px; font-family: Arial, sans-serif;">
        <img src="${qrURL}" alt="QR Code" width="80" height="80" style="width: 80px; height: 80px; display: block; border: 1px solid #4caf50;" />
      </td>` : ""}
    </tr>
  </tbody>
</table>`;
}

// Academic/Researcher: Para académicos/investigadores - Publicaciones, afiliación, ORCID
function generateAcademicResearcherHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  publicaciones?: string,
  afiliacionInstitucional?: string,
  orcid?: string
): string {
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));
  const researchgate = redes.find((r) => r.url.includes("researchgate"));

  const afiliacionHTML = afiliacionInstitucional
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 13px; color: #666666; padding-bottom: 8px; line-height: 1.4; font-style: italic;">
          ${escapeHtml(afiliacionInstitucional)}
        </td>
      </tr>`
    : "";

  const publicacionesHTML = publicaciones
    ? `<tr>
        <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
          <a href="${escapeHtml(publicaciones)}" style="font-family: Arial, sans-serif; color: #9c27b0; text-decoration: none; font-size: 13px; font-weight: bold;">
            📚 Publicaciones
          </a>
        </td>
      </tr>`
    : "";

  const orcidHTML = orcid
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-top: 5px; padding-bottom: 8px; line-height: 1.5;">
          <span style="font-family: Arial, sans-serif; color: #9c27b0; font-weight: bold;">ORCID:</span> <a href="https://orcid.org/${escapeHtml(orcid)}" style="font-family: Arial, sans-serif; color: #9c27b0; text-decoration: none;">${escapeHtml(orcid)}</a>
        </td>
      </tr>`
    : "";

  const redesHTML = redes.filter((r) => r !== email && r !== website && r !== researchgate)
    .slice(0, 2)
    .map((red) => `<td style="padding-right: 12px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #9c27b0; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; background-color: #f3e5f5; padding: 15px; border-left: 4px solid #9c27b0;">
  <tbody>
    <tr>
      <td style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #9c27b0; padding-bottom: 5px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 5px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${afiliacionHTML}
            ${publicacionesHTML}
            ${orcidHTML}
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                📞 ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #9c27b0; text-decoration: none;">
                  ✉️ ${escapeHtml(email.url)}
                </a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #9c27b0; text-decoration: none;">
                  🌐 ${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}
                </a>
              </td>
            </tr>` : ""}
            ${researchgate ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 10px; line-height: 1.5;">
                <a href="${escapeHtml(researchgate.url)}" style="font-family: Arial, sans-serif; color: #9c27b0; text-decoration: none; font-weight: bold;">
                  🔬 ResearchGate
                </a>
              </td>
            </tr>` : ""}
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
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

// Non-Profit/Social Impact: Para ONGs/fundaciones - Misión, donaciones, QR
function generateNonProfitHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  mision?: string,
  donaciones?: string,
  qrLink?: string
): string {
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));
  const qrURL = qrLink ? generateQRCodeURL(qrLink, 80) : null;

  const misionHTML = mision
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-top: 8px; padding-bottom: 8px; line-height: 1.6; font-style: italic;">
          "${escapeHtml(mision)}"
        </td>
      </tr>`
    : "";

  const donacionesHTML = donaciones
    ? `<tr>
        <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
          <a href="${escapeHtml(donaciones)}" style="font-family: Arial, sans-serif; display: inline-block; background-color: #e91e63; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 14px; font-weight: bold;">
            ❤️ Apoya Nuestra Causa
          </a>
        </td>
      </tr>`
    : "";

  const redesHTML = redes.filter((r) => r !== email && r !== website)
    .slice(0, 3)
    .map((red) => `<td style="padding-right: 12px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: #e91e63; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; background-color: #fce4ec; padding: 15px; border-left: 4px solid #e91e63;">
  <tbody>
    <tr>
      <td style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #e91e63; padding-bottom: 5px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 5px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${misionHTML}
            ${donacionesHTML}
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                📞 ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: #e91e63; text-decoration: none;">
                  ✉️ ${escapeHtml(email.url)}
                </a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 10px; line-height: 1.5;">
                <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: #e91e63; text-decoration: none;">
                  🌐 ${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}
                </a>
              </td>
            </tr>` : ""}
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>` : ""}
          </tbody>
        </table>
      </td>
      ${qrURL ? `<td valign="top" style="padding-left: 20px; font-family: Arial, sans-serif;">
        <img src="${qrURL}" alt="QR Code" width="80" height="80" style="width: 80px; height: 80px; display: block; border: 1px solid #e91e63;" />
      </td>` : ""}
    </tr>
  </tbody>
</table>`;
}

// Bilingual/Multilingual: Para profesionales multilingües - Idiomas, traducción
function generateBilingualHTML(
  nombre: string,
  cargo: string,
  telefono?: string,
  redes: RedSocial[] = [],
  idiomas?: string,
  colorPersonalizado?: string
): string {
  const email = redes.find((r) => r.url.includes("@"));
  const website = redes.find((r) => r.url.includes("www"));
  const accentColor = colorPersonalizado || "#2196f3";

  const idiomasHTML = idiomas
    ? `<tr>
        <td style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; padding-top: 8px; padding-bottom: 8px; line-height: 1.5;">
          <span style="font-family: Arial, sans-serif; color: ${accentColor}; font-weight: bold;">🌍 Idiomas:</span> ${escapeHtml(idiomas)}
        </td>
      </tr>`
    : "";

  const redesHTML = redes.filter((r) => r !== email && r !== website)
    .slice(0, 4)
    .map((red) => `<td style="padding-right: 12px; font-family: Arial, sans-serif;"><a href="${escapeHtml(red.url)}" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none; font-size: 12px;">${escapeHtml(red.nombre)}</a></td>`)
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333333; background-color: #e3f2fd; padding: 15px; border-left: 4px solid ${accentColor};">
  <tbody>
    <tr>
      <td style="font-family: Arial, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <tbody>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: ${accentColor}; padding-bottom: 5px; line-height: 1.3;">
                ${escapeHtml(nombre)}
              </td>
            </tr>
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 5px; line-height: 1.4;">
                ${escapeHtml(cargo)}
              </td>
            </tr>
            ${idiomasHTML}
            ${telefono ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                📞 ${escapeHtml(telefono)}
              </td>
            </tr>` : ""}
            ${email ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 5px; line-height: 1.5;">
                <a href="mailto:${escapeHtml(email.url)}" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none;">
                  ✉️ ${escapeHtml(email.url)}
                </a>
              </td>
            </tr>` : ""}
            ${website ? `<tr>
              <td style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; padding-bottom: 10px; line-height: 1.5;">
                <a href="${escapeHtml(website.url)}" style="font-family: Arial, sans-serif; color: ${accentColor}; text-decoration: none;">
                  🌐 ${escapeHtml(website.url.replace("https://", "").replace("http://", ""))}
                </a>
              </td>
            </tr>` : ""}
            ${redesHTML ? `<tr>
              <td style="font-family: Arial, sans-serif; padding-top: 8px; padding-bottom: 5px;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                  <tbody>
                    <tr>
                      ${redesHTML}
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
