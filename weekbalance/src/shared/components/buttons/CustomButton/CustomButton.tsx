import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getStylesButton } from "./CustomButton.style";

interface CustomButtonProps {
  title:string;
  iconName?:string;
  color?:string;
  sizeIcon?:number;
  backgroundColor?:string;
  handleClick?:()=>void;
}

function CustomButton({ iconName,title,backgroundColor,color,handleClick,sizeIcon }:CustomButtonProps) {
  const stylesButton = getStylesButton(color || "#000", backgroundColor || "#fff");


  return (
    <Pressable onPress={handleClick}>
      <View style={stylesButton.container}>
        <Text allowFontScaling={false} style={stylesButton.text}>{title}</Text>
        {iconName !== "" && (
          <Ionicons name={iconName} color={color} size={sizeIcon} />
        )}
      </View>
    </Pressable>
  );
}

export default CustomButton;