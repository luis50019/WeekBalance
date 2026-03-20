import { CreateIncomeDto } from "./dto/create-income.dto";
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
}

