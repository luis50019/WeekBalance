import { Text, View } from "react-native";
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import ButtonLink from "../../buttons/ButtonLink/ButtonLink";
import { CardCurrentFoundStyle } from "./CardCurrentFound.style";
import { COLORS } from "../../../../core/constants/Color";

function CardCurrentFound() {
  return (<View style={CardCurrentFoundStyle.container}>
    <View style={CardCurrentFoundStyle.header}>
      <Text style={CardCurrentFoundStyle.headerTitle}>SALDO ACTUAL</Text>
      <MaterialCommunityIcons name="wallet" size={30} color={COLORS.cardGold} />
    </View>
    <View style={CardCurrentFoundStyle.body}>
      <Text style={CardCurrentFoundStyle.bodyAmount}>$1,250.00</Text>
      <View style={CardCurrentFoundStyle.bodyInitialAmount}>
        <Text style={{color: COLORS.textSecondary,fontSize:12}}>SALDO INICIA:</Text>
        <Text style={{color: COLORS.textSecondary,fontSize:12}}>$500.00</Text>
      </View>
    </View>
    <View style={CardCurrentFoundStyle.line}></View>
    <View style={CardCurrentFoundStyle.buttonActions}>
      <ButtonLink colorBackground={COLORS.cardGold} colorLabel={COLORS.Headers} label="Añadir Fondos" nameIcon="add-circle" to="/"  />
      <ButtonLink colorBackground={COLORS.HeaderSlow} colorLabel={COLORS.background} label="Añadir Gasto" nameIcon="cash-outline" to="/"  />
    </View>
  </View> );
}

export default CardCurrentFound;