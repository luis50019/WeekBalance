import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../shared/components/navBar/NavBar";
import { hp } from "../../shared/utils/responsive";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{flex: 1, height: hp(100),padding:0, margin:0}}>
      {children}
      <NavBar />
    </SafeAreaView>
  );
}

export default MainLayout;
