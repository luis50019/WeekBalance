import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconBar from "../UI/Icons/iconbar/IconBar";
import { styleNavBar } from "./NavBar.style";

function NavBar() {

  //TODO: logica para cambiar el color del icono seleccionado

  return (
    <View style={styleNavBar.container}>
      <IconBar text="Inicio">
        <Icon name="home" size={25} color="#000" />
      </IconBar>

      <IconBar text="Ingresos">
        <Icon name="money" size={25} color="#000" />
      </IconBar>
      <IconBar text="Ahorros">
        <MaterialIcons name="savings" size={25} color="#000" />
      </IconBar>
      <IconBar text="Estadisticas">
        <Ionicons name="stats-chart" size={25} color="#000" />
      </IconBar>

    </View>);
}

export default NavBar;