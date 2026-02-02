import { ProgressChart, } from "react-native-chart-kit";
import { Dimensions, Text, View } from "react-native";;
import { CircleGrapicStyle } from "./CircleGrapic.style";
import { PieChart } from "react-native-gifted-charts";
import { IExpensesAnalisys } from "../../../core/interfaces/IExpensesAnlisys";
import { COLORS } from "../../../core/constants/Color";
import { fs } from "../../utils/responsive";
import { useEffect } from "react";

const screenWidth = Dimensions.get("window").width;

interface PropsGrapic {
  info: IExpensesAnalisys[] | null
  totalExpense: number | null
}


const data = [
  { value: 45, color: '#6C6CFF', text: 'Housing' },
  { value: 25, color: '#FF7A68', text: 'Food' },
  { value: 20, color: '#9AA5B1', text: 'Transport' },
  { value: 10, color: '#4A5568', text: 'Other' },
];

export const CircleGrapic = ({ info, totalExpense = 0 }: PropsGrapic) => {
  useEffect(() => {
    info?.map((item) => {
      console.log(item)
    })
  }, [])
  return (
    <>
      <Text style={CircleGrapicStyle.titleGrapic}>Gatos Reportados</Text>
      <View style={CircleGrapicStyle.container}>

        <PieChart
          donut
          innerRadius={70}
          radius={100}
          data={info!}
          centerLabelComponent={() => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#9CA3AF', fontSize: 12 }}>TOTAL</Text>
              <Text style={{ color: '#000000', fontSize: 22, fontWeight: 'bold' }}>
                $ {totalExpense?.toFixed(2)}
              </Text>
            </View>
          )}
        />
        <View style={CircleGrapicStyle.legendContainer}>
          {info && info.map((item, index) => (
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

