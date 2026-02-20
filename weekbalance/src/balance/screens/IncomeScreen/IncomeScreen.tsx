import { ScrollView, Text, View } from "react-native";
import { IncomeScreenStyle } from "./IncomeScreen.style";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";
import { useFunds } from "../../hooks/useFunds";
import { useEffect } from "react";
import Transactions from "../../../shared/components/layout/transactions/Transactions";

function IncomeScreen() {
  const { getHistoryFunds, history } = useFunds();
  useEffect(() => {
    getHistoryFunds();
  }, []);

  return (
    <View style={IncomeScreenStyle.container}>
      <ScrollView
        contentContainerStyle={IncomeScreenStyle.body}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <Transactions dataIncomes={history} />
      </ScrollView>

      <FloatingButton to="AddFunds" />
    </View>
  );
}

export default IncomeScreen;
