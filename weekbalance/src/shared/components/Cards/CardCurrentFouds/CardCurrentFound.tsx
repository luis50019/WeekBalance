import { Text, View } from "react-native";
import {MaterialCommunityIcons } from '@expo/vector-icons';
import { CardCurrentFoundStyle } from "./CardCurrentFound.style";
import { COLORS } from "../../../../core/constants/Color";
import { LinearGradient } from 'expo-linear-gradient';

interface CardCurrentFoundProps {
  balance: number;
  incomes: number;
  expenses: number;
}


function CardCurrentFound( { balance,expenses,incomes}: CardCurrentFoundProps) {
  return (<LinearGradient colors={[COLORS.backgroundCard, '#050846']} start={{x:0,y:0}} end={{ x: 1, y: 3 }} style={CardCurrentFoundStyle.container}>
    <View style={CardCurrentFoundStyle.header}>
      <Text style={CardCurrentFoundStyle.headerTitle}>SALDO ACTUAL</Text>
      <MaterialCommunityIcons name="wallet" size={30} color={'#adb1fd'} />
    </View>
    <View style={CardCurrentFoundStyle.body}>
      <Text style={CardCurrentFoundStyle.bodyAmount}>$ {balance.toFixed(2)}</Text>
    </View>
    <View style={CardCurrentFoundStyle.line}></View>
    <View style={CardCurrentFoundStyle.buttonActions}>
      <View style={CardCurrentFoundStyle.infoMoney}>
        <Text style={CardCurrentFoundStyle.infoMoneyTitle}>Total de ingresos</Text>
        <Text style={CardCurrentFoundStyle.infoMoneyTitleValue}>$ {incomes.toFixed(2)}</Text>
      </View>
      <View style={CardCurrentFoundStyle.infoMoney}>
        <Text style={CardCurrentFoundStyle.infoMoneyTitle}>Total de gastos</Text>
        <Text style={CardCurrentFoundStyle.infoMoneyTitleValue}>$ {expenses.toFixed(2)}</Text>
      </View>
    </View>
  </LinearGradient> );
}

export default CardCurrentFound;
/**
 * 
 * <ButtonLink colorBackground={COLORS.cardGold} colorLabel={COLORS.Headers} label="Añadir Fondos" nameIcon="add-circle" to="AddFunds"  />
      <ButtonLink colorBackground={COLORS.HeaderSlow} colorLabel={COLORS.background} label="Añadir Gasto" nameIcon="cash-outline" to="AddExpense"  />
 * 
 */