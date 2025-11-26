/**
 * Utilidades de validación para formularios
 */

export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Acepta formatos como: +1234567890, (123) 456-7890, 123-456-7890, etc.
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url.trim()) {
    return { valid: true }; // URL vacía es válida (opcional)
  }
  
  if (!isValidUrl(url)) {
    return { 
      valid: false, 
      error: "Por favor ingresa una URL válida (debe comenzar con http:// o https://)" 
    };
  }
  
  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email.trim()) {
    return { valid: true }; // Email vacío es válido (opcional)
  }
  
  if (!isValidEmail(email)) {
    return { 
      valid: false, 
      error: "Por favor ingresa un email válido (ejemplo: usuario@dominio.com)" 
    };
  }
  
  return { valid: true };
}

export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone.trim()) {
    return { valid: true }; // Teléfono vacío es válido (opcional)
  }
  
  if (!isValidPhone(phone)) {
    return { 
      valid: false, 
      error: "Por favor ingresa un teléfono válido (ejemplo: +1 (555) 123-4567)" 
    };
  }
  
  return { valid: true };
}

