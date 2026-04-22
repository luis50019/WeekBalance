import { Text, View, ActivityIndicator } from "react-native";
import { MonthlyTrendCardStyle } from "./MonthlyTrendCard.style";
import { LineChart } from "react-native-gifted-charts";
import { memo, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

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

interface DailyExpenseItem {
  day: string;
  total: number;
  value: number;
}

interface MonthlyTrendCardProps {
  data: WeeklyTrendData[] | DailyExpenseItem[] | null;
  loading?: boolean;
  isDailyData?: boolean;
}

function MonthlyTrendCardComponent({
  data,
  loading = false,
  isDailyData = false,
}: MonthlyTrendCardProps) {
  // Calcular totales para datos diarios
  const totalExpenses = useMemo(() => {
    if (!data || data.length === 0) return 0;
    if (isDailyData) {
      return (data as DailyExpenseItem[]).reduce((sum, item) => sum + (item.total || item.value || 0), 0);
    }
    return (data as WeeklyTrendData[]).reduce((sum, item) => sum + item.expenses, 0);
  }, [data, isDailyData]);

  // Configurar datos para la gráfica
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (isDailyData) {
      // Datos diarios (días de la semana)
      return (data as DailyExpenseItem[]).map((item) => ({
        value: Number(item.total || item.value) || 0,
        label: String(item.day || ""),
      }));
    } else {
      // Datos semanales (original)
      return (data as WeeklyTrendData[]).map((item) => ({
        value: Number(item.expenses) || 0,
        label: item.week,
        dataPointText: item.isCurrentWeek ? "$" + item.expenses.toFixed(0) : undefined,
      }));
    }
  }, [data, isDailyData]);

  // Calcular maxValue dinámicamente
  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 100;
    const max = Math.max(...chartData.map((d) => d.value));
    if (max === 0) return 100;
    const adjusted = max * 1.4;
    return Math.ceil(adjusted / 100) * 100 || 100;
  }, [chartData]);

  // Generar etiquetas del eje Y
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

  // Calcular spacing dinámico
  const spacing = Math.max(35, (screenWidth - 100) / chartData.length);

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
        <Text style={MonthlyTrendCardStyle.headerTitle}>
          {isDailyData ? "GASTOS DIARIOS" : "GASTOS SEMANALES"}
        </Text>
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
            {isDailyData ? "Total gastado esta semana" : "Total gastado"}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: "#9CA3AF", fontSize: 11 }}>
            {isDailyData ? "Semana actual" : "Período actual"}
          </Text>
          <Text style={{ color: "#EF4444", fontSize: 14, fontWeight: "600" }}>
            {isDailyData ? "Esta semana" : "Últimas semanas"}
          </Text>
        </View>
      </View>

      <View style={MonthlyTrendCardStyle.chartContainer}>
        <LineChart
          width={screenWidth - 80}
          height={160}
          spacing={spacing}
          initialSpacing={10}
          noOfSections={4}
          maxValue={maxValue}
          yAxisThickness={0}
          yAxisColor="transparent"
          xAxisThickness={1}
          xAxisColor="#3D4460"
          yAxisTextStyle={{ color: "#6B7280", fontSize: 10 }}
          yAxisLabelWidth={40}
          yAxisLabelTexts={yAxisLabels}
          xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 9, fontWeight: "600" }}
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
          <Text style={MonthlyTrendCardStyle.legendLabel}>
            {isDailyData ? "Gastos por día" : "Gastos por semana"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export const MonthlyTrendCard = memo(MonthlyTrendCardComponent);
