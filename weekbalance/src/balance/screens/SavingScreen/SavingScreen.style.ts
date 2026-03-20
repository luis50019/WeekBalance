import { StyleSheet } from "react-native";
import { COLORS } from "../../../core/constants/Color";
import { hp } from "../../../shared/utils/responsive";

export const SavingScreenStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: hp(2),
    paddingBottom: hp(3),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  goalCard: {
    backgroundColor: COLORS.cardTransactions,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  goalCardIncomplete: {
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  incompleteBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  incompleteText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#EF4444",
    letterSpacing: 0.5,
  },
  goalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  goalAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  goalAmountIncomplete: {
    color: "#EF4444",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(78, 84, 200, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 4,
  },
  progressBarFillIncomplete: {
    backgroundColor: "#EF4444",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.backgroundCard,
    minWidth: 40,
    textAlign: "right",
  },
  progressTextIncomplete: {
    color: "#EF4444",
  },
  remainingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  remainingTextIncomplete: {
    color: "#EF4444",
  },
  metricsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.cardTransactions,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  historySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  historyPeriod: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyHistory: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyHistoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyGoalCard: {
    backgroundColor: COLORS.cardTransactions,
    borderRadius: 20,
    padding: 40,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  emptyGoalText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptyGoalSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  loadMoreButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 6,
  },
  loadMoreText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
