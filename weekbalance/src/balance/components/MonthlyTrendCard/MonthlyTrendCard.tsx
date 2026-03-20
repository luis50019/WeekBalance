import { Text, View, ActivityIndicator } from "react-native";
import { MonthlyTrendCardStyle } from "./MonthlyTrendCard.style";
import { CircleGrapic } from "../../../shared/components/Grapics/CircleGrapic";
import { memo, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface WeeklyTrendData {
  week: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  dateRangeLabel: string;
  isCurrentWeek: boolean;
  income: number;
  expenses: number;
  balance: number;
}

interface MonthlyTrendCardProps {
  data: WeeklyTrendData[] | null;
  loading?: boolean;
}

function MonthlyTrendCardComponent({
  data,
  loading = false,
}: MonthlyTrendCardProps) {
  const lastWeekBalance = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data[data.length - 1]?.balance ?? 0;
  }, [data]);

  const percentageChange = useMemo(() => {
    if (!data || data.length < 2) return 0;
    const firstWeek = data[0].balance;
    const lastWeek = data[data.length - 1].balance;
    if (firstWeek === 0 && lastWeek === 0) return 0;
    if (firstWeek === 0) return 100;
    return ((lastWeek - firstWeek) / Math.abs(firstWeek)) * 100;
  }, [data]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.map((item) => ({
      value: Number(item.balance) || 0,
      color: "#4E54C8",
      text: item.dateRangeLabel,
      isCurrentWeek: item.isCurrentWeek,
    }));
  }, [data]);

  const isPositive = percentageChange >= 0;

  if (loading) {
    return (
      <View style={MonthlyTrendCardStyle.container}>
        <View style={MonthlyTrendCardStyle.loadingContainer}>
          <ActivityIndicator size="large" color="#4E54C8" />
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={MonthlyTrendCardStyle.container}>
        <Text style={{ color: "#94A3B8", textAlign: "center" }}>
          Sin datos de tendencia disponibles
        </Text>
      </View>
    );
  }

  return (
    <View style={MonthlyTrendCardStyle.container}>
      <View style={MonthlyTrendCardStyle.header}>
        <Text style={MonthlyTrendCardStyle.headerTitle}>TENDENCIA SEMANAL</Text>
        <View style={MonthlyTrendCardStyle.headerIcon}>
          <MaterialCommunityIcons name="chart-line" size={18} color="#4E54C8" />
        </View>
      </View>

      <View style={MonthlyTrendCardStyle.valueContainer}>
        <Text style={MonthlyTrendCardStyle.valueText}>
          ${lastWeekBalance.toLocaleString("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <View
          style={[
            MonthlyTrendCardStyle.percentageBadge,
            !isPositive && { backgroundColor: "rgba(239, 68, 68, 0.15)" },
          ]}
        >
          <MaterialCommunityIcons
            name={isPositive ? "arrow-up" : "arrow-down"}
            size={14}
            color={isPositive ? "#4EC896" : "#EF4444"}
          />
          <Text
            style={[
              MonthlyTrendCardStyle.percentageText,
              !isPositive && { color: "#EF4444" },
            ]}
          >
            {Math.abs(percentageChange).toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={MonthlyTrendCardStyle.chartContainer}>
        <CircleGrapic info={chartData} totalExpense={lastWeekBalance} />
      </View>

      <View style={MonthlyTrendCardStyle.chartLegend}>
        <View style={MonthlyTrendCardStyle.legendItem}>
          <View
            style={[
              MonthlyTrendCardStyle.legendDot,
              { backgroundColor: "#4E54C8" },
            ]}
          />
          <Text style={MonthlyTrendCardStyle.legendLabel}>Balance semanal</Text>
        </View>
        <View style={MonthlyTrendCardStyle.legendItem}>
          <View
            style={[
              MonthlyTrendCardStyle.legendDot,
              { backgroundColor: "#F97316" },
            ]}
          />
          <Text style={MonthlyTrendCardStyle.legendLabel}>Semana actual</Text>
        </View>
      </View>
    </View>
  );
}

export const MonthlyTrendCard = memo(MonthlyTrendCardComponent);
