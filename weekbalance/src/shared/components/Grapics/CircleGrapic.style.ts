import { StyleSheet } from "react-native";
import { COLORS } from "../../../core/constants/Color";
import { fs } from "../../utils/responsive";

export const CircleGrapicStyle = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#26283a",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    height: 400,
  },
  titleGrapic: {
    textAlign: "left",
    width: "100%",
    color: COLORS.textPrimary,
    fontWeight: "bold",
    fontSize: fs(18),
  },
  centerLabel: {
    alignItems: "center",
  },
  centerSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
    letterSpacing: 1,
  },
  centerValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  legendContainer: {
    width: "100%",
    marginTop: 24,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendLabel: {
    flex: 1,
    color: "#9CA3AF",
    fontSize: 14,
  },
  legendValue: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

