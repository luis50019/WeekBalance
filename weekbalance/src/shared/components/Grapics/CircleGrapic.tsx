import { View } from "react-native";
import { CircleGrapicStyle } from "./CircleGrapic.style";
import { LineChart } from "react-native-gifted-charts";
import { memo } from "react";
import { PropsGrapic } from "../../interfaces/CircleGrapic";
import { useCircleGrapic } from "../../hooks/useCircleGrapic";

function CircleGrapicComponent({ info, totalExpense = 0 }: PropsGrapic) {
  const { lineData, chartConfig } = useCircleGrapic(info);

  if (!info || info.length === 0 || !totalExpense) {
    return null;
  }

  return (
    <View style={CircleGrapicStyle.container}>
      <LineChart
        width={chartConfig.width}
        height={160}
        spacing={chartConfig.spacing}
        initialSpacing={chartConfig.initialSpacing}
        noOfSections={4}
        maxValue={chartConfig.maxValue}
        minValue={0}
        yAxisThickness={1}
        yAxisColor="#3D4460"
        yAxisLabelWidth={38}
        yAxisTextStyle={{
          color: "#6B7280",
          fontSize: 9,
          fontWeight: "400",
        }}
        xAxisThickness={1}
        xAxisColor="#3D4460"
        xAxisLabelTextStyle={{
          color: "#9CA3AF",
          fontSize: 9,
          fontWeight: "500",
        }}
        data={lineData}
        dataPointsColor="#EF4444"
        dataPointsRadius={5}
        color="#EF4444"
        thickness={3}
        areaChart
        curved
        hideRules={false}
        rulesColor="#2A2E3F"
        rulesType="dashed"
        startFillColor="#EF4444"
        endFillColor="#EF4444"
        startOpacity={0.3}
        endOpacity={0.02}
        isAnimated
        animationDuration={500}
        showVerticalLines={false}
        hideDataPoints={false}
        showDataPointOnFocus
        showScrollIndicator={false}
        disableScroll
      />
    </View>
  );
}

export const CircleGrapic = memo(CircleGrapicComponent);

