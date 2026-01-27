import { Pressable, Text, View } from "react-native";
import { StyleWeeklyCard } from "./CardInfoWeekly.style";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons ,MaterialIcons  } from '@expo/vector-icons';
import { COLORS } from "../../../../core/constants/Color";

function CardInfoWeekly() {
  return (<LinearGradient
    colors={['#ecb912', '#c2970a']} start={{x:0,y:0}} end={{ x: 1, y: 0 }} style={StyleWeeklyCard.container}>
    <View style={StyleWeeklyCard.iconPigg}>
      <MaterialCommunityIcons name="piggy-bank" size={30} color="#fff" />
    </View>
    <View style={StyleWeeklyCard.infoCard}>
        <Text style={StyleWeeklyCard.headerInfoCard}>AHORRO SEMANAL</Text>
      <View style={StyleWeeklyCard.info}>
        <Text style={StyleWeeklyCard.textInfoCard}>$544.00</Text>
        <Text style={StyleWeeklyCard.subtitleInfoCard}>ahorrado</Text>
      </View>
    </View>
    <Pressable onPress={() => { }}>
      <View style={StyleWeeklyCard.buttonCard}>
        <MaterialIcons  name="arrow-forward-ios" size={25} color={COLORS.Headers} />
      </View>
    </Pressable>
  </LinearGradient>);
}

export default CardInfoWeekly;