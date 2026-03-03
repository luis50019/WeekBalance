import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styleCardHistory } from "./CardInforHistory.style";
import { COLORS } from "../../../../core/constants/Color";

interface PropsCardHistory {
  amount: number;
  title: string;
  mouth: string;
  year: string;
}

export default function CardHistory({
  amount,
  mouth,
  year,
  title,
}: PropsCardHistory) {
  return (
    <View style={styleCardHistory.card}>
      <LinearGradient
        colors={[COLORS.backgroundCard, "#050846"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styleCardHistory.header}
      >
        <View style={styleCardHistory.headerContent}>
          <Text style={styleCardHistory.subtitle}>{title}</Text>
          <Text style={styleCardHistory.amount}>${amount.toFixed(2)}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
