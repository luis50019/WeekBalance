import { View, FlatList } from "react-native";
import { memo, useCallback } from "react";
import { ResponseIncomeDto } from "../../../../balance/types/Response/ResponseIncomeDto";
import TransactionCard from "../../Cards/CardTransaction/CardTransaction";
import { styleTransaction } from "./Transactions.style";

interface PropsTransactions {
  dataIncomes: ResponseIncomeDto[];
}

const FLATLIST_CONFIG = {
  initialNumToRender: 10,
  maxToRenderPerBatch: 10,
  windowSize: 10,
  removeClippedSubviews: true,
};

function TransactionsComponent({ dataIncomes }: PropsTransactions) {
  const renderItem = useCallback(({ item }: { item: ResponseIncomeDto }) => (
    <TransactionCard
      amount={item.amount}
      category={item.category}
      description={item.description || "Sin descripcion"}
      date={item.created_at}
    />
  ), []);

  const keyExtractor = useCallback((item: ResponseIncomeDto) => item.id, []);

  const ItemSeparator = useCallback(() => <View style={{ height: 10 }} />, []);

  return (
    <FlatList
      style={styleTransaction.container}
      data={dataIncomes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      {...FLATLIST_CONFIG}
    />
  );
}

export default memo(TransactionsComponent);
