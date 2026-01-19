import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";

function AppNavigation(){
  return(
    <NavigationContainer>
      <AuthStack/>  
    </NavigationContainer>
  )
}

export default AppNavigation;