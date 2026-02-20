import { View, FlatList } from "react-native";
import { ResponseIncomeDto } from "../../../../balance/types/Response/ResponseIncomeDto";
import TransactionCard from "../../Cards/CardTransaction/CardTransaction";
import { styleTransaction } from "./Transactions.style";

interface PropsTransactions {
  dataIncomes: ResponseIncomeDto[];
}

export default function Transactions({ dataIncomes }: PropsTransactions) {
  return (
    <FlatList
      style={styleTransaction.container}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      data={dataIncomes}
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
  );
}
