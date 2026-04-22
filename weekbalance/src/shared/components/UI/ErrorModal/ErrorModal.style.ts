import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { hp, wp } from "../../../utils/responsive";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 16,
    padding: wp(5),
    width: wp(80),
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EF4444",
    marginBottom: hp(2),
  },
  message: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: hp(3),
  },
  button: {
    backgroundColor: COLORS.error,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(8),
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
