import { FlatList, ScrollView, Text, View } from "react-native";
import { IncomeScreenStyle } from "./IncomeScreen.style";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";
import { useFunds } from "../../hooks/useFunds";
import { useEffect } from "react";
import CardHistory from "../../../shared/components/Cards/CardInfoHistory/CardInfoHistory";
import { styleTransaction } from "../../../shared/components/layout/transactions/Transactions.style";
import TransactionCard from "../../../shared/components/Cards/CardTransaction/CardTransaction";
import EmptyData from "../../../shared/components/UI/emptyData/EmptyData";
import { useDriverContext } from "../../../core/context/ContextBalance";

function IncomeScreen() {
  const { totalIncomes } = useDriverContext();
  const { getHistoryFunds, history } = useFunds();
  useEffect(() => {
    getHistoryFunds();
  }, []);

  return (
    <View style={IncomeScreenStyle.container}>
      <FlatList
        style={styleTransaction.container}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        data={history}
        ListHeaderComponent={
          <CardHistory
            title="TOTAL DE INGRESO SEMANAL"
            amount={totalIncomes || 0}
            mouth="junio"
            year="2025"
          />
        }
        ListEmptyComponent={() => {
          return (
            <EmptyData
              title="Sin datos disponibles"
              message="Aun no has registrado algun ingreso"
            />
          );
        }}
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
      <FloatingButton to="AddFunds" />
    </View>
  );
}

export default IncomeScreen;
