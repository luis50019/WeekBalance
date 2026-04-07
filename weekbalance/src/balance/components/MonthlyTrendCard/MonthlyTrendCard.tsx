import { Text, View, ActivityIndicator } from "react-native";
import { MonthlyTrendCardStyle } from "./MonthlyTrendCard.style";
import { LineChart } from "react-native-gifted-charts";
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

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
}

function MonthlyTrendCardComponent({
  data,
  loading = false,
}: MonthlyTrendCardProps) {
  const currentWeekRange = useMemo(() => {
    if (!data || data.length === 0) return "";
    const currentWeek = data.find(d => d.isCurrentWeek);
    if (currentWeek) {
      return formatDateRange(currentWeek.startDate, currentWeek.endDate);
    }
    return formatDateRange(data[0].startDate, data[0].endDate);
  }, [data]);

  const lastDayExpenses = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const currentDay = data.find(d => d.isCurrentWeek);
    return currentDay?.expenses ?? 0;
  }, [data]);

  const totalExpenses = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, day) => sum + day.expenses, 0);
  }, [data]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      value: Number(item.expenses) || 0,
      label: item.week,
      dataPointText: item.isCurrentWeek ? "$" + item.expenses.toFixed(0) : undefined,
    }));
  }, [data]);

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 100;
    const max = Math.max(...chartData.map(d => d.value));
    return max > 0 ? Math.ceil(max * 1.3 / 50) * 50 : 100;
  }, [chartData]);

  const yAxisLabels = useMemo(() => {
    const step = maxValue / 4;
    return [
      "$0",
      `$${Math.round(step)}`,
      `$${Math.round(step * 2)}`,
      `$${Math.round(step * 3)}`,
      `$${Math.round(maxValue)}`,
    ];
  }, [maxValue]);

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
        <Text style={MonthlyTrendCardStyle.headerTitle}>GASTOS SEMANALES</Text>
        <View style={MonthlyTrendCardStyle.headerIcon}>
          <MaterialCommunityIcons name="chart-line" size={18} color="#4E54C8" />
        </View>
      </View>

      <View style={MonthlyTrendCardStyle.valueContainer}>
        <View>
          <Text style={MonthlyTrendCardStyle.valueText}>
            ${totalExpenses.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>
            Total gastado
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: "#9CA3AF", fontSize: 11 }}>
            Período actual
          </Text>
          <Text style={{ color: "#EF4444", fontSize: 14, fontWeight: "600" }}>
            {currentWeekRange}
          </Text>
        </View>
      </View>

      <View style={MonthlyTrendCardStyle.chartContainer}>
        <LineChart
          width={280}
          height={160}
          spacing={35}
          initialSpacing={10}
          noOfSections={4}
          maxValue={maxValue}
          yAxisThickness={0}
          yAxisColor="transparent"
          xAxisThickness={1}
          xAxisColor="#3D4460"
          yAxisTextStyle={{ color: "#6B7280", fontSize: 10 }}
          yAxisLabelWidth={45}
          yAxisLabelTexts={yAxisLabels}
          xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 10, fontWeight: "600" }}
          data={chartData}
          color="#EF4444"
          thickness={2.5}
          curved
          hideRules
          showVerticalLines={false}
          isAnimated
          dataPointsColor="#EF4444"
          dataPointsRadius={4}
        />
      </View>

      <View style={MonthlyTrendCardStyle.chartLegend}>
        <View style={MonthlyTrendCardStyle.legendItem}>
          <View style={[MonthlyTrendCardStyle.legendDot, { backgroundColor: "#EF4444" }]} />
          <Text style={MonthlyTrendCardStyle.legendLabel}>Gastos por día</Text>
        </View>
      </View>
    </View>
  );
}

export const MonthlyTrendCard = memo(MonthlyTrendCardComponent);
