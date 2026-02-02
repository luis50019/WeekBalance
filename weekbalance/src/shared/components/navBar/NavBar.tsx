import { View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import IconBar from "../UI/Icons/iconbar/IconBar";
import { styleNavBar } from "./NavBar.style";
import { COLORS } from "../../../core/constants/Color";

function NavBar() {

  //TODO: logica para cambiar el color del icono seleccionado

  return (
    <View style={styleNavBar.container}>
      <IconBar to="Home" text="Inicio">
        <Ionicons name="home" size={25} color={COLORS.textPrimary} />
      </IconBar>
      <IconBar to="historyIncomes" text="Ingresos">
        <Ionicons name="cash-outline" size={25} color={COLORS.textSecondary} />
      </IconBar>
      <IconBar to="historySavings" text="Ahorros">
        <Ionicons name="wallet" size={25} color={COLORS.textSecondary} />
      </IconBar>
      <IconBar to="stadistics" text="Estadisticas">
        <Ionicons name="stats-chart" size={25} color={COLORS.textSecondary} />
      </IconBar>
    </View>);
}

export default NavBar;