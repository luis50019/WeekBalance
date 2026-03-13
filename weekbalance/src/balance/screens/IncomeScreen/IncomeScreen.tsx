import { FlatList, View } from "react-native";
import { IncomeScreenStyle } from "./IncomeScreen.style";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";
import { useFunds } from "../../hooks/useFunds";
import CardHistory from "../../../shared/components/Cards/CardInfoHistory/CardInfoHistory";
import { styleTransaction } from "../../../shared/components/layout/transactions/Transactions.style";
import TransactionCard from "../../../shared/components/Cards/CardTransaction/CardTransaction";
import EmptyData from "../../../shared/components/UI/emptyData/EmptyData";
import { useDriverContext } from "../../../core/context/ContextBalance";
import { Slider } from "../../../shared/components/layout/Sliders/Slider";
import { getDataOptions } from "../../../core/constants/Categories";

function IncomeScreen() {
  const { totalIncomes } = useDriverContext();
  const { dataFilter, handlerFilter } = useFunds();

  return (
    <View style={IncomeScreenStyle.container}>
      <FlatList
        style={styleTransaction.container}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        data={dataFilter}
        ListHeaderComponent={
          <View>
            <CardHistory
              title="TOTAL DE INGRESO SEMANAL"
              amount={totalIncomes || 0}
              mouth="junio"
              year="2025"
            />
            <Slider
              handlerClick={handlerFilter}
              options={getDataOptions()}
              title="categorias"
            />
          </View>
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
            date={item.created_at}
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
