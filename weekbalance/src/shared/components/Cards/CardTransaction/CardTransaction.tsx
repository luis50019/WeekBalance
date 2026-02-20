import { View, Text, StyleSheet } from "react-native";
import { styleCardTransaction } from "./CardTransaction.style";
import { Ionicons } from "@expo/vector-icons";
import { categories } from "../../../../core/constants/Categories";

// TODO: agregar logica para colocar la categoria en espanol
interface PropsTransactionsCard {
  amount: number;
  category: string;
  description: string;
}

export default function TransactionCard({
  amount,
  category,
  description,
}: PropsTransactionsCard) {
  return (
    <View style={styleCardTransaction.card}>
      <View style={styleCardTransaction.left}>
        <View style={styleCardTransaction.iconContainer}>
          <Ionicons name={category} size={22} color="#f97316" />
        </View>

        <View>
          <Text style={styleCardTransaction.title}>{description}</Text>
          <Text style={styleCardTransaction.subtitle}>
            {categories[category]}
          </Text>
        </View>
      </View>

      <Text style={styleCardTransaction.amount}>${amount.toFixed(2)}</Text>
    </View>
  );
}
