import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../../balance/screens/HomeScreen/HomeScreen";
import ExpenseScreen from "../../balance/screens/NewExpense/ExpenseScreen";
import FundsScreen from "../../balance/screens/NewFunds/FundsScreen";
import MainLayout from "../mainLayout/MainLayout";

const Stack = createNativeStackNavigator();

function BalanceStack(){
  return(
    <MainLayout>
      <Stack.Navigator
      screenOptions={{
        headerShown:false,
        animation:'slide_from_right'
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddExpense" component={ExpenseScreen} />
      <Stack.Screen name="AddFunds" component={FundsScreen} />

    </Stack.Navigator>
    </MainLayout>
  )
}

export default BalanceStack;