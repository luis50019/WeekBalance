import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../balance/screens/HomeScreen/HomeScreen";
import ExpenseScreen from "../../balance/screens/NewExpense/NewExpenseScreen";
import FundsScreen from "../../balance/screens/NewFunds/FundsScreen";
import MainLayout from "../mainLayout/MainLayout";
import { BalanceProvider } from "../../core/context/BalanceProvider";
import IncomeScreen from "../../balance/screens/IncomeScreen/IncomeScreen";
import ExpensesScreen from "../../balance/screens/ExpenseScreen/ExpensesScreen";
import NewExpenseScreen from "../../balance/screens/NewExpense/NewExpenseScreen";
import SavingScreen from "../../balance/screens/SavingScreen/SavingScreen";
const Stack = createNativeStackNavigator();

function BalanceStack() {
  return (
    <BalanceProvider>
      <MainLayout>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddExpense" component={NewExpenseScreen} />
          <Stack.Screen name="AddFunds" component={FundsScreen} />
          <Stack.Screen name="Saving" component={SavingScreen} />
          <Stack.Screen name="historyIncomes" component={IncomeScreen} />
          <Stack.Screen name="historySavings" component={ExpensesScreen} />
        </Stack.Navigator>
      </MainLayout>
    </BalanceProvider>
  );
}

export default BalanceStack;
