import { View } from "react-native";
import NavBar from "../../../shared/components/navBar/NavBar";
import H1 from "../../../shared/components/UI/title/Title";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreenStyle } from "./HomeScreen.style";
import Header from "../../components/layout/Header";

function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={HomeScreenStyle.container}>
        <View style={HomeScreenStyle.body}>
          <Header/>

        </View>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;