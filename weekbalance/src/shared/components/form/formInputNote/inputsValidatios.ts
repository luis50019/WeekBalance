const MAXlENGTH = 15;
const MINLENGTH = 5;
const MAXVALUE = 9999;
const MINVALUE = 1;

export const amountValidations = {
  required: "El monto es obligatorio",
  min: {
    value: MINVALUE,
    message: "EL monto minimo es $" + MINVALUE,
  },
  max: {
    value: MAXVALUE,
    message: "El monto minimo es $" + MAXVALUE,
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
