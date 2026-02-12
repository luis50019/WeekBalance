import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";

export const styleCategories = StyleSheet.create({
  titleCategories: {
    color: '#656b85',
    fontSize: 18,
    fontWeight: "ultralight",
  },
  containerCategory: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  containerIconCategory: {
    borderWidth: 1,
    borderColor: '#32374E',
    borderRadius: 10,
    padding: 10,
  },
  categories: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  }
})