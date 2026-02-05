import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../shared/components/navBar/NavBar";
import { hp } from "../../shared/utils/responsive";
import { COLORS } from "../../core/constants/Color";
import Header from "../../balance/components/layout/Header";

function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <SafeAreaView style={{flex: 1,paddingHorizontal:20, height: hp(100),padding:0, margin:0,backgroundColor:COLORS.background}}>
      <Header />
      {children}
      <NavBar />
    </SafeAreaView>
  );
}

export default MainLayout;
