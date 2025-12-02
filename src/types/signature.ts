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
  | "classic" 
  | "modern" 
  | "minimal"
  | "minimalCorporate"        // Minimal Corporate (template_01)
  | "modernaSinBarra"         // Moderna sin barra (template_02)
  | "enterpriseVintage"         // Enterprise Vintage (template_03)
  | "modern2"                  // Modern 2 (template_05)
  | "qrProfesional"            // QR Profesional (template_06)
  | "modern3"                  // Modern 3 (template_08)
  | "modern4"                  // Modern 4 (template_09)
  | "qrCorporated"             // QR Corporated (template_10)
  | "developerMinimal2025"     // Developer Minimal 2025 - Para desarrolladores
  | "ultraMinimal";            // Ultra Minimal - Text-only minimal design

