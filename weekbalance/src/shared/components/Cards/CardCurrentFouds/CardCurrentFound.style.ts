import { StyleSheet } from "react-native";
import { COLORS } from "../../../../core/constants/Color";
import { fs } from "../../../utils/responsive";

export const CardCurrentFoundStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.Headers,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
  },
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle:{
    fontSize: fs(15),
    fontWeight: 'light',
    color: "#9c9c9c",
  },
  body:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  bodyAmount:{
    fontSize: fs(35),
    fontWeight: 'bold',
    color: COLORS.background,
  },
  bodyInitialAmount:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap:5
  },
  line:{
    borderBlockColor: '#023760',
    borderBottomWidth: 1,
  },
  buttonActions:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  }
});