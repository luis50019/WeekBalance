import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { hp, wp } from "../../../utils/responsive";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    borderRadius: 16,
    padding: wp(6),
    alignItems: "center",
    minWidth: wp(50),
  },
  message: {
    marginTop: hp(2),
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
});
