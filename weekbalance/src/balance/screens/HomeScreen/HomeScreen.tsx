import { View } from "react-native";
import { HomeScreenStyle } from "./HomeScreen.style";
import Header from "../../components/layout/Header";
import CardCurrentFound from "../../../shared/components/Cards/CardCurrentFouds/CardCurrentFound";
import CardInfoWeekly from "../../../shared/components/Cards/CardInfoWeekly/CardInfoWeekly";
import { useInfoUser } from "../../hooks/useInfoUser";
import { useEffect } from "react";

function HomeScreen({ navigation }) {
  const { financialSummary,getDataFinancial } = useInfoUser();

  useEffect(()=>{
    getDataFinancial()
  },[])


  return (
    <View style={HomeScreenStyle.container}>
      <View style={HomeScreenStyle.body}>
        <Header />
        <CardCurrentFound key={1} balance={financialSummary?.balance?.balance! || 0}/>
        <CardInfoWeekly />
      </View>
    </View>
  );
}

export default HomeScreen;