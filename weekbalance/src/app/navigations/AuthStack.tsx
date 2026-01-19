import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../../auth/screens/LoginScreen/LoginScreen";
import RegisterScreen from "../../auth/screens/RegisterScreen/RegisteScreen";

const Stack = createNativeStackNavigator();

function AuthStack(){
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown:false,
        animation:'slide_from_right'
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

    </Stack.Navigator>
  )
}

export default AuthStack;