import { View, Text } from "react-native";
import { CircleGrapicStyle } from "../../Grapics/CircleGrapic.style";
import { MaterialIcons } from "@expo/vector-icons";

interface PropsEmptyData {
  title: string;
  message: string;
  nameIcon?: string;
}

export default function EmptyData({
  title,
  message,
  nameIcon = "donut-large",
}: PropsEmptyData) {
  return (
    <View style={CircleGrapicStyle.container}>
      <MaterialIcons name={nameIcon} size={64} color="#4B5563" />

      <View style={{ alignItems: "center", marginTop: 16 }}>
        <Text style={[CircleGrapicStyle.centerValue, { fontSize: 20 }]}>
          {title}
        </Text>

        <Text
          style={[
            CircleGrapicStyle.centerSubtitle,
            { marginTop: 8, textAlign: "center" },
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}
