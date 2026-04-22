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
import NewSavingScreen from "../../balance/screens/NewSavingScreen/NewSavingScreen";
import WeeklyGoalsScreen from "../../balance/screens/WeeklyGoalsScreen/WeeklyGoalsScreen";
import ProfileScreen from "../../balance/screens/ProfileScreen/ProfileScreen";
import EditFundsScreen from "../../balance/screens/EditFunds/EditFundsScreen";
import EditExpenseScreen from "../../balance/screens/EditExpense/EditExpenseScreen";
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
          <Stack.Screen name="historyExpenses" component={ExpensesScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditFunds" component={EditFundsScreen} />
          <Stack.Screen name="EditExpense" component={EditExpenseScreen} />
        </Stack.Navigator>
      </MainLayout>
    </BalanceProvider>
  );
}

export default BalanceStack;
