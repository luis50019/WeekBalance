import { CreateIncomeDto } from "./dto/create-income.dto";
import { UpdateIncomeDto } from "./dto/update-income.dto";
import { IncomeRespository } from "./incomer.repository";
import { SavingService } from "../savings/savings.service";

export class IncomesService {
  constructor(
    private readonly repo = new IncomeRespository(),
    private readonly savingService = new SavingService()
  ) {}

  async CreateIncome(data: CreateIncomeDto) {
    if (data.amount <= 0) throw new Error("El monto no es correcto");
    
    await this.repo.create(data);

    const weekDates = this.getWeekDates();
    await this.savingService.recalculateWeeklyGoal(
      data.account_id,
      weekDates.weekStart,
      weekDates.weekEnd
    );
  }

  private getWeekDates(): { weekStart: string; weekEnd: string } {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToSunday = dayOfWeek;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - diffToSunday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
    };
  }

  getIncomeHistory(account_id: string) {
    if (!account_id) throw new Error("El id de cuenta no es correcto");
    return this.repo.findByAccountIncomeHistory(account_id);
  }

  async getWeeklyIncomeTotal(accountId: string) {
    const { weekStart, weekEnd } = this.getWeekDates();
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

    const weekDates = this.getWeekDates();
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
