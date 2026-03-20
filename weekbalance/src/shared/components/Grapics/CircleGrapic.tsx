import { View, Dimensions } from "react-native";
import { CircleGrapicStyle } from "./CircleGrapic.style";
import { LineChart } from "react-native-gifted-charts";
import { memo, useMemo } from "react";

const { width: screenWidth } = Dimensions.get("window");

interface ChartDataPoint {
  value: number;
  color: string;
  text: string;
  isCurrentWeek?: boolean;
}

interface PropsGrapic {
  info: ChartDataPoint[] | null;
  totalExpense: number | null;
}

function CircleGrapicComponent({ info, totalExpense = 0 }: PropsGrapic) {
  const lineData = useMemo(() => {
    if (!info || info.length === 0) return [];
    return info.map((item, index) => ({
      value: Math.max(0, Number(item.value) || 0),
      label: String(item.text),
      dataPointText: item.isCurrentWeek ? "●" : undefined,
      customDataPoint: item.isCurrentWeek
        ? () => (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#F97316",
                borderWidth: 2,
                borderColor: "#FFFFFF",
              }}
            />
          )
        : undefined,
    }));
  }, [info]);

  const chartConfig = useMemo(() => {
    if (lineData.length === 0) {
      return { width: screenWidth * 0.8, maxValue: 100, spacing: 40, minValue: 0 };
    }

    const values = lineData.map((d) => d.value);
    const maxDataValue = Math.max(...values, 0);
    const minDataValue = Math.min(...values, 0);

    const range = maxDataValue - minDataValue;
    let adjustedMax: number;

    if (maxDataValue === 0 && minDataValue === 0) {
      adjustedMax = 100;
    } else if (range === 0) {
      adjustedMax = Math.max(maxDataValue * 2, 100);
    } else {
      adjustedMax = maxDataValue * 1.3;
    }

    const containerWidth = screenWidth * 0.85;
    const totalSpacing = lineData.length * 50;
    const width = Math.max(containerWidth, totalSpacing);

    const finalMax = Math.ceil(adjustedMax / 100) * 100 || 100;
    const step = finalMax / 4;
    const yAxisLabels = [
      "$0",
      `$${Math.round(step).toLocaleString()}`,
      `$${Math.round(step * 2).toLocaleString()}`,
      `$${Math.round(step * 3).toLocaleString()}`,
      `$${Math.round(finalMax).toLocaleString()}`,
    ];

    return {
      width,
      maxValue: finalMax,
      minValue: 0,
      spacing: 50,
      yAxisLabels,
    };
  }, [lineData]);

  if (!info || info.length === 0 || !totalExpense) {
    return null;
  }

  return (
    <View style={CircleGrapicStyle.container}>
      <LineChart
        width={chartConfig.width}
        height={150}
        spacing={chartConfig.spacing}
        initialSpacing={15}
        noOfSections={4}
        maxValue={chartConfig.maxValue}
        minValue={chartConfig.minValue}
        yAxisThickness={0}
        yAxisColor="transparent"
        xAxisThickness={1}
        xAxisColor="#3D4460"
        yAxisTextStyle={{
          color: "#6B7280",
          fontSize: 10,
          fontWeight: "400",
        }}
        yAxisLabelWidth={40}
        yAxisLabelTexts={chartConfig.yAxisLabels}
        xAxisLabelTextStyle={{
          color: "#9CA3AF",
          fontSize: 9,
          fontWeight: "500",
        }}
        data={lineData}
        color="#4E54C8"
        thickness={2.5}
        startFillColor="#4E54C8"
        endFillColor="#8B5CF6"
        startOpacity={0.5}
        endOpacity={0.1}
        areaChart
        curved
        hideRules={false}
        rulesColor="rgba(61, 68, 96, 0.5)"
        rulesType="dashed"
        showVerticalLines={false}
        showDataPointOnFocus
        showStripOnFocus
        showScrollIndicator
        disableScroll={false}
        isAnimated
        animationDuration={800}
        dataPointsColor="#4E54C8"
        dataPointsRadius={4}
        hideDataPoints={false}
        spacing={chartConfig.spacing}
      />
    </View>
  );
}

export const CircleGrapic = memo(CircleGrapicComponent);
