import { Image } from "react-native";
import { hp, wp } from "../../../utils/responsive";

const IconUrl = require("../../../../../assets/icons/Icon_WeekBalance.png");

function IconWallet() {
  return <Image source={IconUrl} style={{ height: hp(20), width: wp(20) }} />;
}

export default IconWallet;

