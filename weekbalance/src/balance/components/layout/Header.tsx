import { Text, View } from "react-native";
import IconProfile from "../../../shared/components/UI/Icons/iconProfile/IconProfile";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from "../../../auth/store";

function Header() {
  const { profile } = useAuthStore();
  return (<View>
    <IconProfile url={profile?.avatar_url!} />
    <View>
      <Text>Bienvenido de nuevo</Text>
      <Text>{profile?.full_name!}</Text>
    </View>
    <View>
      <Ionicons name="notifications" color="#000" size={24} />
    </View>
  </View>);
}

export default Header;