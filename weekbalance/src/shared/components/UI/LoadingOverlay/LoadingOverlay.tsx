import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { hp, wp } from "../../../../shared/utils/responsive";
import { styles } from "./LoadingOverlay.style";

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
