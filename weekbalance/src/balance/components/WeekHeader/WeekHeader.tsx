import { View, Text, StyleSheet } from "react-native";
import { memo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../core/constants/Color";

interface WeekHeaderProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const day = date.getDate();
  const month = months[date.getMonth()];
  return `${month} ${day}`;
}

const WeekHeaderComponent = ({
  weekNumber,
  startDate,
  endDate,
  totalAmount,
}: WeekHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.weekBadge}>
          <Text style={styles.weekText}>Semana {weekNumber}</Text>
        </View>
        <Text style={styles.dateRange}>
          {formatDate(startDate)} - {formatDate(endDate)}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <MaterialCommunityIcons name="cash" size={18} color={COLORS.backgroundCard} />
        <Text style={styles.totalAmount}>
          ${totalAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.cardTransactions,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  leftSection: {
    flex: 1,
  },
  weekBadge: {
    backgroundColor: "rgba(78, 84, 200, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  weekText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.backgroundCard,
  },
  dateRange: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4EC896",
  },
});

export const WeekHeader = memo(WeekHeaderComponent);
