import { Text, View, Pressable, Alert } from "react-native";
import IconProfile from "../../../shared/components/UI/Icons/iconProfile/IconProfile";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../auth/store";
import { HeaderStyle } from "./Header.style";
import { COLORS } from "../../../core/constants/Color";
import { URL } from "../../../core/constants/Url";

function Header() {
  const { profile, logout } = useAuthStore();

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

  return (
    <View style={HeaderStyle.container}>
      <IconProfile url={profile?.avatar_url || URL.url_avatar} />
      <View style={HeaderStyle.info}>
        <Text style={HeaderStyle.message}>BIENVENIDO</Text>
        <Text style={HeaderStyle.full_name}>{profile?.full_name!}</Text>
      </View>
      <Pressable onPress={handleLogout} style={HeaderStyle.icon}>
        <Ionicons name="log-out" color={COLORS.textPrimary} size={24} />
      </Pressable>
    </View>
  );
}

export default Header;

