import { StyleSheet } from "react-native";
import { COLORS } from "../../core/constants/Color";
import { hp, wp } from "../../shared/utils/responsive";

export const StyleAuth = StyleSheet.create({
  container: {
    flex: 1,
    height: hp(120),
    backgroundColor: COLORS.background,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 50,
    justifyContent: "flex-start",
  },
  container_form: {
    width: wp(80),
    height: hp(40),
    gap: 20,
    marginTop: hp(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  container_foot: {
    width: wp(80),
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  messageLink: {
    color: COLORS.textPrimary,
    fontWeight: "bold",
    fontSize: 15,
  },
  link: {
    color: COLORS.textPrimary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  error: {
    color: COLORS.error,
    fontWeight: "500",
    fontSize: 15,
  },
});

