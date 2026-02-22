import { FlatList, ScrollView, Text, View } from "react-native";
import CardHistory from "../../../shared/components/Cards/CardInfoHistory/CardInfoHistory";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";
import { styleExpensesScreen } from "./ExpensesScreen.style";
import { styleTransaction } from "../../../shared/components/layout/transactions/Transactions.style";
import TransactionCard from "../../../shared/components/Cards/CardTransaction/CardTransaction";
import { useFunds } from "../../hooks/useFunds";
import { useEffect } from "react";

function ExpensesScreen() {
  const { getHistoryFunds, history } = useFunds();
  useEffect(() => {
    getHistoryFunds();
  }, []);

  return (
    <View style={styleExpensesScreen.container}>
      <FlatList
        style={styleTransaction.container}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        data={history}
        ListHeaderComponent={
          <CardHistory
            title="TOTAL DE GASTOS MENSUAL"
            amount={500}
            mouth="junio"
            year="2025"
          />
        }
        keyExtractor={({ id }) => id}
        renderItem={({ item, index }) => (
          <TransactionCard
            amount={item.amount}
            category={item.category}
            description={item.description || "Sin descripcion"}
            key={index}
          />
        )}
      />
      <FloatingButton to="AddExpense" />
    </View>
  );
}

export default ExpensesScreen;
