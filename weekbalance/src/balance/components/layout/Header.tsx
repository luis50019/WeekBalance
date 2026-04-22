import { Text, View, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../auth/store";
import { HeaderStyle } from "./Header.style";
import { COLORS } from "../../../core/constants/Color";
import { URL } from "../../../core/constants/Url";
import { useNavigate } from "../../../shared/hooks/useNavigate";

function Header() {
  const { profile, logout } = useAuthStore();
  const { navigationTo } = useNavigate();

   const getInitials = (fullName?: string | null) => {
    if (!fullName) return "?";
    const names = fullName.trim().split(" ").filter(Boolean);
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    navigationTo("Profile");
  };

  return (
    <View style={HeaderStyle.container}>
      <Pressable onPress={handleProfilePress}>
        <View style={HeaderStyle.avatar}>
          <Text style={HeaderStyle.avatarText}>
            {getInitials(profile?.full_name)}
          </Text>
        </View>
      </Pressable>
      <View style={HeaderStyle.info}>
        <Text style={HeaderStyle.message}>BIENVENIDO</Text>
        <Text style={HeaderStyle.full_name}>{profile?.full_name!}</Text>
      </View>
      <Pressable onPress={handleLogout} style={HeaderStyle.icon}>
        <Ionicons name="log-out" color="#EF4444" size={24} />
      </Pressable>
    </View>
  );
}

export default Header;
