import { View, ScrollView } from "react-native";
import { HomeScreenStyle } from "./HomeScreen.style";
import CardCurrentFound from "../../../shared/components/Cards/CardCurrentFouds/CardCurrentFound";
import { useContext, memo } from "react";
import { BalanceContext } from "../../../core/context/BalanceProvider";
import CardInfoWeekly from "../../../shared/components/Cards/CardInfoWeekly/CardInfoWeekly";
import { MonthlyTrendCard } from "../../components/MonthlyTrendCard";
import { RecentExpenses } from "../../components/RecentExpenses";
import { useWeeklyTrend } from "../../hooks/useMonthlyTrend";
import { useRecentExpenses } from "../../hooks/useRecentExpenses";
import { CircleGrapic } from "../../../shared/components/Grapics/CircleGrapic";

function HomeScreen() {
  const { setChangeValue: setBalanceChange } = useContext(BalanceContext);
  const { balance, totalExpenses, totalIncomes, dailyExpenseAnalysis } =
    useContext(BalanceContext);
  const { data: trendData, loading: trendLoading } = useWeeklyTrend();
  const { data: recentExpenses, loading: recentLoading } = useRecentExpenses(5);

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
          balance={balance || 0}
        />
        <CardInfoWeekly />
        <MonthlyTrendCard data={dailyExpenseAnalysis} loading={trendLoading} isDailyData />
        <RecentExpenses data={recentExpenses} loading={recentLoading} />
      </ScrollView>
    </View>
  );
}

export default memo(HomeScreen);
