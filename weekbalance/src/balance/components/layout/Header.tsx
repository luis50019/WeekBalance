import { Text, View } from "react-native";
import IconProfile from "../../../shared/components/UI/Icons/iconProfile/IconProfile";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../auth/store";
import { HeaderStyle } from "./Header.style";
import { COLORS } from "../../../core/constants/Color";
import { URL } from "../../../core/constants/Url";

function Header() {
  const { profile } = useAuthStore();
  return (
    <View style={HeaderStyle.container}>
      <IconProfile url={profile?.avatar_url || URL.url_avatar} />
      <View style={HeaderStyle.info}>
        <Text style={HeaderStyle.message}>BIENVENIDO</Text>
        <Text style={HeaderStyle.full_name}>{profile?.full_name!}</Text>
      </View>
      <View style={HeaderStyle.icon}>
        <Ionicons name="notifications" color={COLORS.textPrimary} size={24} />
      </View>
    </View>
  );
}

export default Header;

