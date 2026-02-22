import { StyleSheet } from "react-native";
import { hp } from "../../../shared/utils/responsive";
import { COLORS } from "../../../core/constants/Color";

export const StyleExpenseScreen = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    gap: 10,
  },
  titlePage: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.textPrimary,
  },
  containerCategory: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  categories: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});

