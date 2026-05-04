import { WeeklyMutationTemplate } from "../../../shared/patterns/WeeklyMutationTemplate";
import type { CreateExpenseDto } from "../dto/create-expensive.dto";
import { ExpensesRepository } from "../expenses.repository";
import { SavingService } from "../../savings/savings.service";

export class CreateExpenseWorkflow extends WeeklyMutationTemplate<CreateExpenseDto> {
  constructor(
    private readonly repo: ExpensesRepository,
    savingService: SavingService,
  ) {
    super(savingService);
  }

  protected validate(payload: CreateExpenseDto): void {
    if (payload.amount <= 0) {
      throw new Error("Monto inválido");
    }
  }

  protected async persist(payload: CreateExpenseDto): Promise<void> {
    await this.repo.create({ ...payload });
  }

  protected extractAccountId(payload: CreateExpenseDto): string {
    return payload.account_id;
  }
}
