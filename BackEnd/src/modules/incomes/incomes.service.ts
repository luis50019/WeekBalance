import { CreateIncomeDto } from "./dto/create-income.dto";
import { IncomeRespository } from "./incomer.repository";

export class IncomesService{
    constructor(private readonly repo = new IncomeRespository()) {}

    CreateIncome(data:CreateIncomeDto){
        if(data.amount <= 0) throw new Error("El monto no es correcto")
        return this.repo.create(data);
    }

    getIncomeHistory(account_id:string){
        if(!account_id) throw new Error("El id de cuenta no es correcto")
        return this.repo.findByAccountIncomeHistory(account_id);
    }

}