import { useMemo } from "react";
import { Dimensions } from "react-native";
import { PropsGrapic } from "../interfaces/CircleGrapic";

const { width: screenWidth } = Dimensions.get("window");

type Props = Pick<PropsGrapic, "info">;

export const useCircleGrapic = ({ info }: Props) => {
  const lineData = useMemo(() => {
    if (!info || info.length === 0) return [];
    return info.map((item) => {
      const val = Number(item.value) || 0;
      console.log("-------------------- " + val);
      return {
        value: val === 0 ? null : val,
        label: String(item.text || item.day || ""),
      };
    });
  }, [info]);

  const chartConfig = useMemo(() => {
    const numPoints = lineData.length || 7;
    const spacing = Math.max(40, (screenWidth - 80) / numPoints);
    const width = screenWidth - 32;

    if (lineData.length === 0) {
      return {
        width,
        maxValue: 100,
        spacing,
        initialSpacing: 40,
        minValue: 0,
        yAxisLabels: ["$0", "$25", "$50", "$75", "$100"],
      };
    }

    const values = lineData
      .map((d) => d.value)
      .filter((v) => v !== null) as number[];
    const maxDataValue = values.length > 0 ? Math.max(...values) : 0;

    let finalMax: number;
    if (maxDataValue === 0) {
      finalMax = 100;
    } else {
      const adjusted = maxDataValue * 1.4;
      finalMax = Math.ceil(adjusted / 100) * 100;
      finalMax = Math.max(finalMax, 100);
    }

    const step = finalMax / 4;
    const yAxisLabels = [
      "$0",
      `$${Math.round(step).toLocaleString()}`,
      `$${Math.round(step * 2).toLocaleString()}`,
      `$${Math.round(step * 3).toLocaleString()}`,
      `$${finalMax.toLocaleString()}`,
    ];

    return {
      width,
      maxValue: finalMax,
      minValue: 0,
      spacing,
      initialSpacing: 40,
      yAxisLabels,
    };
  }, [lineData]);

  console.log("[useCircleGrapic] info:", JSON.stringify(info));
  console.log("[useCircleGrapic] lineData:", JSON.stringify(lineData));
  console.log("[useCircleGrapic] chartConfig:", JSON.stringify(chartConfig));

  return { chartConfig, lineData };
};

