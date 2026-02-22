import { StyleSheet } from "react-native";

export const styleCardHistory = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  header: {
    height: 144,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
    marginBottom: 4,
  },
  amount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFF",
  },
  badge: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  body: {
    padding: 20,
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#94A3B8",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366F1",
  },
  progressBar: {
    height: 10,
    backgroundColor: "rgba(51,65,85,0.5)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 999,
  },
  footerText: {
    marginTop: 12,
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
  },
  bold: {
    color: "#E5E7EB",
    fontWeight: "700",
  },
});
