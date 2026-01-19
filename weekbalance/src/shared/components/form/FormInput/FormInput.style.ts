import { StyleSheet } from "react-native";
import { fs, hp, wp } from "../../../utils/responsive";

export const styleFormInput = StyleSheet.create({
  container: { 
    width:"100%",
  },
  input: {
    width: wp(80),
    height: hp(5),
    paddingLeft: 5,
    backgroundColor: "#fff",
    borderColor:"#dbdde6",
    borderWidth: 1,
    borderRadius: 10,

    shadowColor: "#a09f9f",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 2,
  },
  labelInput:{
    fontFamily:"Manrope , arial",
    paddingLeft:5,
    fontSize:fs(15),
    fontWeight:"400",
    color:"#636364",
    marginBottom:5,
  }
});