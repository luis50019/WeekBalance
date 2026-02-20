import { View, ScrollView } from "react-native";
import { HomeScreenStyle } from "./HomeScreen.style";
import CardCurrentFound from "../../../shared/components/Cards/CardCurrentFouds/CardCurrentFound";
import { useContext } from "react";
import { BalanceContext } from "../../../core/context/ContextBalance";
import { CircleGrapic } from "../../../shared/components/Grapics/CircleGrapic";

function HomeScreen({ navigation }) {
  const { financialSummary, totalExpenses, totalIncomes, expenseAnalysis } =
    useContext(BalanceContext);

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
          balance={financialSummary?.balance?.balance || 0}
        />
        <CircleGrapic
          info={expenseAnalysis || null}
          totalExpense={totalExpenses}
        />
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
