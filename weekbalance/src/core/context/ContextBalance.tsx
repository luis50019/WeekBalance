import { createContext, useContext } from "react";
import { IBalanceContext } from "../interfaces/IBalanceContext";

export const BalanceContextLocal = createContext<IBalanceContext>(
  {} as IBalanceContext,
);

export const useDriverContext = () => useContext(BalanceContextLocal);

export const BalanceContext = createContext<{
  setChangeValue: () => void;
}>({
  setChangeValue: () => {},
});
