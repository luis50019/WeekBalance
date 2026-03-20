import { Pressable, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigate } from "../../../hooks/useNavigate";

interface FloatingButtonProps {
  to: string;
  label?: string;
}

function FloatingButton({ to, label }: FloatingButtonProps) {
  const { navigationToPath } = useNavigate();
  return (
    <Pressable
      style={[styles.fab, label && styles.fabWithLabel]}
      onPress={() => navigationToPath(to)}
    >
      <View style={styles.content}>
        <MaterialIcons name="add" size={24} color="#fff" />
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </Pressable>
  );
}

export default FloatingButton;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#6C6CFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  fabWithLabel: {
    paddingRight: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
