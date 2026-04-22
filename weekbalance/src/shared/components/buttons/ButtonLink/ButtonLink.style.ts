import { StyleSheet } from "react-native";
import { fs, wp } from "../../../utils/responsive";

interface ButtonLinkStyleProps {
  colorLabel?: string;
  colorBackground?: string;
}

export const ButtonLinkStyle = ({
  colorLabel,
  colorBackground,
}: ButtonLinkStyleProps) => {
  return StyleSheet.create({
    container: {
      width: wp(38),
      height: wp(15),
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      gap: 5,
      borderRadius: 10,
      backgroundColor: colorBackground,
    },
    label: {
      color: colorLabel,
      fontSize: fs(15),
      fontWeight: "light",
    },
  });
};
