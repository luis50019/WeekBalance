//validaciones parar el login y el registro de usuario
export const usernameValidations = {
  required: "El nombre es obligatorio",
  minLength: {
    value: 3,
    message: "La nombre debe de tener almenos 3 caracteers",
  },
  maxLength: {
    value: 15,
    message: "El nombre no puede superar los 15 caracteres",
  },
};

export const passwordValidations = {
  required: "La contraseña es obligatoria",
  minLength: {
    value: 6,
    message: "La contraseña debe de tener almenos 6 caracteers",
  },
  maxLength: {
    value: 15,
    message: "La contraseña no puede superar los 15 caracteres",
  },
};

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
};
