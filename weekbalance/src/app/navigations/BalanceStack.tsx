import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../../balance/screens/HomeScreen/HomeScreen";

const Stack = createNativeStackNavigator();

function BalanceStack(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown:false,
        animation:'slide_from_right'
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />

    </Stack.Navigator>
  )
}

export default BalanceStack;