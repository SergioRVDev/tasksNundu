/**
 * Input Sanitizer - Previene ataques XSS y manipulación de entrada
 */

/**
 * Escapa caracteres HTML especiales para prevenir XSS
 * @param str - String a escapar
 * @returns String con caracteres HTML escapados
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Valida y sanitiza un string de entrada
 * @param input - String a validar
 * @param maxLength - Longitud máxima permitida (default: 500)
 * @returns String sanitizado o null si es inválido
 */
export function sanitizeString(input: unknown, maxLength: number = 500): string | null {
  // Verificar tipo
  if (typeof input !== 'string') {
    return null;
  }

  // Trimear espacios
  let sanitized = input.trim();

  // Verificar longitud
  if (sanitized.length === 0 || sanitized.length > maxLength) {
    return null;
  }

  // Escapar HTML
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Valida un email
 * @param email - Email a validar
 * @returns true si es válido, false en caso contrario
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valida una URL
 * @param url - URL a validar
 * @returns true si es válida, false en caso contrario
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitiza un objeto de entrada (típicamente desde un formulario)
 * @param obj - Objeto a sanitizar
 * @param schema - Esquema de validación (campo: maxLength)
 * @returns Objeto sanitizado o errores de validación
 */
export function sanitizeObject(
  obj: Record<string, unknown>,
  schema: Record<string, { type: 'string' | 'email' | 'url'; maxLength?: number }>
): { success: boolean; data?: Record<string, string>; errors?: Record<string, string> } {
  const sanitized: Record<string, string> = {};
  const errors: Record<string, string> = {};

  for (const [key, fieldConfig] of Object.entries(schema)) {
    const value = obj[key];
    const maxLength = fieldConfig.maxLength || 500;

    if (fieldConfig.type === 'string') {
      const result = sanitizeString(value, maxLength);
      if (result === null) {
        errors[key] = `${key} debe ser una cadena de texto válida (máximo ${maxLength} caracteres)`;
      } else {
        sanitized[key] = result;
      }
    } else if (fieldConfig.type === 'email') {
      if (typeof value !== 'string' || !isValidEmail(value)) {
        errors[key] = `${key} debe ser un email válido`;
      } else {
        sanitized[key] = value.toLowerCase();
      }
    } else if (fieldConfig.type === 'url') {
      if (typeof value !== 'string' || !isValidUrl(value)) {
        errors[key] = `${key} debe ser una URL válida`;
      } else {
        sanitized[key] = value;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: sanitized,
  };
}

/**
 * Valida un número
 * @param value - Valor a validar
 * @param min - Valor mínimo (opcional)
 * @param max - Valor máximo (opcional)
 * @returns true si es válido, false en caso contrario
 */
export function isValidNumber(value: unknown, min?: number, max?: number): boolean {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }

  if (min !== undefined && value < min) {
    return false;
  }

  if (max !== undefined && value > max) {
    return false;
  }

  return true;
}

/**
 * Valida una fecha ISO 8601
 * @param dateString - String de fecha
 * @returns true si es válida, false en caso contrario
 */
export function isValidDate(dateString: string): boolean {
  if (typeof dateString !== 'string') {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Sanitiza entrada de nombre de archivo (previene path traversal)
 * @param filename - Nombre de archivo
 * @returns Nombre sanitizado
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') return '';

  // Remover caracteres peligrosos y path traversal
  return filename
    .replace(/[^\w\s.-]/g, '') // Solo permite word chars, espacios, puntos y guiones
    .replace(/\.\./g, '') // Previene ../ traversal
    .trim()
    .substring(0, 255); // Limitar longitud
}

/**
 * Valida un UUID v4
 * @param uuid - UUID a validar
 * @returns true si es válido, false en caso contrario
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitiza para uso en SQL (básico, considera usar prepared statements)
 * @deprecated No usar para SQL real, usar siempre prepared statements
 * @param str - String a escapar
 * @returns String escapado
 */
export function escapeSqlString(str: string): string {
  if (typeof str !== 'string') return '';

  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}
