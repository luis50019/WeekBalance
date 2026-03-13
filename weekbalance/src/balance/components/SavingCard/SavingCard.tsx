import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../core/constants/Color";
import { hp, wp } from "../../../shared/utils/responsive";

interface SavingCardProps {
  amount: number;
  weekStart: string;
  weekEnd: string;
}

function SavingCard({ amount, weekStart, weekEnd }: SavingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <LinearGradient
      colors={["#ecb912", "#c2970a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="piggy-bank" size={24} color="#fff" />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Ahorro Semanal</Text>
          <Text style={styles.amount}>+${amount.toFixed(2)}</Text>
        </View>
        <View style={styles.dateRange}>
          <Text style={styles.dateLabel}>
            {formatDate(weekStart)} - {formatDate(weekEnd)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(1.5),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.background,
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C542D",
  },
  dateRange: {
    marginTop: hp(0.5),
  },
  dateLabel: {
    fontSize: 14,
    color: "#fff",
  },
});

export default SavingCard;
