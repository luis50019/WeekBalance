import { Text, View } from "react-native";
import { StyleAuth } from "../LoginScreen.style";
import IconWallet from "../../../shared/components/UI/IconWallet/IconWallet";
import H1 from "../../../shared/components/UI/title/Title";
import Messages from "../../../shared/components/UI/messages/Messages";
import FormInput from "../../../shared/components/form/FormInput/FormIput";
import { useLogin } from "../../hooks/useLogin";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";
import { COLORS } from "../../../core/constants/Color";
import { Link } from "../../../shared/components/buttons/CustomButton/Link";

function LoginScreen() {
   const {control,handleSubmit,onSubmit } = useLogin();
  return (
    <View style={StyleAuth.container}>
       <IconWallet/>
       <H1 message="Bienvenido" />
       <Messages message="Cuida de tus activos con" textImportant="WeekBalance"/>
      <View style={StyleAuth.container_form}>
        <FormInput control={control} name="email" label="Correo"  placeholder="nombre@ejemplo.com" />
        <FormInput control={control} name="password" label="Contraseña" secureTextEntry placeholder="Ingresa tu contraseña" />
        <CustomButton title="Iniciar sesión" sizeIcon={20} iconName="arrow-forward-outline" backgroundColor="#2b4bee" color={COLORS.textPrimary}  handleClick={handleSubmit(onSubmit)}/>
      </View>
      <View style={StyleAuth.container_foot}>
          <Text style={StyleAuth.messageLink} >¿No tienes cuenta?</Text>
          <Link to="Register" style={StyleAuth.link}>Registrate</Link>
      </View>
    </View>
   );
}

export default LoginScreen;