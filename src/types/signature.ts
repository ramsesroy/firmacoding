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
}

export type TemplateType = "classic" | "modern" | "minimal";

