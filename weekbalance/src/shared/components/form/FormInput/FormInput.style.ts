import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { fs, hp, wp } from "../../../utils/responsive";

export const styleFormInput = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    width: wp(80),
    height: hp(5),
    paddingLeft: 5,
    backgroundColor: "",
    borderColor: "#32374E",
    borderWidth: 1,
    color: "#fff",
    borderRadius: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 2,
  },
  labelInput: {
    fontFamily: "Manrope , arial",
    paddingLeft: 5,
    fontSize: fs(15),
    fontWeight: "400",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
});
