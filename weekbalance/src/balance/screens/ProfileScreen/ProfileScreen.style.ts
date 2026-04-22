import { StyleSheet } from "react-native";
import { hp, wp } from "../../../shared/utils/responsive";
import { COLORS } from "../../../core/constants/Color";

export const ProfileScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(4),
  },
  backButton: {
    padding: wp(2),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: wp(3),
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: hp(4),
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1),
  },
  avatarText: {
    fontSize: 40,
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },
  avatarButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
  },
  avatarButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: hp(2),
  },
  inputContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    marginBottom: hp(2),
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: hp(0.5),
  },
  input: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.danger,
    borderWidth: 1,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: hp(0.5),
  },
  notificationsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    marginBottom: hp(2),
  },
  notificationText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  notificationDescription: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: hp(0.5),
  },
  buttonContainer: {
    marginTop: hp(3),
  },
  changePasswordButton: {
    marginTop: hp(2),
  },
  changePasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: "center",
  },
});
