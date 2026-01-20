import { Image, View } from "react-native";

interface IconProfileProps {
  url: string;
}

function IconProfile({ url }: IconProfileProps) {
  return (<View>
    <Image source={{uri:url}} style={{
      height: 100,
      width: 100,
      borderRadius: 50,
    }} />
  </View>);
}

export default IconProfile;