/**
 * Sanitiza el texto para solo permitir números y un punto decimal.
 * Elimina cualquier carácter que no sea dígito o punto.
 * @param value - El valor del input a sanitizar
 * @returns El valor sanitizado solo con números y punto decimal
 */
export const sanitizeNumericInput = (value: string): string => {
  // Regex: solo permite dígitos (0-9) y un punto decimal
  // Primero removemos todo lo que no sea número o punto
  const sanitized = value.replace(/[^0-9.]/g, "");

  // Si hay más de un punto, dejamos solo el primero
  const parts = sanitized.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }

  return sanitized;
};

/**
 * Versión para integers (sin decimales)
 * @param value - El valor del input a sanitizar
 * @returns El valor sanitizado solo con números enteros
 */
export const sanitizeIntegerInput = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};
