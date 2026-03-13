import { View, Text, StyleSheet } from "react-native";
import { styleCardTransaction } from "./CardTransaction.style";
import { Ionicons } from "@expo/vector-icons";
import { categories } from "../../../../core/constants/Categories";
import { useEffect, useState } from "react";

interface PropsTransactionsCard {
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface typeDate {
  mounth: string;
  day: string;
  numberDay: string;
}
export default function TransactionCard({
  amount,
  category,
  description,
  date = "lunes",
}: PropsTransactionsCard) {
  const [dateInfo, setDateInfo] = useState<typeDate>({});
  useEffect(() => {
    const DATE = new Date(date);

    const dayName = DATE.toLocaleDateString("es-MX", { weekday: "long" });
    const monthName = DATE.toLocaleDateString("es-MX", { month: "long" });
    const numberDay = DATE.getDate();

    setDateInfo({
      day: dayName,
      mounth: monthName,
      numberDay: numberDay,
    });
  }, [date]);

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
          <Text style={styleCardTransaction.datestyle}>
            {dateInfo.day}-{dateInfo.numberDay}-{dateInfo.mounth}
          </Text>
        </View>
      </View>

      <Text style={styleCardTransaction.amount}>${amount.toFixed(2)}</Text>
    </View>
  );
}
