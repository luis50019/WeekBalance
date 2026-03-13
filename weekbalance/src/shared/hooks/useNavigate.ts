import { useNavigation, CommonActions } from "@react-navigation/native";

export const useNavigate = () => {
  const navigation = useNavigation<any>();

  const navigationTo = (destination: string, params?: object) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: destination,
            params,
          },
        ],
      }),
    );
  };
  const navigatePush = (destination: string) => {
    navigation.push(destination);
  };

  const navigationToPath = (destination: string, params?: object) => {
    navigation.push(destination as never, params as never);
  };

  return {
    navigatePush,
    navigationTo,
    navigationToPath,
  };
};
