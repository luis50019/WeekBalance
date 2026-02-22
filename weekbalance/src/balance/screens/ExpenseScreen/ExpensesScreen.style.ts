import { StyleSheet } from "react-native";
import { COLORS } from "../../../core/constants/Color";

export const styleExpensesScreen = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  body: {
    backgroundColor: "transparent",
    paddingHorizontal: 5,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    height: "auto",
    paddingBottom: 200,
  },
});
