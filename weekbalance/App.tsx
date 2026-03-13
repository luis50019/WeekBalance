import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigation from "./src/app/navigations/AppNavigation";
import { COLORS } from "./src/core/constants/Color";
//TODO:
//añadir el dia y la fecha en el historial de gastos
//agregar la pantalla de ahorros, en donde se mostrara el historial de ahorros semanales

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigation />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
