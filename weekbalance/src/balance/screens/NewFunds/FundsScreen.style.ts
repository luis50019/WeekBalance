import { StyleSheet } from "react-native";
import { fs, hp, wp } from "../../../shared/utils/responsive";
import { COLORS } from "../../../core/constants/Color";

export const styleFundsScreen = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    gap: 10,
  },
  titlePage: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.backgroundCardSecondary,
  },
  conatinerInput: {},
  inputNumeric: {
    color: COLORS.textPrimary,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: wp(90),
  },
  input: {
    color: COLORS.textPrimary,
    fontSize: fs(70),
  },
  //stilos de categorias
  titleCategories: {
    color: COLORS.textPrimary,
  },
  containerCategory: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  containerIconCategory: {
    borderWidth: 1,
    borderColor: "#32374E",
    borderRadius: 10,
    padding: 10,
  },
  iconColor: {},
  iconColorSelected: {},
  // estilo para añadir nota
  categories: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});

