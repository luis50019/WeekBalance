import {
  Modal as RNModal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { hp, wp } from "../../../../shared/utils/responsive";

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({
  visible,
  message,
  onClose,
}: ErrorModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>Error</Text>
              <Text style={styles.message}>{message}</Text>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 16,
    padding: wp(5),
    width: wp(80),
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EF4444",
    marginBottom: hp(2),
  },
  message: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: hp(3),
  },
  button: {
    backgroundColor: COLORS.error,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(8),
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
