import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { useAuthStore } from "../../auth/store";
import BalanceStack from "./BalanceStack";

function AppNavigation(){
  const {user} = useAuthStore();
  return(
    <NavigationContainer>
      {user ? <BalanceStack/> : <AuthStack/>}
    </NavigationContainer>
  )
}

export default AppNavigation;