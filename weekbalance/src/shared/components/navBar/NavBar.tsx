import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IconBar from "../UI/Icons/iconbar/IconBar";
import { styleNavBar } from "./NavBar.style";
import { COLORS } from "../../../core/constants/Color";
import { useState } from "react";

function NavBar() {
  const [selected, setSelected] = useState("Inicio");

  const handleIconPress = (icon: string) => {
    setSelected(icon);
  };

  return (
    <View style={styleNavBar.container}>
      <IconBar click={handleIconPress} to="Home" text="Inicio">
        <Ionicons
          name="home"
          size={25}
          color={
            selected == "Inicio" ? COLORS.textPrimary : COLORS.textSecondary
          }
        />
      </IconBar>
      <IconBar click={handleIconPress} to="historyIncomes" text="Ingresos">
        <Ionicons
          name="wallet"
          size={25}
          color={
            selected == "Ingresos" ? COLORS.textPrimary : COLORS.textSecondary
          }
        />
      </IconBar>
       <IconBar click={handleIconPress} to="historyExpenses" text="Gastos">
        <Ionicons
          name="cash-outline"
          size={25}
          color={
            selected == "Gastos" ? COLORS.textPrimary : COLORS.textSecondary
          }
        />
      </IconBar>
    </View>
  );
}

export default NavBar;
