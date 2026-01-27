import { StyleSheet } from "react-native";
import { COLORS } from "../../core/constants/Color";
import { hp } from "../../shared/utils/responsive";

export const StyleMainLayout = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    display: "flex",
    flexDirection: "column",
    justifyContent: 'space-between',
    borderColor: "black",
    height: hp(100),
  },
})