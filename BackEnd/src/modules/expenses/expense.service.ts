import { CreateExpenseDto } from "./dto/create-expensive.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { ExpensesRepository } from "./expenses.repository";
import { SavingService } from "../savings/savings.service";

export class ExpensesService {
  constructor(
    private readonly repo = new ExpensesRepository(),
    private readonly savingService = new SavingService(),
  ) {}

  async createExpense(dto: CreateExpenseDto) {
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
    if (account_id == "") {
      throw new Error("Cuenta no valida");
    }
    return this.repo.findByAccount(account_id);
  }

  getExpensesByCategory(accountId: string) {
    if (!accountId) {
      throw new Error("ID de cuenta requerido");
    }
    return this.repo.getExpensesByCategory(accountId);
  }

  async getWeeklyExpenseTotal(accountId: string) {
    const { weekStart, weekEnd } = this.getWeekDates();
    return await this.repo.getWeeklyTotal(accountId, weekStart, weekEnd);
  }

  async getWeeklyExpensesByCategory(accountId: string) {
    const { weekStart, weekEnd } = this.getWeekDates();
    return await this.repo.getWeeklyByCategory(accountId, weekStart, weekEnd);
  }

  async getWeeklyExpensesByDay(accountId: string) {
    const { weekStart, weekEnd } = this.getWeekDates();
    return await this.repo.getWeeklyByDay(accountId, weekStart, weekEnd);
  }

  async getDailyExpenses(accountId: string, startDate?: string, endDate?: string) {
    const start = startDate || new Date().toISOString();
    const end = endDate || new Date().toISOString();
    return await this.repo.getDailyTotal(accountId, start, end);
  }

  async updateExpense(data: UpdateExpenseDto) {
    if (!data.id || !data.account_id) {
      throw new Error("El ID del gasto y cuenta son requeridos");
    }

    const existing = await this.repo.findById(data.id);
    if (!existing) {
      throw new Error("El gasto no existe");
    }

    await this.repo.update(data);

    if (data.amount !== undefined) {
      const difference = data.amount - existing.amount;
      if (difference !== 0) {
        // Si el nuevo monto es mayor, hay que restar la diferencia del saldo
        const balanceDelta = -difference;
        await this.repo.adjustAccountBalance(data.account_id, balanceDelta);
      }
    }

    const weekDates = this.getWeekDates();
    await this.savingService.recalculateWeeklyGoal(
      data.account_id,
      weekDates.weekStart,
      weekDates.weekEnd,
    );
  }

  async getExpenseById(id: string) {
    const expense = await this.repo.findById(id);
    if (!expense) {
      throw new Error("Gasto no encontrado");
    }
    return expense;
  }
}
