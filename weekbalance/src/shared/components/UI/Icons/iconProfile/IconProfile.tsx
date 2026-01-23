import { Image, View } from "react-native";

interface IconProfileProps {
  url: string;
}

function IconProfile({ url }: IconProfileProps) {
  return (
    <Image source={{uri:url}} style={{
      height: 50,
      width: 50,
      borderRadius: 50,
    }} />);
}

export default IconProfile;