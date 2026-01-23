import { View } from "react-native";
import NavBar from "../../../shared/components/navBar/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreenStyle } from "./HomeScreen.style";
import Header from "../../components/layout/Header";
import CardCurrentFound from "../../../shared/components/Cards/CardCurrentFouds/CardCurrentFound";

function HomeScreen({navigation}) {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={HomeScreenStyle.container}>
        <View style={HomeScreenStyle.body}>
          <Header/>
          <CardCurrentFound/>
        </View>
        <NavBar />
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;