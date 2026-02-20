import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";

export const styleCardTransaction = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.cardTransactions,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardTransactions,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(249, 115, 22, 0.1)", // bg-accent/10
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});
