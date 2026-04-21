const MAXlENGTH = 30;
const MINLENGTH = 5;
const MAXVALUE = 9999;
const MINVALUE = 1;

export const amountValidations = {
  required: "Ingresa un monto",
  min: {
    value: MINVALUE,
    message: "El monto debe ser mayor a $" + MINVALUE,
  },
  max: {
    value: MAXVALUE,
    message: "El monto no puede ser mayor a $9,999",
  },
};

export const noteValidations = {
  required: "La nota es obligatoria",
  maxLength: {
    value: MAXlENGTH,
    message: "maximo " + MAXlENGTH + " caracteres",
  },
  minLength: {
    value: MINLENGTH,
    message: "mnimo " + MINLENGTH + " caracteres",
  },
};
