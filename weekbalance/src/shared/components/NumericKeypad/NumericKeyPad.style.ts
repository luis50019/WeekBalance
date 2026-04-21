import { StyleSheet } from "react-native";
import { COLORS } from "../../../core/constants/Color";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  key: {
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: COLORS.cardTransactions,
  },
  actionKey: {
    backgroundColor: "rgba(78, 84, 200, 0.2)",
  },
  keyPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  keyText: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
