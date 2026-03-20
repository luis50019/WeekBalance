import { StyleSheet } from "react-native";
import { COLORS } from "../../../core/constants/Color";
import { hp } from "../../../shared/utils/responsive";

export const NewSavingScreenStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: hp(2),
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  helpButton: {
    padding: 8,
  },
  goalCard: {
    backgroundColor: COLORS.cardTransactions,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 15,
    width: "90%",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  goalText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  weekDates: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  amountSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 15,
    marginBottom: 10,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  saveButton: {
    backgroundColor: COLORS.backgroundCard,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: "85%",
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
