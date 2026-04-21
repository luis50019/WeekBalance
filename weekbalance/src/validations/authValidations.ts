//validaciones parar el login y el registro de usuario
export const usernameValidations = {
  required: "El nombre es obligatorio",
  minLength: {
    value: 3,
    message: "El nombre debe tener al menos 3 caracteres",
  },
  maxLength: {
    value: 15,
    message: "El nombre no puede superar los 15 caracteres",
  },
  pattern: {
    // Permite letras (con acentos y ñ), números, espacios. No puede iniciar con espacio
    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_\s]*$/,
    message: "Solo letras, números y espacios. No puede iniciar con espacio",
  },
};

export const passwordValidations = {
  required: "La contraseña es obligatoria",
  minLength: {
    value: 8,
    message: "La contraseña debe tener al menos 8 caracteres",
  },
  maxLength: {
    value: 20,
    message: "La contraseña no puede superar los 20 caracteres",
  },
  validate: {
    hasUppercase: (value: string) =>
      /[A-Z]/.test(value) || "Debe contener al menos una letra mayúscula",
    hasLowercase: (value: string) =>
      /[a-z]/.test(value) || "Debe contener al menos una letra minúscula",
    hasNumber: (value: string) =>
      /\d/.test(value) || "Debe contener al menos un número",
    hasSpecialChar: (value: string) =>
      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
      "Debe contener al menos un carácter especial (!@#$%^&*...)",
  },
};

const ALLOWED_EMAIL_DOMAINS = ["gmail.com", "outlook.com", "hotmail.com", "live.com", "msn.com"];

export const emailValidatios = {
  required: "El correo es obligatorio",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Correo inválido",
  },
  minLength: {
    value: 5,
    message: "Muy corto",
  },
  maxLength: {
    value: 50,
    message: "Muy largo",
  },
  validate: {
    isAllowedDomain: (value: string) => {
      const domain = value.split("@")[1]?.toLowerCase();
      return (
        ALLOWED_EMAIL_DOMAINS.includes(domain) ||
        "Solo se permiten correos de Gmail, Outlook o Hotmail"
      );
    },
  },
};
