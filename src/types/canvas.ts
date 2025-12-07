// Canvas Editor Types

export type ElementType = 'text' | 'image' | 'button' | 'social';

export interface SocialLink {
  network: string;
  url: string;
}

export interface GlobalStyles {
  fontFamily: string;
  fontSize: number;
  themeColor: string;
  textColor: string;
  backgroundColor: string;
}

export interface SignatureStyle {
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  padding?: string; // For shorthand padding
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  margin?: string; // For shorthand margin
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  lineHeight?: number;
  borderRadius?: number;
  width?: number | string;
  height?: number | string;
  border?: string;
  borderLeft?: string;
  borderRight?: string;
  borderTop?: string;
  borderBottom?: string;
  uppercase?: boolean;
  letterSpacing?: string;
  fontFamily?: string;
  fontStyle?: string;
  textDecoration?: string;
}

export interface SignatureElement {
  id: string;
  type: ElementType;
  content: string; // Text content or Image URL
  url?: string; // Link URL
  alt?: string;
  style: SignatureStyle;
  socialLinks?: SocialLink[];
}

export interface SignatureColumn {
  id: string;
  widthPercent: number; // For <td> width="x%"
  elements: SignatureElement[];
  verticalAlign: 'top' | 'middle' | 'bottom';
  style: SignatureStyle;
}

export interface SignatureRow {
  id: string;
  columns: SignatureColumn[];
  style: SignatureStyle;
}

export interface SignatureState {
  rows: SignatureRow[];
  globalStyles: GlobalStyles;
  selectedId: string | null; // Can be Row ID, Column ID, or Element ID
  selectionType: 'row' | 'column' | 'element' | null;
  // History for Undo/Redo
  past: Omit<SignatureState, 'past' | 'future'>[];
  future: Omit<SignatureState, 'past' | 'future'>[];
}
