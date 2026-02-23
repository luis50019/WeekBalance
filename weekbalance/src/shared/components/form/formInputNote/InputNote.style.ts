import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { hp, wp } from "../../../utils/responsive";

export const styleInputNote = StyleSheet.create({
  containerInputNote: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  titleNote: {
    color: "#656b85",
    fontSize: 16,
  },
  inputNote: {
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#32374E",
    width: wp(80),
    height: hp(10),
  },
});

