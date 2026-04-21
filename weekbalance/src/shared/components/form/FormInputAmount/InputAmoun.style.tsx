import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { fs, wp } from "../../../utils/responsive";

export const styleInputAmount = StyleSheet.create({
  titlePage: {
    fontSize: 15,
    fontWeight: "light",
    textAlign: "center",
    color: "#656c79",
  },
  conatinerInput: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  inputNumeric: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: wp(90),
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: COLORS.textPrimary,
    fontSize: fs(70),
  },
  prefix: {
    color: COLORS.textPrimary,
    fontSize: fs(70),
    fontWeight: "300",
  },
  error: {
    width: "100%",
    textAlign: "center",
    color: COLORS.error,
    marginTop: 8,
  },
});
