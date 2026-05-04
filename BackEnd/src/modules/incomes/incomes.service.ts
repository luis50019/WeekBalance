import { CreateIncomeDto } from "./dto/create-income.dto";
import { UpdateIncomeDto } from "./dto/update-income.dto";
import { IncomeRespository } from "./incomer.repository";
import { SavingService } from "../savings/savings.service";
import { CreateIncomeWorkflow } from "./patterns/CreateIncomeWorkflow";
import { getCurrentWeekRange } from "../../shared/patterns/WeeklyMutationTemplate";

export class IncomesService {
  constructor(
    private readonly repo = new IncomeRespository(),
    private readonly savingService = new SavingService(),
    private readonly createWorkflow = new CreateIncomeWorkflow(
      repo,
      savingService,
    ),
  ) {}

  async CreateIncome(data: CreateIncomeDto) {
    await this.createWorkflow.execute(data);
  }

  getIncomeHistory(account_id: string) {
    if (!account_id) throw new Error("El id de cuenta no es correcto");
    return this.repo.findByAccountIncomeHistory(account_id);
  }

  async getWeeklyIncomeTotal(accountId: string) {
    const { weekStart, weekEnd } = getCurrentWeekRange();
    return await this.repo.getWeeklyTotal(accountId, weekStart, weekEnd);
  }

  async updateIncome(data: UpdateIncomeDto) {
    if (!data.id || !data.account_id) {
      throw new Error("El ID del ingreso y cuenta son requeridos");
    }

    const existing = await this.repo.findById(data.id);
    if (!existing) {
      throw new Error("El ingreso no existe");
    }

    await this.repo.update(data);

    if (data.amount !== undefined) {
      const difference = data.amount - existing.amount;
      if (difference !== 0) {
        await this.repo.adjustAccountBalance(data.account_id, difference);
      }
    }

    const weekDates = getCurrentWeekRange();
    await this.savingService.recalculateWeeklyGoal(
      data.account_id,
      weekDates.weekStart,
      weekDates.weekEnd
    );
  }

  async getIncomeById(id: string) {
    const income = await this.repo.findById(id);
    if (!income) {
      throw new Error("Ingreso no encontrado");
    }
    return income;
  }
}
