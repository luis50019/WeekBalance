import { StyleSheet } from "react-native";

export const RecentExpensesStyle = StyleSheet.create({
  container: {
    backgroundColor: "#26283a",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(61, 68, 96, 0.5)",
  },
});
