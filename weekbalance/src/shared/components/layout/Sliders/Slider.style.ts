import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";

export const styleSlider = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  containerList: {
    flex: 1,
    paddingVertical: 10,
  },
  option: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.HeaderSlow,
    color: COLORS.textPrimary,
    padding: 8,
  },
  optionSelect: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F97316",
    borderColor: "#F97316",
    color: COLORS.textPrimary,
    padding: 8,
  },
});
