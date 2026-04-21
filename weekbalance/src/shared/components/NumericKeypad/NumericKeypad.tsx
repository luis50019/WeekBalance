import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { COLORS } from "../../../core/constants/Color";
import { styles } from "./NumericKeyPad.style";

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

const NumericKeypadComponent = ({
  onKeyPress,
  onDelete,
}: NumericKeypadProps) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "delete"],
  ];

  const renderKey = (key: string) => {
    if (key === "delete") {
      return (
        <Pressable
          key={key}
          style={({ pressed }) => [
            styles.key,
            styles.actionKey,
            pressed && styles.keyPressed,
          ]}
          onPress={onDelete}
        >
          <MaterialCommunityIcons
            name="backspace-outline"
            size={28}
            color={COLORS.textPrimary}
          />
        </Pressable>
      );
    }

    return (
      <Pressable
        key={key}
        style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
        onPress={() => onKeyPress(key)}
      >
        <Text style={styles.keyText}>{key}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => renderKey(key))}
        </View>
      ))}
    </View>
  );
};

export const NumericKeypad = memo(NumericKeypadComponent);
