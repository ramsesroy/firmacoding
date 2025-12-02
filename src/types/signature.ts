export interface RedSocial {
  nombre: string;
  url: string;
  icono?: string;
}

export interface SignatureProps {
  nombre: string;
  cargo: string;
  foto?: string;
  telefono?: string;
  redes?: RedSocial[];
  // Campos adicionales para templates específicos
  horario?: string; // Para QR Profesional
  textoAdicional?: string; // Para Enterprise Vintage
  colorPersonalizado?: string; // Para Moderna sin barra, Modern 4
  qrLink?: string; // Para QR Profesional y QR Corporated
  logoEmpresa?: string; // Para Enterprise Vintage y Professional
  ctaTexto?: string; // Para Modern 4 (texto del botón CTA)
  telefonoMovil?: string; // Para Professional (teléfono móvil adicional)
  direccion?: string; // Para Professional (dirección)
  iconoTelefono?: string; // Icono personalizable para teléfono
  iconoDireccion?: string; // Icono personalizable para dirección
  iconoTelefonoMovil?: string; // Icono personalizable para teléfono móvil
}

export type TemplateType = 
  | "professional"            // Most Popular - Professional Clean Design
  | "classic"                 // Classic timeless design
  | "modern"                  // Modern creative design
  | "modernaSinBarra"         // Modern without bar (template_02)
  | "qrProfesional"           // QR Professional (template_06)
  | "developerMinimal2025"    // Developer Minimal 2025 - Premium developer template
  | "ultraMinimal"            // Ultra Minimal - Premium text-only minimal design
  | "growthMarketing"         // Growth Marketing - Premium with CTA and promotions
  | "freelanceDesigner"       // Freelance Designer - Premium portfolio showcase
  | "corporateConsultant"     // Corporate Consultant - Premium corporate with logo
  | "interiorDesign"          // Interior Design Pro - Vertical divider with company logo
  | "universityProfessor"     // University Professor - Academic with university logo
  | "universityBanner"        // University Banner - Blue banner with profile photo
  | "creativePortfolio"       // Creative Portfolio - Design portfolio with Behance/Dribbble buttons
  | "militaryProfessional"    // Military Professional - Military-style with structured layout
  | "churchProfessional"      // Church Professional - Church signature with logo and teal accents
  | "universityPresident"     // University President - Panel design with inspirational quote
  | "pastorSignature"         // Pastor Signature - Two columns with circular logo and tagline
  | "lawStudent"              // Law Student - Green banner with photo and environmental message
  | "greenExecutive";         // Green Executive - Simple divided layout with environmental message

