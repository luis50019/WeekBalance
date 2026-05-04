import { WeeklyMutationTemplate } from "../../../shared/patterns/WeeklyMutationTemplate";
import type { CreateIncomeDto } from "../dto/create-income.dto";
import { IncomeRespository } from "../incomer.repository";
import { SavingService } from "../../savings/savings.service";

export class CreateIncomeWorkflow extends WeeklyMutationTemplate<CreateIncomeDto> {
  constructor(
    private readonly repo: IncomeRespository,
    savingService: SavingService,
  ) {
    super(savingService);
  }

  protected validate(payload: CreateIncomeDto): void {
    if (payload.amount <= 0) {
      throw new Error("El monto no es correcto");
    }
  }

  protected async persist(payload: CreateIncomeDto): Promise<void> {
    await this.repo.create(payload);
  }

  protected extractAccountId(payload: CreateIncomeDto): string {
    return payload.account_id;
  }
}
