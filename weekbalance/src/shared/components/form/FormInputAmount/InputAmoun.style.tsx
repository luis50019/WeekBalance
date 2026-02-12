import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { fs, wp } from "../../../utils/responsive";

export const styleInputAmount = StyleSheet.create({
  titlePage: {
    fontSize: 15,
    fontWeight: "light",
    textAlign: "center",
    color: '#656c79',
  },
  conatinerInput: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
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
})