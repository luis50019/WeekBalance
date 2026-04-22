import { StyleSheet } from "react-native";
import { fs, wp } from "../../../utils/responsive";

export const getStylesButton = (color: string, backgroundColor: string, isSecondary = false) =>
  StyleSheet.create({
    container: {
      width: wp(80),
      borderRadius: 20,
      paddingVertical: 10,
      backgroundColor: backgroundColor,
      borderWidth: isSecondary ? 1 : 0,
      borderColor: isSecondary ? "#666" : "transparent",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    text: {
      color: color,
      fontSize: fs(15),
      fontWeight: "500",
    },
  });
