import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";

export const styleCategory = StyleSheet.create({
  conatinerCategory: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  containerIconCategory: {
    display: "flex",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#32374E",
    borderRadius: 10,
    padding: 15,
  },
  containerIconCategorySelected: {
    display: "flex",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d75a12c4",
    backgroundColor: "#f15d080d",
    borderRadius: 10,
    padding: 15,
  },
  iconColor: {
    color: "#94A3B8",
  },
  iconColorSelected: {
    color: "#ffffff",
  },
  textColor: {
    fontSize: 16,
    color: "#656b85",
  },
  textColorSelected: {
    fontSize: 16,
    color: "#d75a12c4",
  },
});

