import React from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getStylesButton } from "./CustomButton.style";

interface CustomButtonProps {
  title: string;
  iconName?: string;
  color?: string;
  sizeIcon?: number;
  backgroundColor?: string;
  handleClick?: () => void;
  variant?: "primary" | "secondary";
}

function CustomButton({
  iconName,
  title,
  backgroundColor,
  color,
  handleClick,
  sizeIcon,
  variant = "primary",
}: CustomButtonProps) {
  const isSecondary = variant === "secondary";
  const stylesButton = getStylesButton(
    color || (isSecondary ? "#666" : "#000"),
    backgroundColor || (isSecondary ? "transparent" : "#fff"),
    isSecondary,
  );

  return (
    <Pressable onPress={handleClick}>
      <View style={stylesButton.container}>
        <Text allowFontScaling={false} style={stylesButton.text}>
          {title}
        </Text>
        {iconName !== "" && (
          <Ionicons name={iconName} color={color} size={sizeIcon} />
        )}
      </View>
    </Pressable>
  );
}

export default CustomButton;
