import { ScrollView, Text, View } from "react-native";
import { COLORS } from "../../../core/constants/Color";
import { IncomeScreenStyle } from "./IncomeScreen.style";
import FloatingButton from "../../../shared/components/buttons/FloattingButton/FloattingButton";

function IncomeScreen() {
  return (<View style={IncomeScreenStyle.container}>
      <ScrollView
        contentContainerStyle={IncomeScreenStyle.body}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        
      </ScrollView>
      <FloatingButton to="AddFunds" />
    </View>);
}

export default IncomeScreen;