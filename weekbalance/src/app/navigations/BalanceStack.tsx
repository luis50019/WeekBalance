import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../../balance/screens/HomeScreen/HomeScreen";
import ExpenseScreen from "../../balance/screens/NewExpense/ExpenseScreen";
import FundsScreen from "../../balance/screens/NewFunds/FundsScreen";
import MainLayout from "../mainLayout/MainLayout";
import { BalanceProvider } from "../../core/context/BalanceProvider";
import IncomeScreen from "../../balance/screens/IncomeScreen/IncomeScreen";
import SavingScreen from "../../balance/screens/SavingScreen/SavingScreen";
import StadisticsScreen from "../../balance/screens/Stadistics/StatisticsScreen";

const Stack = createNativeStackNavigator();

function BalanceStack(){
  return(
    <BalanceProvider>
      <MainLayout>
      <Stack.Navigator
      screenOptions={{
        headerShown:false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddExpense" component={ExpenseScreen} />
      <Stack.Screen name="AddFunds" component={FundsScreen} /> 
      <Stack.Screen name="historyIncomes" component={IncomeScreen} />
      <Stack.Screen name="historySavings" component={SavingScreen} />
      <Stack.Screen name="stadistics" component={StadisticsScreen} />

    </Stack.Navigator>
    </MainLayout>
    </BalanceProvider>
  )
}

export default BalanceStack;