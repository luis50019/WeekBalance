import { createContext, useContext } from "react";
import { IBalanceContext } from "../interfaces/IBalanceContext";

export const BalanceContext = createContext<IBalanceContext>(
  {} as IBalanceContext,
);

export const useDriverContext = () => useContext(BalanceContext);
