import { Pressable, StyleSheet } from "react-native";
import {MaterialIcons  } from '@expo/vector-icons';
import { useNavigate } from "../../../hooks/useNavigate";

interface FloatingButtonProps {
  to:string
}

function FloatingButton({ to }: FloatingButtonProps) {
  const { navigationToPath } = useNavigate();
  return (
    <Pressable style={styles.fab} onPress={()=>navigationToPath(to)}>
      <MaterialIcons  name="add" size={28} color="#fff" />
    </Pressable>
  );
}

export default FloatingButton;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 220,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6C6CFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
