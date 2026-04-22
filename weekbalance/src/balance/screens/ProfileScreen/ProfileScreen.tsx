import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../../hooks/useProfile";
import { ProfileScreenStyle } from "./ProfileScreen.style";
import { COLORS } from "../../../core/constants/Color";
import { useAuthStore } from "../../../auth/store";
import { useNavigate } from "../../../shared/hooks/useNavigate";
import CustomButton from "../../../shared/components/buttons/CustomButton/CustomButton";

function ProfileScreen() {
  const { navigationTo } = useNavigate();
  const { user } = useAuthStore();
  const {
    name,
    setName,
    email,
    isSubmitting,
    errorMessage,
    nameError,
    successMessage,
    updateName,
    isNameValid,
  } = useProfile();

  const getInitials = (fullName: string) => {
    if (!fullName) return "?";
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleSave = () => {
    if (successMessage) {
      setTimeout(() => {
        navigationTo("Home");
      }, 1000);
    }
  };

  return (
    <ScrollView style={ProfileScreenStyle.container}>
      <View style={ProfileScreenStyle.avatarContainer}>
        <View style={ProfileScreenStyle.avatar}>
          <Text style={ProfileScreenStyle.avatarText}>{getInitials(name)}</Text>
        </View>
      </View>

      {errorMessage && (
        <View
          style={{
            backgroundColor: COLORS.danger,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: COLORS.textPrimary }}>{errorMessage}</Text>
        </View>
      )}

      {successMessage && (
        <View
          style={{
            backgroundColor: COLORS.success,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: COLORS.textPrimary }}>{successMessage}</Text>
        </View>
      )}

      <View style={ProfileScreenStyle.section}>
        <Text style={ProfileScreenStyle.sectionTitle}>
          Información personal
        </Text>

        <View style={ProfileScreenStyle.inputContainer}>
          <Text style={ProfileScreenStyle.inputLabel}>Nombre completo</Text>
          <TextInput
            style={[
              ProfileScreenStyle.input,
              nameError && {
                borderColor: COLORS.danger,
                borderWidth: 1.5,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            placeholderTextColor={COLORS.gray}
          />
          {nameError && (
            <Text style={{ color: COLORS.danger, fontSize: 12, marginTop: 6 }}>
              {nameError}
            </Text>
          )}
        </View>

        <Pressable
          style={ProfileScreenStyle.changePasswordButton}
          onPress={() =>
            Alert.alert("Próximamente", "Cambio de contraseña en desarrollo")
          }
        >
          <Text style={ProfileScreenStyle.changePasswordText}>
            Cambiar contraseña
          </Text>
        </Pressable>
      </View>

      <View style={ProfileScreenStyle.section}>
        <Text style={ProfileScreenStyle.sectionTitle}>Correo electrónico</Text>

        <View style={ProfileScreenStyle.inputContainer}>
          <Text style={ProfileScreenStyle.inputLabel}>Email</Text>
          <TextInput
            style={[ProfileScreenStyle.input, { color: COLORS.gray }]}
            value={email}
            editable={false}
          />
        </View>
        <Text style={{ color: COLORS.gray, fontSize: 12, marginTop: 4 }}>
          El correo no se puede cambiar
        </Text>
      </View>
      <View style={ProfileScreenStyle.buttonContainer}>
        <CustomButton
          title={isSubmitting ? "Guardando..." : "Guardar cambios"}
          handleClick={updateName}
          backgroundColor={isSubmitting || !isNameValid ? COLORS.gray : COLORS.primary}
          color={COLORS.textPrimary}
          disabled={!isNameValid || isSubmitting}
        />
      </View>
    </ScrollView>
  );
}

export default ProfileScreen;

