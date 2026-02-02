import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";

export const StyleWeeklyCard = StyleSheet.create({
  container:{
    display:'flex',
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    padding: 15,
  },
  iconPigg: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f0f0f030',
    width:50,
    height:50,
    borderRadius:15
  },
  //style for the info card
  infoCard:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'flex-start',
  },
  headerInfoCard:{
    fontSize:16,
    fontWeight:'bold',
    color:COLORS.Headers,
    
  },
  info:{
    display:'flex',
    flexDirection:'row',
    alignItems:'flex-end',
  },
  subtitleInfoCard:{
    fontSize:10,
    color:COLORS.textPrimary,
    fontWeight:'light',
  },
  textInfoCard:{
    fontSize:22,
    fontWeight:'bold',
    color:COLORS.Headers
  },
  //style for the button card
  buttonCard:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#c09710',
    width:40,
    height:40,
    borderRadius:50
  }
})