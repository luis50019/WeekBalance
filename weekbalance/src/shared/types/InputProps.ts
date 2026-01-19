import { Control } from "react-hook-form";

export type InputProps = {
  control: Control<any>;
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  rules?: object;
  label:string,
};