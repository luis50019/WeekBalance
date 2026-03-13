import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { hp, wp } from "../../../../shared/utils/responsive";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({
  visible,
  message = "Enviando información...",
}: LoadingOverlayProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    borderRadius: 16,
    padding: wp(6),
    alignItems: "center",
    minWidth: wp(50),
  },
  message: {
    marginTop: hp(2),
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
});
