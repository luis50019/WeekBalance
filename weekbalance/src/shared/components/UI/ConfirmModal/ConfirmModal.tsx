import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../../UI/ConfirmModal/ConfirmModal.style.ts";
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
