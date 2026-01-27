import { Text, View } from "react-native";
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import ButtonLink from "../../buttons/ButtonLink/ButtonLink";
import { CardCurrentFoundStyle } from "./CardCurrentFound.style";
import { COLORS } from "../../../../core/constants/Color";

interface CardCurrentFoundProps {
  balance: number;
}


function CardCurrentFound( { balance}: CardCurrentFoundProps) {
  return (<View style={CardCurrentFoundStyle.container}>
    <View style={CardCurrentFoundStyle.header}>
      <Text style={CardCurrentFoundStyle.headerTitle}>SALDO ACTUAL</Text>
      <MaterialCommunityIcons name="wallet" size={30} color={COLORS.cardGold} />
    </View>
    <View style={CardCurrentFoundStyle.body}>
      <Text style={CardCurrentFoundStyle.bodyAmount}>$ {balance}</Text>
    </View>
    <View style={CardCurrentFoundStyle.line}></View>
    <View style={CardCurrentFoundStyle.buttonActions}>
      <ButtonLink colorBackground={COLORS.cardGold} colorLabel={COLORS.Headers} label="Añadir Fondos" nameIcon="add-circle" to="AddFunds"  />
      <ButtonLink colorBackground={COLORS.HeaderSlow} colorLabel={COLORS.background} label="Añadir Gasto" nameIcon="cash-outline" to="AddExpense"  />
    </View>
  </View> );
}

export default CardCurrentFound;