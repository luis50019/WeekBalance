import { StyleSheet } from "react-native";
import { COLORS } from "../../../core/constants/Color";
import { hp, wp } from "../../../shared/utils/responsive";

export const SavingScreenStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: hp(100),
  },
  historyContainer: {
    marginTop: hp(5),
    width: wp(90),
    flex: 1,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: hp(2),
  },
  body: {
    backgroundColor: "transparent",
    paddingHorizontal: 5,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    height: "auto",
    paddingBottom: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(5),
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
