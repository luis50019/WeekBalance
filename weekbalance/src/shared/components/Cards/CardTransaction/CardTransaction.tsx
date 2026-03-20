import { View, Text, StyleSheet } from "react-native";
import { memo, useMemo } from "react";
import { styleCardTransaction } from "./CardTransaction.style";
import { Ionicons } from "@expo/vector-icons";
import { categories } from "../../../../core/constants/Categories";

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

function TransactionCardComponent({
  amount,
  category,
  description,
  date = "lunes",
}: PropsTransactionsCard) {
  const dateInfo = useMemo<typeDate>(() => {
    const DATE = new Date(date);
    const dayName = DATE.toLocaleDateString("es-MX", { weekday: "long" });
    const monthName = DATE.toLocaleDateString("es-MX", { month: "long" });
    const numberDay = DATE.getDate();
    return {
      day: dayName,
      mounth: monthName,
      numberDay: numberDay.toString(),
    };
  }, [date]);

  const categoryName = useMemo(() => categories[category] || category, [category]);

  return (
    <View style={styleCardTransaction.card}>
      <View style={styleCardTransaction.left}>
        <View style={styleCardTransaction.iconContainer}>
          <Ionicons name={category} size={22} color="#f97316" />
        </View>

        <View>
          <Text style={styleCardTransaction.title}>{description}</Text>
          <Text style={styleCardTransaction.subtitle}>
            {categoryName}
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

export default memo(TransactionCardComponent);
