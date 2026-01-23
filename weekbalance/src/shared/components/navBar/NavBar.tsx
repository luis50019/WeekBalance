import { View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import IconBar from "../UI/Icons/iconbar/IconBar";
import { styleNavBar } from "./NavBar.style";
import { COLORS } from "../../../core/constants/Color";

function NavBar() {

  //TODO: logica para cambiar el color del icono seleccionado

  return (
    <View style={styleNavBar.container}>
      <IconBar text="Inicio">
        <Ionicons name="home" size={25} color={COLORS.Headers} />
      </IconBar>
      <IconBar text="Ingresos">
        <Ionicons name="cash-outline" size={25} color={COLORS.textSecondary} />
      </IconBar>
      <IconBar text="Ahorros">
        <Ionicons name="wallet" size={25} color={COLORS.textSecondary} />
      </IconBar>
      <IconBar text="Estadisticas">
        <Ionicons name="stats-chart" size={25} color={COLORS.textSecondary} />
      </IconBar>

    </View>);
}

export default NavBar;