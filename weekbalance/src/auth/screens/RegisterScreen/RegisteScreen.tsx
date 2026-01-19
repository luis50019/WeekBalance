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

function RegisterScreen({navigation}) {
   const {control,handleSubmit,onSubmit } = useRegister({navigation});
  return (
    <View style={StyleAuth.container}>
       <IconWallet/>
       <H1 message="WeekBalance" />
       <Messages message="Unete a la élite de las" textImportant="finanzas"/>
      <View style={StyleAuth.container_form}>
        <FormInput control={control} name="text" label="Nombre de usuario" placeholder="usuario123" />
        <FormInput control={control} name="email" label="Correo"  placeholder="nombre@ejemplo.com" />
        <FormInput control={control} name="password" label="Contraseña" secureTextEntry placeholder="Ingresa tu contraseña" />
        <CustomButton title="Crear cuenta" sizeIcon={20} iconName="arrow-right" backgroundColor="#2b4bee" color={COLORS.background}handleClick={handleSubmit(onSubmit)}/>
      </View>
      <View style={StyleAuth.container_foot}>
          <Text>¿ya tienes un cuenta?</Text>
          <Link to="Login" style={StyleAuth.link}>inciar sesion</Link>
      </View>
    </View>
   );
}

export default RegisterScreen;