import { Text, View } from "react-native";
import { CircleGrapicStyle } from "./CircleGrapic.style";
import { PieChart } from "react-native-gifted-charts";
import { IExpensesAnalisys } from "../../../core/interfaces/IExpensesAnlisys";
import { useCallback, useEffect } from "react";

interface PropsGrapic {
  info: IExpensesAnalisys[] | null;
  totalExpense: number | null;
}

export const CircleGrapic = ({ info, totalExpense = 0 }: PropsGrapic) => {
  useEffect(() => {
    info?.map((item) => {
      console.log(item);
    });
  }, []);

  const CenterLabel = useCallback(
    () => (
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "#9CA3AF", fontSize: 12 }}>TOTAL</Text>
        <Text style={{ color: "#000", fontSize: 22, fontWeight: "bold" }}>
          $ {totalExpense!.toFixed(2)}
        </Text>
      </View>
    ),
    [totalExpense],
  );

  if (!info || info.length == 0 || !totalExpense) {
    return <Text>No hay datos</Text>;
  }

  return (
    <>
      <Text style={CircleGrapicStyle.titleGrapic}>Gatos Reportados</Text>
      <View style={CircleGrapicStyle.container}>
        <PieChart
          donut
          innerRadius={70}
          radius={100}
          data={info}
          centerLabelComponent={() => <CenterLabel />}
        />
        <View style={CircleGrapicStyle.legendContainer}>
          {info &&
            info.map((item, index) => (
              <View key={index} style={CircleGrapicStyle.legendRow}>
                <View
                  style={[
                    CircleGrapicStyle.legendDot,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={CircleGrapicStyle.legendLabel}>{item.text}</Text>
                <Text style={CircleGrapicStyle.legendValue}>{item.value}%</Text>
              </View>
            ))}
        </View>
      </View>
    </>
  );
};
