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
  // Additional fields for specific templates
  horario?: string; // For QR Professional
  textoAdicional?: string; // For Enterprise Vintage
  colorPersonalizado?: string; // For Modern without bar, Modern 4
  qrLink?: string; // For QR Professional and QR Corporate
  logoEmpresa?: string; // For Enterprise Vintage and Professional
  ctaTexto?: string; // For Modern 4 (CTA button text)
  telefonoMovil?: string; // For Professional (additional mobile phone)
  direccion?: string; // For Professional (address)
  iconoTelefono?: string; // Customizable icon for phone
  iconoDireccion?: string; // Customizable icon for address
  iconoTelefonoMovil?: string; // Customizable icon for mobile phone
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

