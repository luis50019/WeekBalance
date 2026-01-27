import { useState } from "react"
import { FinancialSummaryDto } from "../types/Response/UserInfo.dto";
import { useAuthStore } from "../../auth/store";
import { getFinancialSummary } from "../api/user.service";

export const useInfoUser = ()=>{
  const [ financialSummary, setFinancialSummary ] = useState<FinancialSummaryDto | null>(null);
  const { profile,session } = useAuthStore();

  const getDataFinancial = async () => {
    try {
      
      if (!profile?.account_id || !session?.access_token) return;
      const response = await getFinancialSummary(profile?.account_id,session?.access_token);
      console.log(response.data);
      setFinancialSummary(response.data);

    } catch (error) {
      console.log(error)
    }
  }

  return { financialSummary,getDataFinancial };


}