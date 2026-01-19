import { CreateSavingDto } from "./dto/create-savings.dto";
import { SavingsRespository } from "./savings.repository";


export class SavingService{
    constructor(private readonly repo = new SavingsRespository()) {}
    CreateSaving(data:CreateSavingDto){
        if(data.amount <= 0) throw new Error("El monto no es correcto")
        return this.repo.create(data);
    }

    getsSavingHistory(account_id:string){
        if(!account_id) throw new Error("El id de cuenta no es correcto")
        return this.repo.findByAccountSavinigHistory(account_id);
    }

}