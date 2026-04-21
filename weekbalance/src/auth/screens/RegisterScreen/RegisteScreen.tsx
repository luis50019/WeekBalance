import { Text, View } from "react-native";
import { StyleAuth } from "../LoginScreen.style";
import IconWallet from "../../../shared/components/UI/IconWallet/IconWallet";
import H1 from "../../../shared/components/UI/title/Title";
import Messages from "../../../shared/components/UI/messages/Messages";
import FormInput from "../../../shared/components/form/FormInput/FormIput";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { COLORS } from "../../../core/constants/Color";
import { Link } from "../../../shared/components/buttons/CustomButton/Link";
import { useRegister } from "../../hooks/useRegister";
import {
  emailValidatios,
  passwordValidations,
  usernameValidations,
} from "../../../validations/authValidations";

function RegisterScreen() {
  const { control, handleSubmit, onSubmit, errorMessage } = useRegister();
  return (
    <View style={StyleAuth.container}>
      <IconWallet />
      <H1 message="WeekBalance" />
      <Messages message="Unete a la élite de las" textImportant="finanzas" />
      <View style={StyleAuth.container_form}>
        <FormInput
          rules={usernameValidations}
          control={control}
          name="name"
          keyboardType="default"
          label="Nombre de usuario"
          placeholder="usuario123"
        />
        <FormInput
          rules={emailValidatios}
          control={control}
          name="email"
          label="Correo"
          placeholder="nombre@ejemplo.com"
        />
        <FormInput
          rules={passwordValidations}
          control={control}
          name="password"
          label="Contraseña"
          secureTextEntry
          placeholder="Ingresa tu contraseña"
        />
        <CustomButton
          title="Crear cuenta"
          sizeIcon={20}
          iconName="arrow-forward-outline"
          backgroundColor="#2b4bee"
          color={COLORS.textPrimary}
          handleClick={handleSubmit(onSubmit)}
        />

        <Text style={StyleAuth.error}>{errorMessage ? errorMessage : ""}</Text>
      </View>
      <View style={StyleAuth.container_foot}>
        <Text style={StyleAuth.messageLink}>¿Ya tienes una cuenta?</Text>
        <Link to="Login" style={StyleAuth.link}>
          Inicia sesión
        </Link>
      </View>
    </View>
  );
}

export default RegisterScreen;
