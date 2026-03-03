import { FlatList, View } from "react-native";
import CardHistory from "../../../shared/components/Cards/CardInfoHistory/CardInfoHistory";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";
import { styleExpensesScreen } from "./ExpensesScreen.style";
import { styleTransaction } from "../../../shared/components/layout/transactions/Transactions.style";
import TransactionCard from "../../../shared/components/Cards/CardTransaction/CardTransaction";
import { useEffect } from "react";
import { useDriverContext } from "../../../core/context/ContextBalance";
import EmptyData from "../../../shared/components/UI/emptyData/EmptyData";
import { useExpenses } from "../../hooks/useExpenses";
import { Slider } from "../../../shared/components/layout/Sliders/Slider";
import { getDataExpenses } from "../../../core/constants/Categories";

function ExpensesScreen() {
  const { totalExpenses } = useDriverContext();
  const { dataFilter, handlerFilter } = useExpenses();
  return (
    <View style={styleExpensesScreen.container}>
      <FlatList
        style={styleTransaction.container}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        data={dataFilter}
        ListHeaderComponent={
          <View>
            <CardHistory
              title="TOTAL DE GASTOS SEMANAL"
              amount={totalExpenses || 0}
              mouth="junio"
              year="2025"
            />
            <Slider
              handlerClick={handlerFilter}
              options={getDataExpenses()}
              title="categorias"
            />
          </View>
        }
        ListEmptyComponent={() => {
          return (
            <EmptyData
              title="Sin datos disponibles"
              message="Aun no has registrado ningun gastos"
            />
          );
        }}
        keyExtractor={({ id }) => id}
        renderItem={({ item, index }) => (
          <TransactionCard
            amount={item.amount || 0}
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
