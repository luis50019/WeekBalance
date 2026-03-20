import { CreateExpenseDto } from "./dto/create-expensive.dto";
import { ExpensesRepository } from "./expenses.repository";
import { SavingService } from "../savings/savings.service";

export class ExpensesService {
  constructor(
    private readonly repo = new ExpensesRepository(),
    private readonly savingService = new SavingService(),
  ) {}

  async createExpense(dto: CreateExpenseDto) {
    console.log(dto.account_id);
    if (dto.amount <= 0) {
      throw new Error("Monto inválido");
    }

    await this.repo.create({
      ...dto,
    });

    const weekDates = this.getWeekDates();
    await this.savingService.recalculateWeeklyGoal(
      dto.account_id,
      weekDates.weekStart,
      weekDates.weekEnd,
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

  getExpensesHistoryByAccount(account_id: string) {
    console.log(account_id);
    if (account_id == "") {
      throw new Error("Cuenta no valida");
    }
    return this.repo.findByAccount(account_id);
  }
}
