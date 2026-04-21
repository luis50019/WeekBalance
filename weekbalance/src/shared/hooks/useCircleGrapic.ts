import { PropsGrapic } from "../interfaces/CircleGrapic";
const { width: screenWidth } = Dimensions.get("window");

type Props = Pick<PropsGrapic,"info">


export const useCircleGrapic = ({ info }:Props) => {
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
      return {
        width: screenWidth * 0.8,
        maxValue: 100,
        spacing: 40,
        minValue: 0,
      };
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

  return { chartConfig,lineData };
};
