import { Text, View, ActivityIndicator, FlatList } from "react-native";
import { RecentExpensesStyle } from "./RecentExpenses.style";
import { memo } from "react";
import CardTransaction from "../../../shared/components/Cards/CardTransaction/CardTransaction";
import { ResponseIncomeDto } from "../../types/Response/ResponseIncomeDto";

interface RecentExpensesProps {
  data: ResponseIncomeDto[];
  loading?: boolean;
}

interface ExpenseItemProps {
  item: ResponseIncomeDto;
}

const ExpenseItem = memo(({ item }: ExpenseItemProps) => {
  return (
    <CardTransaction
      amount={item.amount}
      category={item.category}
      description={item.description || item.category}
      date={item.created_at}
    />
  );
});

function RecentExpensesComponent({ data, loading = false }: RecentExpensesProps) {
  if (loading) {
    return (
      <View style={RecentExpensesStyle.container}>
        <Text style={RecentExpensesStyle.headerTitle}>GASTOS RECIENTES</Text>
        <View style={RecentExpensesStyle.loadingContainer}>
          <ActivityIndicator size="small" color="#4E54C8" />
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={RecentExpensesStyle.container}>
        <Text style={RecentExpensesStyle.headerTitle}>GASTOS RECIENTES</Text>
        <Text style={RecentExpensesStyle.emptyText}>Sin gastos recientes</Text>
      </View>
    );
  }

  return (
    <View style={RecentExpensesStyle.container}>
      <Text style={RecentExpensesStyle.headerTitle}>GASTOS RECIENTES</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem item={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={RecentExpensesStyle.separator} />}
      />
    </View>
  );
}

export const RecentExpenses = memo(RecentExpensesComponent);
