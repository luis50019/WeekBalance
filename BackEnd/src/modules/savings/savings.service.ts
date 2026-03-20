import { CreateSavingDto } from "./dto/create-savings.dto";
import { CreateWeeklyGoalDto } from "./dto/create-weekly-goal.dto";
import { SavingsRespository } from "./savings.repository";

export class SavingService {
  constructor(private readonly repo = new SavingsRespository()) {}
  CreateSaving(data: CreateSavingDto) {
    if (data.amount <= 0) throw new Error("El monto no es correcto");
    return this.repo.create(data);
  }

  async createWeeklyGoal(data: CreateWeeklyGoalDto) {
    if (!data.account_id) throw new Error("El account_id es requerido");
    if (!data.target_amount || data.target_amount <= 0)
      throw new Error("El monto objetivo debe ser mayor a 0");
    if (!data.week_start || !data.week_end)
      throw new Error("Las fechas de semana son requeridas");

    const existingGoal = await this.repo.findActiveWeeklyGoal(
      data.account_id,
      data.week_start,
      data.week_end,
    );

    if (existingGoal) {
      throw new Error("Ya existe una meta semanal activa para este periodo");
    }

    return this.repo.createWeeklyGoal(data);
  }

  async registerSaving(
    account_id: string,
    amount: number,
    week_start: string,
    week_end: string,
  ) {
    if (!account_id) throw new Error("El account_id es requerido");
    if (!amount || amount <= 0) throw new Error("El monto debe ser mayor a 0");

    return this.repo.addSavingsMovement(
      account_id,
      amount,
      week_start,
      week_end,
      false,
    );
  }

  getsSavingHistory(account_id: string) {
    if (!account_id) throw new Error("El id de cuenta no es correcto");
    return this.repo.findByAccountSavinigHistory(account_id);
  }

  async getWeeklyGoals(account_id: string) {
    if (!account_id) throw new Error("El account_id es requerido");
    return this.repo.findWeeklyGoalsByAccount(account_id);
  }

  async recalculateWeeklyGoal(
    account_id: string,
    week_start: string,
    week_end: string,
  ): Promise<{ goalMet: boolean; currentAmount: number }> {
    const goal = await this.repo.findWeeklyGoalByDateRange(
      account_id,
      week_start,
      week_end,
    );

    if (!goal) {
      return { goalMet: false, currentAmount: 0 };
    }

    const totalIncome = await this.repo.getTotalIncomeForWeek(
      account_id,
      week_start,
      week_end,
    );
    const totalExpenses = await this.repo.getTotalExpensesForWeek(
      account_id,
      week_start,
      week_end,
    );

    const currentAmount = totalIncome - totalExpenses;
    const goalMet = currentAmount >= goal.target_amount;

    await this.repo.updateWeeklyGoalCurrentAmount(
      goal.id,
      Math.max(0, currentAmount),
    );

    if (goalMet && goal.status !== "completed") {
      await this.repo.updateWeeklyGoalStatus(goal.id, "completed");
    } else if (!goalMet) {
      const weekEndDate = new Date(week_end);
      const now = new Date();
      if (weekEndDate < now && goal.status !== "incomplete") {
        await this.repo.updateWeeklyGoalStatus(goal.id, "incomplete");
      }
    }

    return { goalMet, currentAmount };
  }
}
