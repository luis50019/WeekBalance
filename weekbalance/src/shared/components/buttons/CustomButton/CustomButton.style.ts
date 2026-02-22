import { StyleSheet } from "react-native";
import { fs, wp } from "../../../utils/responsive";

export const getStylesButton = (color: string, backgroundColor: string) =>
  StyleSheet.create({
    container: {
      width: wp(90),
      borderRadius: 20,
      paddingVertical: 10,
      backgroundColor: backgroundColor,
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
