import { View } from "react-native";
import { CircleGrapicStyle } from "./CircleGrapic.style";
import { LineChart } from "react-native-gifted-charts";
import { memo } from "react";
import { PropsGrapic } from "../../interfaces/CircleGrapic";
import { useCircleGrapic } from "../../hooks/useCircleGrapic";

function CircleGrapicComponent({ info, totalExpense = 0 }: PropsGrapic) {
  const { lineData } = useCircleGrapic(info);

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
