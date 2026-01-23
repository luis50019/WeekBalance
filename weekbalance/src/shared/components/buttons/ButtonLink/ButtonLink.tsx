import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from "react-native";
import { useNavigate } from "../../../hooks/useNavigate";
import { ButtonLinkStyle } from './ButtonLink.style';

interface ButtonLinkProps {
  nameIcon: string;
  label: string;
  to: string;
  colorLabel?: string;
  colorBackground?: string;
}

function ButtonLink({ nameIcon, label, to, colorLabel, colorBackground }: ButtonLinkProps) {
  const { navigationTo } = useNavigate()
  const style = ButtonLinkStyle({ colorLabel, colorBackground });

  return (<Pressable onPress={() => navigationTo(to)}>
    <View style={style.container}>
      <Ionicons name={nameIcon} size={24} color={colorLabel} />
      <Text style={style.label}>{label}</Text>
    </View>
  </Pressable>);
}

export default ButtonLink;