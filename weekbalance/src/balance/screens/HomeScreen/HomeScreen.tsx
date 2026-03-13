import { View, ScrollView } from "react-native";
import { HomeScreenStyle } from "./HomeScreen.style";
import CardCurrentFound from "../../../shared/components/Cards/CardCurrentFouds/CardCurrentFound";
import { useContext, useEffect } from "react";
import { BalanceContext } from "../../../core/context/ContextBalance";
import { CircleGrapic } from "../../../shared/components/Grapics/CircleGrapic";
import CardInfoWeekly from "../../../shared/components/Cards/CardInfoWeekly/CardInfoWeekly";

function HomeScreen() {
  const { financialSummary, totalExpenses, totalIncomes, expenseAnalysis } =
    useContext(BalanceContext);
  useEffect(() => {
    console.log("expenses: " + totalExpenses);
    console.log("incomes: " + totalIncomes);
    console.log(financialSummary);
  }, []);
  return (
    <View style={HomeScreenStyle.container}>
      <ScrollView
        contentContainerStyle={HomeScreenStyle.body}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <CardCurrentFound
          expenses={totalExpenses || 0}
          incomes={totalIncomes || 0}
          balance={financialSummary?.balance.balance || 0}
        />
        <CardInfoWeekly />
        <CircleGrapic
          info={expenseAnalysis || null}
          totalExpense={totalExpenses}
        />
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
