import { StyleSheet } from "react-native";

export const styleCategory = StyleSheet.create({
  card: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#94A3B8",
  },
  cardActive: {
    borderColor: "#F97316",
    backgroundColor: "rgba(249, 115, 22, 0.1)",
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textAlign: "center",
  },
  labelActive: {
    color: "#F97316",
  },
});
