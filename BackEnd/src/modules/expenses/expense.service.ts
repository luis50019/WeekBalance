import { CreateExpenseDto } from "./dto/create-expensive.dto";
import { ExpensesRepository } from "./expenses.repository";

export class ExpensesService {
  constructor(private readonly repo = new ExpensesRepository()) {}

  createExpense(
    dto: CreateExpenseDto,
  ) {
    console.log(dto.account_id);
    if (dto.amount <= 0) {
      throw new Error("Monto inválido");
    }
    return this.repo.create({
      ...dto
    });
  }

  getExpensesHistoryByAccount(account_id:string){
    if(account_id == ""){
      throw new Error("Cuenta no valida");
    }
    return this.repo.findByAccount(account_id);
  }

}
