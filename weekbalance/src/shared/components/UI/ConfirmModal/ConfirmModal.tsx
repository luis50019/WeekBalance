import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../core/constants/Color";
interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: string;
  iconColor?: string;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Continuar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  icon = "alert-circle",
  iconColor = "#F59E0B",
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${iconColor}20` },
            ]}
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={40}
              color={iconColor}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: COLORS.cardTransactions,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(148, 163, 184, 0.2)",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  confirmButton: {
    backgroundColor: "#EF4444",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
