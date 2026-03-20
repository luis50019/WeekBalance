import { View, Text, StyleSheet } from "react-native";
import { memo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../core/constants/Color";

interface CardWeekProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
  amount: number;
  targetAmount?: number;
  status: "completed" | "in_progress" | "extra" | "incomplete";
}

const CardWeekComponent = ({
  weekNumber,
  startDate,
  endDate,
  amount,
  targetAmount = 500,
  status,
}: CardWeekProps) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const percentage = Math.min((amount / targetAmount) * 100, 100);
  const isExtra = amount > targetAmount;
  const isIncomplete = status === "incomplete";

  const getStatusText = () => {
    if (status === "completed") return "META CUMPLIDA";
    if (status === "extra" || isExtra) return `EXTRA +$${(amount - targetAmount).toFixed(2)}`;
    if (isIncomplete) return "META INCOMPLETA";
    return `${percentage.toFixed(0)}% COMPLETADO`;
  };

  const getStatusColor = () => {
    if (status === "completed" || isExtra) return "#4EC896";
    if (isIncomplete) return "#EF4444";
    return "#F59E0B";
  };

  const getStatusIcon = () => {
    if (status === "completed" || isExtra) return "check-circle";
    if (isIncomplete) return "close-circle";
    return "clock-outline";
  };

  return (
    <View style={[styles.container, isIncomplete && styles.containerIncomplete]}>
      <View style={styles.leftSection}>
        <Text style={[styles.shortDate, isIncomplete && styles.textIncomplete]}>{formattedStartDate}</Text>
        <View style={styles.weekInfo}>
          <Text style={[styles.weekNumber, isIncomplete && styles.textIncomplete]}>Semana {weekNumber}</Text>
          <Text style={styles.dateRange}>
            {formattedStartDate} - {formattedEndDate}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, isExtra && styles.amountExtra, isIncomplete && styles.amountIncomplete]}>
          +${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </Text>
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons
            name={getStatusIcon()}
            size={14}
            color={getStatusColor()}
          />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
    </View>
  );
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  return `${month} ${day}`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardTransactions,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  containerIncomplete: {
    borderLeftWidth: 3,
    borderLeftColor: "#EF4444",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  shortDate: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginRight: 12,
    width: 55,
  },
  weekInfo: {
    flex: 1,
  },
  weekNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  dateRange: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4EC896",
  },
  amountExtra: {
    color: "#F59E0B",
  },
  amountIncomplete: {
    color: "#EF4444",
  },
  textIncomplete: {
    color: "#EF4444",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export const CardWeek = memo(CardWeekComponent);
